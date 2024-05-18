const express = require('express');
const OpenAI = require('openai');

const router = express.Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint for translating Y86 assembly code to C code
router.post('/', async (req, res) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: [
                        {
                            "type": "text",
                            "text": "You are a helper on learning Y86 assembly language. You will take a segment of Y86 code as input, generate corresponding C language program. If you think the input Y86 code has error, show them in your comments. Provide the output code only."
                        }]
                },
                {
                    role: "user",
                    content: [
                        {
                            "type": "text",
                            "text": req.body.code
                        }]
                }
            ],
            temperature: 1,
            max_tokens: 4095,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        // Assuming that response.data is the object where the completion result is stored
        console.log(response.choices[0].message)
        const translatedCode = response.choices[0].message.content;
        res.json({translatedCode});
    } catch (error) {
        console.error("Failed to fetch completion: ", error);
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
