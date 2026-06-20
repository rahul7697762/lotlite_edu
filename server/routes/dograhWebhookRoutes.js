const express = require('express');
const router = express.Router();
const dograhWebhookController = require('../controllers/dograhWebhookController');

// Dograh fires this after every completed workflow run
router.post('/dograh', dograhWebhookController.handleWebhook);

module.exports = router;
