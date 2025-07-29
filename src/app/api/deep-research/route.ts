import { NextRequest } from "next/server";
import { ResearchPipeline } from "@/lib/pipeline/research-pipeline";
import {
  validateResearchRequest,
  createErrorResponse,
} from "@/lib/utils/validation";

/**
 * Deep Research API Route
 *
 * Processes research requests through a multi-step pipeline:
 * 1. Generate optimized search queries using LLM
 * 2. Search the web using Exa API
 * 3. Curate and summarize content using LLM
 * 4. Validate content sufficiency using LLM
 * 5. Generate comprehensive research report using LLM
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const researchRequest = validateResearchRequest(body);

    const pipeline = new ResearchPipeline();

    const result = await pipeline.executeResearch(researchRequest);

    return Response.json(result, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Deep research API error:", error);

    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message.includes("Validation error")) {
        return createErrorResponse(error.message, 400);
      }

      if (error.message.includes("EXA_API_KEY")) {
        return createErrorResponse("Missing required API configuration", 500);
      }

      if (
        error.message.includes("Failed to search") ||
        error.message.includes("Failed to generate") ||
        error.message.includes("Failed to summarize") ||
        error.message.includes("Failed to validate")
      ) {
        return createErrorResponse(`Service error: ${error.message}`, 500);
      }
    }

    // Generic error response
    return createErrorResponse("Internal server error occurred", 500);
  }
}

// Handle unsupported methods
export async function GET() {
  return createErrorResponse("Method not allowed. Use POST.", 405);
}

export async function PUT() {
  return createErrorResponse("Method not allowed. Use POST.", 405);
}

export async function DELETE() {
  return createErrorResponse("Method not allowed. Use POST.", 405);
}
