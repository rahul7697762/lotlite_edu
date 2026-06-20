const mongoose = require('mongoose');

/**
 * DograhCallLog
 *
 * Stores every webhook payload received from Dograh after a voice-agent
 * workflow run completes. workflow_run_id is the idempotency key — if a
 * duplicate delivery arrives we skip it.
 */
const DograhCallLogSchema = new mongoose.Schema(
  {
    workflow_run_id: {
      type: Number,
      required: true,
      unique: true, // idempotency key
    },
    workflow_run_name: { type: String, trim: true },
    workflow_id: { type: Number },
    workflow_name: { type: String, trim: true },
    campaign_id: { type: Number, default: null },

    // ISO-8601 UTC timestamp sent by Dograh
    call_time: { type: Date },

    // Full context objects from the Dograh payload
    initial_context: { type: mongoose.Schema.Types.Mixed, default: {} },
    gathered_context: { type: mongoose.Schema.Types.Mixed, default: {} },
    cost_info: { type: mongoose.Schema.Types.Mixed, default: {} },
    annotations: { type: mongoose.Schema.Types.Mixed, default: {} },

    // Recording & transcript
    recording_url: { type: String, default: null },
    transcript_url: { type: String, default: null },

    // Derived status (we infer this from gathered_context.resolution)
    status: {
      type: String,
      enum: ['completed', 'failed', 'unknown'],
      default: 'unknown',
    },

    // Optional back-reference to the Lead this call belongs to
    leadRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      default: null,
    },
  },
  { timestamps: true }
);

// Index for common query patterns
DograhCallLogSchema.index({ call_time: -1 });
DograhCallLogSchema.index({ leadRef: 1 });
DograhCallLogSchema.index({ status: 1 });

module.exports = mongoose.model('DograhCallLog', DograhCallLogSchema);
