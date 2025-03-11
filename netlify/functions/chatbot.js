import { pipeline } from "@huggingface/transformers";

let qa_pipeline;

async function loadModel() {
    if (!qa_pipeline) {
        qa_pipeline = pipeline("text-generation", "tiiuae/falcon-7b-instruct");
        console.log("✅ Falcon model loaded!");
    }
}

export async function handler(event) {
    try {
        await loadModel();

        const { question } = JSON.parse(event.body);

        if (!question) {
            return { statusCode: 400, body: JSON.stringify({ error: "يرجى إدخال سؤال." }) };
        }

        const response = await qa_pipeline(question, {
            max_length: 200,
            num_return_sequences: 1,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: response[0].generated_text })
        };

    } catch (error) {
        console.error("❌ Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "حدث خطأ أثناء معالجة السؤال." }) };
    }
}