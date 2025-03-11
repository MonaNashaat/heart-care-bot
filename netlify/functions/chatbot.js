import fetch from "node-fetch";

export async function handler(event) {
    try {
        const { question } = JSON.parse(event.body);

        if (!question) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "يرجى إدخال سؤال." })
            };
        }

        console.log("🔍 Received question:", question);

        const messages = [{ role: "user", content: question }];
        let fullAnswer = "";

        while (true) {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",      // يمكنك تغييره إلى "gpt-4" إذا أردت
                    messages,
                    max_tokens: 1000,           // السماح بإجابات أطول
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ API Error:", errorText);

                return {
                    statusCode: response.status,
                    body: JSON.stringify({ error: `OpenAI API Error: ${errorText}` })
                };
            }

            const data = await response.json();
            const answerChunk = data.choices[0]?.message?.content || "";

            fullAnswer += answerChunk;

            // تحقق من انتهاء الرد أو استمرار الطلب
            if (answerChunk.length < 1000) {
                break;
            }

            messages.push({ role: "assistant", content: answerChunk });
        }

        console.log("✅ Full Answer Generated!");

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: fullAnswer })
        };

    } catch (error) {
        console.error("❌ Server Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "حدث خطأ داخلي في الخادم." })
        };
    }
}