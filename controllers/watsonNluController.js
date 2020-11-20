const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');
const axios = require("axios");

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2020-08-01',
  authenticator: new IamAuthenticator({
    apikey: '5jbl68-MBUA6PMSQ1sW2wW7qvbUAKaNz6_Rr4i6Szt0e',
  }),
  serviceUrl: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/a2c0b2ff-1933-479b-aa62-00ad83f39f96',
});

let analyzeText = async (req, res) => {

  const analyzeParams = {
    url: req.query.url,
    features: {
      entities: {
        sentiment: true,
        emotion: true,
        limit: 10,
      },
      keywords: {
        sentiment: true,
        limit: 10,
      },
      concepts: {
        limit: 10,
      },
      metadata: {},
      relations: {},
      sentiment: {},
      categories: {
        limit: 10,
      }
    },
    returnAnalyzedText: true,
    language: 'es'
  };

  try {
    let response = await naturalLanguageUnderstanding.analyze(analyzeParams);
    console.log(response);
    let analysisResults = response.result;

    enviarAnalisisACloudant(analysisResults);

    res.send(response);
  } catch (error) {
    console.log('error:', error);
  }
}

let enviarAnalisisACloudant = async (data) => {
  axios
    .post(`http://localhost:3000/api/v1/cloudant/insert/nlu`, data)
    .then(function (response) {
      /* console.log(response.data); */
    })
    .catch(function (error) {
      console.log(error);
/*       console.log(error.data);
      console.log(error.message) */
    });
}


module.exports = {
  analyzeText
}