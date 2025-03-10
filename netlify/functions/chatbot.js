export async function handler(event) {
    try {
        const { message } = JSON.parse(event.body);

        if (!process.env.OPENAI_API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "API key is missing. Check your Netlify environment variables." })
            };
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",  
                messages: [{ role: "user", content: message }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `API Error: ${response.statusText}`, details: errorText })
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message })
        };
    }
}