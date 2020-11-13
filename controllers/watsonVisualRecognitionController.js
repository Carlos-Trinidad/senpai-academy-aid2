const fs = require('fs');
const VisualRecognitionV3 = require('ibm-watson/visual-recognition/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const visualRecognition = new VisualRecognitionV3({
    version: process.env.WATSON_VISUAL_RECOGNITION_VERSION,
    authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_VISUAL_RECOGNITION_APIKEY,
    }),
    serviceUrl: process.env.WATSON_VISUAL_RECOGNITION_URL,
});

let classifyImage = async (req, res) => {
    const classifyParams = {

        imagesFile: fs.createReadStream('./public/mrgato.jpg'),
        classifierIds: [process.env.WATSON_VISUAL_RECOGNITION_CLASSIFIER_ID_HOTELES],
    };

    try {

        let response = await visualRecognition.classify(classifyParams);

        let classifiedImages = response.result;
        console.log(JSON.stringify(classifiedImages, null, 2));
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    classifyImage
}

