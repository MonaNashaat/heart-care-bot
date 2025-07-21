import fetch from "node-fetch";
import responses from "./qa_responses.json"; // تأكد أن qa_responses.json بجوار هذا الملف

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." }),
    };
  }

  try {
    const { question, type } = JSON.parse(event.body || "{}");

    if (!question) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "يرجى إدخال سؤال." }),
      };
    }

    // في حالة نوع السؤال هو suggestion
    if (type === "suggestion") {
      const suggestionPrompt = `
        المستخدم بدأ يكتب: "${question}".
        اقترح 5 أسئلة طبية كاملة مناسبة تكمل ما بدأ كتابته، بصيغة المستخدم العادي، بدون شرح، فقط قائمة.
        مثال: 
        - ما هي أعراض ...
        - هل يمكن علاج ...
        - ما الفرق بين ...
      `;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: suggestionPrompt }],
          max_tokens: 150,
          temperature: 0.5,
        }),
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";
      const suggestions = text
        .split("\n")
        .filter((line) => line.trim())
        .map((s) => s.replace(/^- /, "").trim());

      return {
        statusCode: 200,
        body: JSON.stringify({ suggestions }),
      };
    }

    // ✅ التحقق من وجود إجابة محفوظة
    const trimmedQuestion = question.trim();
    if (responses[trimmedQuestion]) {
      return {
        statusCode: 200,
        body: JSON.stringify({ answer: responses[trimmedQuestion] }),
      };
    }

    // ❌ لو مش موجود في الردود المحفوظة، استخدم OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || "❌ لم يتم العثور على إجابة.";

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };
  } catch (error) {
    console.error("❌ Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "حدث خطأ داخلي في الخادم." }),
    };
  }
}