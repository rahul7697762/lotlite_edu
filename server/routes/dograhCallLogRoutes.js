const express = require('express');
const router = express.Router();
const dograhCallLogController = require('../controllers/dograhCallLogController');

// Admin Panel: list all call logs (paginated + filtered)
router.get('/dograh-call-logs', dograhCallLogController.getCallLogs);

// Admin Panel: single log detail
router.get('/dograh-call-logs/:runId', dograhCallLogController.getCallLogDetail);

// Admin Panel: delete a log
router.delete('/dograh-call-logs/:runId', dograhCallLogController.deleteCallLog);

module.exports = router;
