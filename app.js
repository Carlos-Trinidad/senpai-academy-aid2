const express = require("express");
const app = express();

app.get("/", async (request, response) => {
    /* const data = await procesarData(); */
    response.send("Hello World");
})

module.exports = app;