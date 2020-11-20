const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    authenticator: new IamAuthenticator({
        apikey: 'HH4O6hm0K8CLDbPnZ34hmNWpJKARo65Yh2Sm4cr6ISrE',
    }),
    serviceUrl: 'https://api.us-south.language-translator.watson.cloud.ibm.com/instances/8a726098-8f73-4012-a01a-92c89abc64fb',
});


let translate = async (req, res) => {
    const translateParams = {
        text: req.body.text,
        modelId: 'es-en',
    };

    try {
        let response = await languageTranslator.translate(translateParams);
        res.send(response);
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    translate
}