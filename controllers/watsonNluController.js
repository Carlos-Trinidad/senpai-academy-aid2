const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');
    
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: '2020-08-01',
      authenticator: new IamAuthenticator({
        apikey: '5jbl68-MBUA6PMSQ1sW2wW7qvbUAKaNz6_Rr4i6Szt0e',
      }),
      serviceUrl: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/a2c0b2ff-1933-479b-aa62-00ad83f39f96',
    });

let analyzeText = async (req, res) => {
    
    const analyzeParams = {
      'url': req.query.url,
      'features': {
        'entities': {
          'emotion': true,
          'sentiment': true,
          'limit': 10,
        },
        'keywords': {
          'emotion': true,
          'sentiment': true,
          'limit': 10,
        },
        'concepts': {},
        'categories': {},
        'emotion': {},
        'sentiment': {}
      },
    };
    
    naturalLanguageUnderstanding.analyze(analyzeParams)
      .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        res.send(analysisResults);
      })
      .catch(err => {
        console.log('error:', err);
      });
}


module.exports = {
    analyzeText
}