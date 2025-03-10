async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatLog = document.getElementById("chat-log");

    if (!userInput) return;

    chatLog.innerHTML += `<div><b>أنت:</b> ${userInput}</div>`;

    try {
        const response = await fetch("/.netlify/functions/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        
        if (response.ok) {
            const botMessage = data.choices?.[0]?.message?.content || "لم أتمكن من فهم سؤالك.";
            chatLog.innerHTML += `<div><b>البوت:</b> ${botMessage}</div>`;
        } else {
            chatLog.innerHTML += `<div><b>خطأ في الخادم:</b> ${data.error} — ${data.details}</div>`;
        }
        
        chatLog.scrollTop = chatLog.scrollHeight;

    } catch (error) {
        console.error("Error:", error);
        chatLog.innerHTML += `<div><b>البوت:</b> حدث خطأ أثناء الاتصال بالخادم.</div>`;
    }

    document.getElementById("user-input").value = "";
}