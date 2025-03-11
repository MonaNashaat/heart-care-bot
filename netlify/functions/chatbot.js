import fetch from "node-fetch";

export async function handler(event) {
    try {
        const { question } = JSON.parse(event.body);

        if (!question) {
            return { statusCode: 400, body: JSON.stringify({ error: "يرجى إدخال سؤال." }) };
        }

        const response = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: question })
        });

        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ answer: data[0]?.generated_text || "لم أتمكن من العثور على إجابة." })
        };

    } catch (error) {
        console.error("❌ Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "حدث خطأ أثناء معالجة السؤال." }) };
    }
}