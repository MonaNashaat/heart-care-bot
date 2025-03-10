import { AutoTokenizer, AutoModelForQuestionAnswering } from "@huggingface/transformers";
import { pipeline } from "transformers";
import fs from "fs";

const modelPath = "./trained_health_bot";

let qa_pipeline;

// Load the model once
async function initializeModel() {
    if (!qa_pipeline) {
        const tokenizer = await AutoTokenizer.from_pretrained(modelPath);
        const model = await AutoModelForQuestionAnswering.from_pretrained(modelPath);
        qa_pipeline = pipeline("question-answering", model, tokenizer);
        console.log("✅ Model loaded successfully!");
    }
}

export async function handler(event) {
    try {
        await initializeModel();  // Ensure the model is loaded before handling requests

        const { question, context } = JSON.parse(event.body);

        if (!question || !context) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Please provide both question and context" })
            };
        }

        const answer = await qa_pipeline({ question, context });

        return {
            statusCode: 200,
            body: JSON.stringify({ answer: answer.answer })
        };
    } catch (error) {
        console.error("❌ Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An error occurred while processing the question" })
        };
    }
}