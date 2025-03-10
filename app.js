const apiKey = `${OPENAI_API_KEY}`;

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatLog = document.getElementById("chat-log");

    if (!userInput) return;

    // عرض رسالة المستخدم
    chatLog.innerHTML += `<div><b>أنت:</b> ${userInput}</div>`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: userInput }]
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0]?.message?.content || "عذرًا، حدث خطأ. حاول مرة أخرى.";

        // عرض رسالة البوت
        chatLog.innerHTML += `<div><b>البوت:</b> ${botMessage}</div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
    } catch (error) {
        console.error("Error:", error);
        chatLog.innerHTML += `<div><b>البوت:</b> حدث خطأ أثناء الاتصال بالخادم.</div>`;
    }

    document.getElementById("user-input").value = "";
}