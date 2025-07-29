import { z } from "zod";
import { ResearchRequest } from "../types/research";

export const ResearchRequestSchema = z.object({
  topic: z.string().min(1, "Topic is required").max(500, "Topic is too long"),
  followUp: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      })
    )
    .optional()
    .default([]),
});

export const validateResearchRequest = (data: unknown): ResearchRequest => {
  try {
    return ResearchRequestSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
      throw new Error(`Validation error: ${issues}`);
    }
    throw new Error("Invalid request format");
  }
};

export const createErrorResponse = (message: string, status: number = 400) => {
  return Response.json(
    {
      error: message,
      report: "",
      queries: [],
      summary: "",
      validated: false,
      reason: message,
    },
    { status }
  );
};
