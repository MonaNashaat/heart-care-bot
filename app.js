async function askQuestion() {
    const question = document.getElementById("question").value;
    const answerDiv = document.getElementById("answer");

    if (!question) {
        answerDiv.innerHTML = "<p>الرجاء إدخال سؤال.</p>";
        return;
    }

    answerDiv.innerHTML = "<p>جارٍ المعالجة...</p>";

    try {
        const response = await fetch("/.netlify/functions/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question })
        });

        const data = await response.json();
        if (data.answer) {
            answerDiv.innerHTML = `<p><b>الإجابة:</b> ${data.answer}</p>`;
        } else {
            answerDiv.innerHTML = `<p>خطأ: ${data.error}</p>`;
        }
    } catch (error) {
        console.error("❌ Client Error:", error);
        answerDiv.innerHTML = "<p>حدث خطأ أثناء الاتصال بالخادم.</p>";
    }
}