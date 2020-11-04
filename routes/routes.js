const express = require("express");
const router = express.Router();

const pingController = require("./../controllers/pingController");

/*
 Rutas de Ping
 */
router.get('/ping', pingController.getPing);

router.post('/watson/assistant/message', (req, res) => { res.send({ message: "watson/assistant/message" }) });

module.exports = router;