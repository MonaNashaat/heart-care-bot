export async function handler(event) {
    try {
        const { message } = JSON.parse(event.body);

        if (!process.env.HUGGINGFACE_API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "API key is missing. Check your environment variables." })
            };
        }

        const response = await fetch("https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`
            },
            body: JSON.stringify({ inputs: message })
        });

        const data = await response.json();

        console.log("🔍 API Response:", data); // ✅ طباعة الرد في الـ Logs

        // محاولة الوصول للنص المُولد
        const botResponse = data.generated_text || (Array.isArray(data) && data[0]?.generated_text) || "لم أتمكن من فهم سؤالك.";

        return {
            statusCode: 200,
            body: JSON.stringify({ content: botResponse })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message })
        };
    }
}