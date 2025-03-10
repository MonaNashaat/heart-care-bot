// app.js — واجهة الشات بوت

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatLog = document.getElementById("chat-log");

    if (!userInput) return;

    // عرض رسالة المستخدم
    chatLog.innerHTML += `<div><b>أنت:</b> ${userInput}</div>`;

    try {
        // إرسال الرسالة إلى الخادم (Netlify Function)
        const response = await fetch("/.netlify/functions/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        const botMessage = data.choices?.[0]?.message?.content || "عذرًا، حدث خطأ أثناء الاتصال بالخادم.";

        // عرض رسالة البوت
        chatLog.innerHTML += `<div><b>البوت:</b> ${botMessage}</div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
    } catch (error) {
        console.error("Error:", error);
        chatLog.innerHTML += `<div><b>البوت:</b> حدث خطأ أثناء الاتصال بالخادم.</div>`;
    }

    // تنظيف حقل الإدخال
    document.getElementById("user-input").value = "";
}

// استماع للضغط على Enter
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
