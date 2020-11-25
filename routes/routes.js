const express = require("express");
const router = express.Router();

const pingController = require("./../controllers/pingController");
const watsonAssistantController = require("./../controllers/watsonAssistantController");
const watsonVisualRecognitionController = require("./../controllers/watsonVisualRecognitionController");
const watsonNluController = require("./../controllers/watsonNluController");
const cloudantController = require("./../controllers/cloudantController")
const watsonTranslatorController = require("./../controllers/watsonTranslatorController");
const watsonToneAnalyzerController = require("./../controllers/watsonToneAnalyzer");

/*
 Rutas de Ping
 */
router.get('/ping', pingController.getPing);

router.post('/watson/message', watsonAssistantController.sendMessage);
router.get('/watson/message', watsonAssistantController.sendMessage);

router.post('/watson/message/tone', watsonAssistantController.sendMessageAnalysis);

router.post("/watson/visual/classify", watsonVisualRecognitionController.classifyImage);

router.get("/watson/nlu/analyze", watsonNluController.analyzeText);

router.post("/cloudant/insert/nlu", cloudantController.insertNlu);

router.post("/watson/translate", watsonTranslatorController.translate);

router.post("/watson/tone/analyze", watsonToneAnalyzerController.analyzeTone);

module.exports = router;