import { AutoTokenizer, AutoModelForQuestionAnswering } from "@huggingface/transformers";
import { pipeline } from "transformers";
import fs from "fs";

const modelPath = "./trained_health_bot";

let qa_pipeline;

async function loadModel() {
    const tokenizer = await AutoTokenizer.from_pretrained(modelPath);
    const model = await AutoModelForQuestionAnswering.from_pretrained(modelPath);
    qa_pipeline = pipeline("question-answering", model, tokenizer);
}

await loadModel();

export async function handler(event) {
    try {
        const { question, context } = JSON.parse(event.body);

        if (!question || !context) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "يرجى إدخال السؤال والنص المرجعي" })
            };
        }

        const answer = await qa_pipeline({ question, context });

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: answer.answer })
        };
    } catch (error) {
        console.error("حدث خطأ:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "حدث خطأ أثناء معالجة السؤال" })
        };
    }
}