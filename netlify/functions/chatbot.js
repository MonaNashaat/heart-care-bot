import fetch from "node-fetch";

export async function handler(event) {
    try {
        const { question } = JSON.parse(event.body);

        if (!question) {
            return { statusCode: 400, body: JSON.stringify({ error: "يرجى إدخال سؤال." }) };
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4",  // يمكنك استخدام "gpt-3.5-turbo" لو أردت خطة أرخص
                messages: [{ role: "user", content: question }],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (response.status !== 200) {
            console.error("❌ API Error:", data);
            return { statusCode: response.status, body: JSON.stringify({ error: data.error.message }) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: data.choices[0]?.message?.content || "لم أتمكن من العثور على إجابة." })
        };

    } catch (error) {
        console.error("❌ Server Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "حدث خطأ داخلي في الخادم." }) };
    }
}