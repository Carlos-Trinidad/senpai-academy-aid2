const express = require("express");
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const multipart = require('connect-multiparty');


const corsOptions = {
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization', 'access_token', 'ACCESS_TOKEN'],
  exposedHeaders: ['Content-Type', 'Authorization', 'access_token', 'ACCESS_TOKEN']
};

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(multipart());
app.use(express.static(__dirname + '/public'));

/* app.get("/", async (request, response) => {
    //const data = await procesarData();
    response.send("Hello World");
}) */

const routes = require("./routes/routes");

app.use('/api/v1', routes);

module.exports = app;