async function askQuestion() {
    const context = document.getElementById("context").value;
    const question = document.getElementById("question").value;
    const answerDiv = document.getElementById("answer");

    if (!question || !context) {
        answerDiv.innerHTML = "<p>الرجاء إدخال النص والسؤال.</p>";
        return;
    }

    answerDiv.innerHTML = "<p>جارٍ المعالجة...</p>";

    try {
        const response = await fetch("/.netlify/functions/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, context })
        });

        const data = await response.json();
        answerDiv.innerHTML = `<p><b>الإجابة:</b> ${data.answer}</p>`;
    } catch (error) {
        answerDiv.innerHTML = "<p>حدث خطأ أثناء جلب الإجابة.</p>";
    }
}