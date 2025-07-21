import { fetch } from "undici";
import qaData from "./qa_responses.json" assert { type: "json" };

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." }),
    };
  }

  try {
    const { question, type } = JSON.parse(event.body);

    if (!question) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "يرجى إدخال سؤال." }),
      };
    }

    // تحقق من الردود المحفوظة
    const normalized = question.trim().replace(/[?.!]/g, "");
    const storedAnswer = qaData[normalized];
    if (storedAnswer) {
      return {
        statusCode: 200,
        body: JSON.stringify({ answer: storedAnswer }),
      };
    }

    // اقتراحات الأسئلة
    if (type === "suggestion") {
      const prompt = `
        المستخدم بدأ يكتب: "${question}".
        اقترح 5 أسئلة طبية كاملة مناسبة تكمل ما بدأ كتابته، بصيغة المستخدم العادي، بدون شرح، فقط قائمة.
      `;

      const suggestionRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 0.5,
        }),
      });

      const suggestionData = await suggestionRes.json();
      const suggestions = suggestionData.choices?.[0]?.message?.content
        ?.split("\n")
        .filter((s) => s.trim())
        .map((s) => s.replace(/^- /, "").trim()) || [];

      return {
        statusCode: 200,
        body: JSON.stringify({ suggestions }),
      };
    }

    // رد من OpenAI إن لم يكن محفوظًا
    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: question }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const gptData = await gptResponse.json();
    const answer = gptData.choices?.[0]?.message?.content || "❌ لم يتم العثور على إجابة.";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    console.error("❌ خطأ في الخادم:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "حدث خطأ داخلي في الخادم." }),
    };
  }
}