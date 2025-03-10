export async function handler(event) {
    try {
        const { message } = JSON.parse(event.body);
        const apiKey = process.env.HUGGINGFACE_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "API key is missing. Check your Hugging Face environment variables." })
            };
        }

        const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({ inputs: message })
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ content: data.generated_text })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message })
        };
    }
}