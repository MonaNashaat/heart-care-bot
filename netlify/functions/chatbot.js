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

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",  // Use a cheaper model if needed
                messages: [{ role: "user", content: question }],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ API Error:", errorData);

            // Handle specific errors
            if (response.status === 429) {
                return {
                    statusCode: 429,
                    body: JSON.stringify({ error: "لقد وصلت إلى الحد الأقصى للاستخدام في OpenAI. يرجى التحقق من خطتك." })
                };
            }

            if (response.status === 401) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ error: "مفتاح API غير صحيح أو مفقود. يرجى التحقق من الإعدادات." })
                };
            }

            return {
                statusCode: response.status,
                body: JSON.stringify({ error: errorData.error?.message || "حدث خطأ غير متوقع في API." })
            };
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ answer: data.choices[0]?.message?.content || "لم أتمكن من العثور على إجابة." })
        };

    } catch (error) {
        console.error("❌ Server Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "حدث خطأ داخلي في الخادم." })
        };
    }
}