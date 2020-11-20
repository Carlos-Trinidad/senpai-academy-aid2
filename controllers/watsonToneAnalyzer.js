const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: 'VvdyXNapGfXXuBUmowtEiapIcwGVfwn76oOUwaiqhuZU',
  }),
  serviceUrl: 'https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/2cab7463-b701-4a08-857c-83197a0ac81d',
});

let analyzeTone = async (req, res) => {

    const toneChatParams = {
        utterances: [
          {
            text: req.body.text,
            user: "customer",
          }
        ],
      };

      try {
        let response = await toneAnalyzer.toneChat(toneChatParams);
        res.send(response);
      } catch (error) {
          console.log(error);
      }
}

module.exports = {
    analyzeTone
}