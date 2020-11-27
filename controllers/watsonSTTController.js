const fs = require('fs');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: '0ib9nZ4HLwbD219eQlG1juNVgSVs-UFndmeuqtIvJgQ5',
    }),
    serviceUrl: 'https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/7c87d7b7-befd-4b40-8798-67a1e17005bc',
});


let STT = async (req, res) => {
    console.log(req.files);

    const recognizeParams = {
        audio: fs.createReadStream(req.files.audio.path),
        contentType: 'application/octet-stream',
        wordAlternativesThreshold: 0.9,
        keywords: ['colorado', 'tornado', 'manzana'],
        keywordsThreshold: 0.5,
    };

    try {
        let response = await speechToText.recognize(recognizeParams);
        console.log(JSON.stringify(response.result, null, 2));
        res.send(response.result)
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    STT
}