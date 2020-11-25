const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
const axios = require('axios');

const assistant = new AssistantV2({
    version: process.env.WATSON_ASSISTANT_VERSION,
    authenticator: new IamAuthenticator({
        apikey: process.env.WATSON_ASSISTANT_APIKEY,
    }),
    serviceUrl: process.env.WATSON_ASSISTANT_URL,
});

let sendMessage = async (req, res) => {
    try {
        let assistantId = process.env.WATSON_ASSISTANT_ASSISTANT_ID;
        let sessionId = req.body.sessionId ? req.body.sessionId : await createSession(assistantId);
        let text = req.body.text;

        /*
        POST:
        req.body.text

        GET:
        req.params.text (/message/:text)
        or
        req.query.text (/message?text='')
        */

        let payload = {
            assistantId: assistantId,
            sessionId: sessionId,
            input: {
                'message_type': 'text',
                'text': text,
                options: {
                    return_context: true
                }
            },
        };

        console.log(payload);

        let response = await assistant.message(payload);

        console.log(JSON.stringify(response, null, 2));

        res.status(200).send({
            success: true,
            sessionId: sessionId,
            result: response.result.output.generic,
            intenciones: response.result.output.intents,
            context: response.result.context
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

let sendMessageAnalysis = async (req, res) => {
    console.log('Entramos a sendMessageAnalysis');
    console.log(req.body);

    try {

        let responseTranslation = await axios.post('http://localhost:3000/api/v1/watson/translate', { text: req.body.text });
        let translationObject = responseTranslation.data.result;
        console.log(translationObject);

        let responseEmotion = await axios.post('http://localhost:3000/api/v1/watson/tone/analyze', { text: translationObject.translations[0].translation });
        let emotionObject = responseEmotion.data.result;

        console.log(JSON.stringify(emotionObject, null, 2));

        emotionObject = emotionObject.utterances_tone[0].tones.reduce(function (prev, current) {
            return prev.score > current.score ? prev : current;
        });
        console.log(JSON.stringify(emotionObject, null, 2))

        let emotionValue = emotionObject.tone_id;

        //Actualizando contexto
        let context = req.body.context;
        context.skills['main skill'].user_defined.emocion = emotionValue;

        //Enviando a asisstant

        let assistantId = process.env.WATSON_ASSISTANT_ASSISTANT_ID;
        let sessionId = req.body.sessionId ? req.body.sessionId : await createSession(assistantId);
        let text = req.body.text;

        let payload = {
            assistantId: assistantId,
            sessionId: sessionId,
            input: {
                'message_type': 'text',
                'text': text,
                options: {
                    return_context: true
                }
            },
            context: context
        };

        console.log(payload);

        let response = await assistant.message(payload);

        console.log(JSON.stringify(response, null, 2));

        res.status(200).send({
            success: true,
            sessionId: sessionId,
            result: response.result.output.generic,
            intenciones: response.result.output.intents,
            context: response.result.context
        });


    } catch (error) {
        console.log(error);
    }

}

let createSession = async (assistantId) => {
    let response = await assistant.createSession({ assistantId: assistantId });
    console.log(`Nueva Session_ID creada: ${response.result.session_id}`);
    return response.result.session_id;
}

module.exports = {
    sendMessage,
    sendMessageAnalysis
}