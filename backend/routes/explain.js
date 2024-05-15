const express = require('express');
const OpenAI = require('openai');

const router = express.Router();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint for explaining current state and predictions of Y86 code execution
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
                            "text": "You are a helper on learning Y86 assembly language. Your input will be object code and assembly code, where <Current> </Current> is used to mark which line we are in right now, and you will be provided with registers, flags, and status info. Briefly explain what happens at this moment and what will happen next."
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
        const explanation = response.choices[0].message.content;
        res.json({explanation});
    } catch (error) {
        console.error("Failed to fetch completion: ", error);
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
