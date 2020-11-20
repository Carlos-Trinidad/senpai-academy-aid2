const Cloudant = require("@cloudant/cloudant");

const cloudant = new Cloudant({
    url: "https://ff6cd9c0-c0b1-4084-8070-62dd1ee91bf5-bluemix:824d052e93cf46ac9ce96c733870402d949e6a7a4c07792d7ca532b4804c89bc@ff6cd9c0-c0b1-4084-8070-62dd1ee91bf5-bluemix.cloudantnosqldb.appdomain.cloud",
    plugins: {
        iamauth: {
            iamApiKey: "KvVCTRIeaee1dBOMzH0GrIbSOOjgu4e5F_npDyWbmSA6"
        }
    }
});

const insertNlu = async (req, res) => {
    const DB_NLU_DOCUMENTS = cloudant.use("nlu_documents");

    try {
        let response = await DB_NLU_DOCUMENTS.insert(req.body);
        console.log(response);
        res.send(response);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    insertNlu
}