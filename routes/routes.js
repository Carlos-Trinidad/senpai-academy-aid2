const express = require("express");
const router = express.Router();

const pingController = require("./../controllers/pingController");
const watsonAssistantController = require("./../controllers/watsonAssistantController");

/*
 Rutas de Ping
 */
router.get('/ping', pingController.getPing);

router.post('/watson/message', watsonAssistantController.sendMessage);
router.get('/watson/message', watsonAssistantController.sendMessage);

module.exports = router;