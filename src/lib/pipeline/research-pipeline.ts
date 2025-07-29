import {
  ResearchRequest,
  ResearchResponse,
  ExaSearchResult,
} from "../types/research";
import LLMService from "../services/llm-service";
import ExaSearchService from "../services/exa-search";
import { SEARCH_CONFIG, PIPELINE_STEPS } from "../constants";

export class ResearchPipeline {
  private llmService: LLMService;
  private exaService: ExaSearchService;

  constructor() {
    this.llmService = new LLMService();
    this.exaService = new ExaSearchService();
  }

  async executeResearch(request: ResearchRequest): Promise<ResearchResponse> {
    try {
      // Step 1: Generate optimized search queries
      console.log(PIPELINE_STEPS.QUERY_GENERATION);
      const queryResult = await this.llmService.generateSearchQueries(
        request.topic,
        request.followUp
      );
      const queries = queryResult.queries.slice(0, SEARCH_CONFIG.MAX_QUERIES); // Ensure max queries
      console.log("Generated queries:", queries);

      // Step 2: Search with Exa API and extract content
      console.log(PIPELINE_STEPS.WEB_SEARCH);
      const searchResults = await this.exaService.searchMultipleQueries(
        queries
      );
      const rawContent = this.combineSearchResults(searchResults);
      console.log("Combined raw content:", rawContent);

      // Step 3: Curate and summarize the content
      console.log(PIPELINE_STEPS.CONTENT_CURATION);
      const summaryResult = await this.llmService.summarizeContent(
        request.topic,
        rawContent,
        request.followUp
      );
      console.log("Content summary:", summaryResult.summary);

      // Step 4: Validate content sufficiency
      console.log(PIPELINE_STEPS.VALIDATION);
      const validationResult = await this.llmService.validateContent(
        request.topic,
        request.followUp,
        summaryResult.summary
      );
      console.log("Content validation result:", validationResult);

      // Step 5: Generate report if validation passes
      if (!validationResult.isValid) {
        return {
          report: "",
          queries,
          summary: summaryResult.summary,
          validated: false,
          reason: validationResult.reason,
        };
      }

      console.log(PIPELINE_STEPS.REPORT_GENERATION);
      const report = await this.llmService.generateReport(
        request.topic,
        request.followUp,
        summaryResult.summary,
        queries
      );
      console.log("Generated report:", report);

      return {
        report,
        queries,
        summary: summaryResult.summary,
        validated: true,
        reason: validationResult.reason,
      };
    } catch (error) {
      console.error("Error in research pipeline:", error);
      throw new Error(
        `Research pipeline failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private combineSearchResults(
    searchResults: { query: string; results: ExaSearchResult[] }[]
  ): string {
    let combinedContent = "";

    searchResults.forEach(({ query, results }) => {
      combinedContent += `\n\n=== Search Query: ${query} ===\n\n`;

      results.forEach((result, index) => {
        combinedContent += `--- Result ${index + 1} ---\n`;
        combinedContent += `Title: ${result.title}\n`;
        combinedContent += `URL: ${result.url}\n`;
        if (result.publishedDate) {
          combinedContent += `Published: ${result.publishedDate}\n`;
        }
        if (result.author) {
          combinedContent += `Author: ${result.author}\n`;
        }
        combinedContent += `Content: ${result.text}\n\n`;
      });
    });

    return combinedContent;
  }
}
