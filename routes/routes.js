const express = require("express");
const router = express.Router();

const pingController = require("./../controllers/pingController");
const watsonAssistantController = require("./../controllers/watsonAssistantController");
const watsonVisualRecognitionController = require("./../controllers/watsonVisualRecognitionController");

/*
 Rutas de Ping
 */
router.get('/ping', pingController.getPing);

router.post('/watson/message', watsonAssistantController.sendMessage);
router.get('/watson/message', watsonAssistantController.sendMessage);

router.post("/watson/visual/classify", watsonVisualRecognitionController.classifyImage);

module.exports = router;