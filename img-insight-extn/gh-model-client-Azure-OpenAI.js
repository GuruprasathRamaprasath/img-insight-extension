const { AzureOpenAI } = require("openai");
const { writeResponse } = require('./util');
const ChatResponseMessage = require('./messages');

const modelName = "gpt-4o";

async function chatProcessing(messages,token, res) {
    console.log("model call");
    const client = new AzureOpenAI();
    let response = null;
    try {
        response = await client.chat.completions.create({
            messages: messages,
              model: modelName,
              temperature: 1.,
              max_tokens: 1000,
              top_p: 1.
            });

    } catch (error) {
        console.error("Error occurred while calling the model:", error);
        writeResponse(res, ChatResponseMessage.MODEL_ERROR);
    }
    // Check if headers are already sent
    if (!res.headersSent) {
        // Set the appropriate headers
        res.setHeader('Content-Type', 'application/json');
    } 

    //console.log("response", response.body);
    if (response && response.choices) {
        for (const choice of response.choices) {
            //console.log(choice.message?.content ?? ``);
            writeResponse(res,
                choice.message?.content ?? ``,
                response.id,
                response.object,
                response.model,
                response.system_fingerprint,
                choice.index,
                choice.logprobs
            );
        }
    }
}

module.exports = { chatProcessing }
