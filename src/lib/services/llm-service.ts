import { generateObject, generateText } from "ai";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { z } from "zod";
import {
  QueryGenerationResult,
  ContentSummaryResult,
  ValidationResult,
  FollowUpQA,
} from "../types/research";
import {
  generateQueriesPrompt,
  summarizeContentPrompt,
  validateContentPrompt,
  generateReportPrompt,
} from "../prompts/research-prompts";
import { MODELS, TEMPERATURES } from "../constants";

const QueryGenerationSchema = z.object({
  queries: z
    .array(z.string())
    .describe("Array of search queries to research the topic"),
});

const ContentSummarySchema = z.object({
  summary: z.string().describe("Comprehensive summary of the content"),
});

const ValidationSchema = z.object({
  isValid: z.boolean().describe("Whether the content is valid and relevant"),
  reason: z.string().describe("Explanation for the validation result"),
});

class LLMService {
  async generateSearchQueries(
    topic: string,
    followUp: FollowUpQA[]
  ): Promise<QueryGenerationResult> {
    try {
      const prompt = generateQueriesPrompt(topic, followUp);

      console.log("Generating search queries with prompt:", prompt);

      const { object } = await generateObject({
        model: openrouter(MODELS.PLANNING),
        prompt,
        schema: QueryGenerationSchema,
        temperature: TEMPERATURES.PLANNING,
      });

      console.log("Generated search queries:", object);

      // Validate the response structure (additional safety check)
      if (!object.queries || !Array.isArray(object.queries)) {
        throw new Error("Invalid response format: queries array is required");
      }

      return object;
    } catch (error) {
      console.error("Error generating search queries:", error);
      throw new Error(
        `Failed to generate search queries: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async summarizeContent(
    topic: string,
    rawContent: string,
    followUp: FollowUpQA[]
  ): Promise<ContentSummaryResult> {
    try {
      const prompt = summarizeContentPrompt(topic, rawContent, followUp);

      const { object } = await generateObject({
        model: openrouter(MODELS.EXTRACTION),
        prompt,
        schema: ContentSummarySchema,
        temperature: TEMPERATURES.EXTRACTION,
      });

      // Validate the response structure (additional safety check)
      if (!object.summary || typeof object.summary !== "string") {
        throw new Error("Invalid response format: summary string is required");
      }

      return object;
    } catch (error) {
      console.error("Error summarizing content:", error);
      throw new Error(
        `Failed to summarize content: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async validateContent(
    topic: string,
    followUp: FollowUpQA[],
    summary: string
  ): Promise<ValidationResult> {
    try {
      const prompt = validateContentPrompt(topic, followUp, summary);

      const { object } = await generateObject({
        model: openrouter(MODELS.ANALYSIS),
        prompt,
        schema: ValidationSchema,
        temperature: TEMPERATURES.ANALYSIS,
      });

      // Validate the response structure (additional safety check)
      if (
        typeof object.isValid !== "boolean" ||
        typeof object.reason !== "string"
      ) {
        throw new Error(
          "Invalid response format: isValid (boolean) and reason (string) are required"
        );
      }

      return object;
    } catch (error) {
      console.error("Error validating content:", error);
      throw new Error(
        `Failed to validate content: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async generateReport(
    topic: string,
    followUp: FollowUpQA[],
    summary: string,
    queries: string[]
  ): Promise<string> {
    try {
      const prompt = generateReportPrompt(topic, followUp, summary, queries);

      const { text } = await generateText({
        model: openrouter(MODELS.REPORT),
        prompt,
        temperature: TEMPERATURES.REPORT,
      });

      return text;
    } catch (error) {
      console.error("Error generating report:", error);
      throw new Error(
        `Failed to generate report: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

export default LLMService;
