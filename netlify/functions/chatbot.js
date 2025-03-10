const fetch = require('node-fetch');

exports.handler = async (event) => {
    const apiKey = process.env.OPENAI_API_KEY;

    const body = JSON.parse(event.body);
    const userMessage = body.message;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: userMessage }]
            })
        });

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "حدث خطأ أثناء الاتصال بـ OpenAI" })
        };
    }
};