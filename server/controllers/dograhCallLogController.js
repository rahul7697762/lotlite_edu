/**
 * dograhCallLogController.js
 *
 * REST API handlers for the Admin Panel to query saved Dograh call logs.
 *
 * Endpoints:
 *   GET    /api/dograh-call-logs           → paginated list with optional filters
 *   GET    /api/dograh-call-logs/:runId    → single log detail
 *   DELETE /api/dograh-call-logs/:runId    → delete a log
 */

const DograhCallLog = require('../models/DograhCallLog');

// ── GET /api/dograh-call-logs ─────────────────────────────────────────────────
exports.getCallLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      dateFrom,
      dateTo,
      search,
    } = req.query;

    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (dateFrom || dateTo) {
      filter.call_time = {};
      if (dateFrom) filter.call_time.$gte = new Date(dateFrom);
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        filter.call_time.$lte = to;
      }
    }

    // Search by workflow_run_name or phone in initial_context
    if (search) {
      filter.$or = [
        { workflow_run_name: { $regex: search, $options: 'i' } },
        { workflow_name: { $regex: search, $options: 'i' } },
        { 'initial_context.phone': { $regex: search, $options: 'i' } },
        { 'initial_context.customer_name': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      DograhCallLog.find(filter)
        .sort({ call_time: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      DograhCallLog.countDocuments(filter),
    ]);

    // Compute summary stats for the stats bar
    const [totalCalls, completedCalls, failedCalls] = await Promise.all([
      DograhCallLog.countDocuments({}),
      DograhCallLog.countDocuments({ status: 'completed' }),
      DograhCallLog.countDocuments({ status: 'failed' }),
    ]);

    // Aggregate total cost
    const costAgg = await DograhCallLog.aggregate([
      { $match: { 'cost_info.total_cost': { $exists: true } } },
      { $group: { _id: null, totalCost: { $sum: '$cost_info.total_cost' } } },
    ]);
    const totalCost = costAgg.length > 0 ? costAgg[0].totalCost : 0;

    return res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
      stats: {
        totalCalls,
        completedCalls,
        failedCalls,
        totalCost: totalCost.toFixed(4),
      },
    });
  } catch (err) {
    console.error('[DograhCallLog] getCallLogs error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ── GET /api/dograh-call-logs/:runId ─────────────────────────────────────────
exports.getCallLogDetail = async (req, res) => {
  try {
    const log = await DograhCallLog.findOne({
      workflow_run_id: Number(req.params.runId),
    }).lean();

    if (!log) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }

    return res.json({ success: true, data: log });
  } catch (err) {
    console.error('[DograhCallLog] getCallLogDetail error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};

// ── DELETE /api/dograh-call-logs/:runId ──────────────────────────────────────
exports.deleteCallLog = async (req, res) => {
  try {
    const result = await DograhCallLog.findOneAndDelete({
      workflow_run_id: Number(req.params.runId),
    });

    if (!result) {
      return res.status(404).json({ success: false, error: 'Log not found' });
    }

    return res.json({ success: true, message: 'Log deleted' });
  } catch (err) {
    console.error('[DograhCallLog] deleteCallLog error:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
