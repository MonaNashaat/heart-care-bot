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
        
        // استخراج النص من الحقل الصحيح
        const botMessage = data.content || "لم أتمكن من فهم سؤالك.";

        chatLog.innerHTML += `<div><b>البوت:</b> ${botMessage}</div>`;
        chatLog.scrollTop = chatLog.scrollHeight;

    } catch (error) {
        console.error("Error:", error);
        chatLog.innerHTML += `<div><b>البوت:</b> حدث خطأ أثناء الاتصال بالخادم.</div>`;
    }

    document.getElementById("user-input").value = "";
}