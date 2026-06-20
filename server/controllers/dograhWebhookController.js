/**
 * dograhWebhookController.js
 *
 * Handles incoming POST /api/webhooks/dograh requests from Dograh.
 * Dograh fires these asynchronously after each workflow run completes.
 *
 * Flow:
 *   1. Authenticate via x-api-key header
 *   2. Respond 200 immediately (Dograh requires fast ACK)
 *   3. Idempotency check – skip duplicate workflow_run_id
 *   4. Persist to DograhCallLog collection
 *   5. Update matching Lead document (matched by phone from initial_context)
 */

const DograhCallLog = require('../models/DograhCallLog');
const Lead = require('../models/Lead');

/**
 * Derive a simple status from the gathered_context.
 * Adjust the logic here to match your actual Dograh agent output fields.
 */
function deriveStatus(gathered_context = {}) {
  const resolution = (gathered_context.resolution || gathered_context.outcome || gathered_context.mapped_call_disposition || gathered_context.call_disposition || '').toLowerCase();
  if (!resolution) return 'unknown';
  const failKeywords = ['not reachable', 'no answer', 'busy', 'failed', 'disconnected', 'voicemail', 'user_hangup'];
  if (failKeywords.some(k => resolution.includes(k))) return 'failed';
  return 'completed';
}

exports.handleWebhook = async (req, res) => {
  // ── 1. Authentication ─────────────────────────────────────────────────────
  const secret = process.env.DOGRAH_WEBHOOK_SECRET;
  if (secret) {
    const receivedKey = req.headers['x-api-key'] || req.headers['x-webhook-secret'];
    if (receivedKey !== secret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // ── 2. Respond immediately so Dograh doesn't timeout ─────────────────────
  res.status(200).json({ status: 'ok' });

  // ── 3. Parse payload ──────────────────────────────────────────────────────
  const parseJSON = (val) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return {}; }
    }
    return val || {};
  };

  const initial_context = parseJSON(req.body.initial_context);
  const gathered_context = parseJSON(req.body.gathered_context);
  const cost_info = parseJSON(req.body.cost_info);
  const annotations = parseJSON(req.body.annotations);
  
  const {
    workflow_run_id,
    workflow_run_name,
    workflow_id,
    workflow_name,
    campaign_id,
    call_time,
    recording_url,
    transcript_url,
  } = req.body;

  if (!workflow_run_id) {
    console.warn('[DograhWebhook] Missing workflow_run_id — skipping');
    return;
  }

  try {
    // ── 4. Idempotency check ───────────────────────────────────────────────
    const exists = await DograhCallLog.findOne({ workflow_run_id });
    if (exists) {
      console.log(`[DograhWebhook] Duplicate delivery for run_id=${workflow_run_id} — skipping`);
      return;
    }

    // ── 5. Resolve leadRef (match by phone from initial_context) ──────────
    const phone = initial_context.phone || initial_context.phone_number || null;
    let leadRef = null;
    if (phone) {
      const lead = await Lead.findOne({ phone });
      if (lead) leadRef = lead._id;
    }

    // ── 6. Calculate precise cost if missing ───────────────────────────────
    if (typeof cost_info === 'object' && cost_info.total_cost === undefined) {
      let calculatedCostUsd = 0;

      // a. LLM Token Costs (Estimated at $5/1M input, $15/1M output)
      if (cost_info.llm) {
        for (const usage of Object.values(cost_info.llm)) {
          const pTokens = usage.prompt_tokens || 0;
          const cTokens = usage.completion_tokens || 0;
          calculatedCostUsd += (pTokens / 1000000) * 5.0;
          calculatedCostUsd += (cTokens / 1000000) * 15.0;
        }
      }

      // b. TTS Character Costs (Estimated at $0.0001 per character)
      if (cost_info.tts) {
        for (const chars of Object.values(cost_info.tts)) {
           calculatedCostUsd += (typeof chars === 'number' ? chars : 0) * 0.0001;
        }
      }

      // c. Telephony Cost (Estimated at $0.01 per minute)
      const duration = cost_info.call_duration_seconds || 0;
      calculatedCostUsd += (duration / 60) * 0.01;

      cost_info.total_cost = calculatedCostUsd;
    }

    // ── 7. Persist call log ────────────────────────────────────────────────
    const status = deriveStatus(gathered_context);
    const callLog = await DograhCallLog.create({
      workflow_run_id,
      workflow_run_name,
      workflow_id,
      workflow_name,
      campaign_id: campaign_id ?? null,
      call_time: call_time ? new Date(call_time) : new Date(),
      initial_context,
      gathered_context,
      cost_info,
      annotations,
      recording_url: recording_url || null,
      transcript_url: transcript_url || null,
      status,
      leadRef,
    });

    console.log(`[DograhWebhook] Saved log: run_id=${workflow_run_id} status=${status} lead=${leadRef || 'none'}`);

    // ── 7. Update Lead if matched ─────────────────────────────────────────
    if (leadRef) {
      const outcome = gathered_context.resolution || gathered_context.outcome || 'Call Completed';
      await Lead.findByIdAndUpdate(leadRef, {
        dograhCallOutcome: outcome,
        dograhLastCallAt: callLog.call_time,
      });
      console.log(`[DograhWebhook] Updated Lead ${leadRef} with outcome="${outcome}"`);
    }
  } catch (err) {
    console.error('[DograhWebhook] Error processing payload:', err.message || err);
  }
};
