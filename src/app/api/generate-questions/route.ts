import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "",
});

async function generateQuestions(topic: string) {
  const prompt = `
    You are an intelligent research assistant. Given a broad topic, generate 2 to 4 concise, specific questions that help narrow the scope of the research. 
    The questions should be easy to answer quickly (e.g., with a word, short phrase, or simple sentence). Focus on identifying:
    - Which specific aspect(s) of the topic the user is interested in (e.g., historical context, current trends, specific applications)
    - The type of information the user is looking for (e.g., statistics, case studies, expert opinions)
    - Any specific constraints or requirements (e.g., geographical focus, time period, format)
    - The desired outcome or goal of the research (e.g., understanding a concept, making a decision, generating ideas)
    - The desired level of detail or complexity (e.g., beginner, expert, technical, strategic)
    - Any preferred viewpoints, contexts, or sources to include or avoid

    Input:
    Topic: ${topic}

    Output:
    A list of 2 to 4 brief, targeted questions to refine the research direction.
    Return the result as a JSON object with a "questions" key containing the array of questions.
    `;

  try {
    const { object } = await generateObject({
      model: openrouter("google/gemini-2.5-flash-lite-preview-06-17"),
      schema: z.object({
        questions: z.array(z.string()),
      }),
      prompt,
    });

    return object.questions;
  } catch (error) {
    console.error("Error generating questions prompt:", error);
  }
}

export async function POST(req: Request) {
  const { topic } = await req.json();

  try {
    const questions = await generateQuestions(topic);

    if (!questions || questions.length === 0) {
      throw new Error("No questions generated");
    }

    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
