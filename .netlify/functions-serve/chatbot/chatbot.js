const responses = require('./qa_responses.json');

exports.handler = async (event) => {
  const { question } = JSON.parse(event.body || '{}');
  
  // البحث عن إجابة جاهزة
  const answer = responses[question?.trim()] || "❗️لم يتم العثور على إجابة لهذا السؤال في قاعدة البيانات.";

  return {
    statusCode: 200,
    body: JSON.stringify({ answer }),
  };
};