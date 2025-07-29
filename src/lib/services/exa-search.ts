import Exa from "exa-js";
import { ExaSearchResult } from "../types/research";
import { SEARCH_CONFIG } from "../constants";

class ExaSearchService {
  private exa: Exa;

  constructor() {
    const apiKey = process.env.EXA_API_KEY;
    if (!apiKey) {
      throw new Error("EXA_API_KEY environment variable is required");
    }
    this.exa = new Exa(apiKey);
  }

  async searchAndGetContents(
    query: string,
    numResults: number = SEARCH_CONFIG.RESULTS_PER_QUERY
  ): Promise<ExaSearchResult[]> {
    try {
      const searchResponse = await this.exa.searchAndContents(query, {
        numResults,
        text: true,
      });

      // Map the results to our interface
      const results: ExaSearchResult[] = searchResponse.results.map(
        (result) => ({
          title: result.title || "",
          url: result.url || "",
          text: result.text || "",
          publishedDate: result.publishedDate,
          author: result.author,
        })
      );

      return results;
    } catch (error) {
      console.error("Error in Exa search:", error);
      throw new Error(
        `Failed to search with Exa: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async searchMultipleQueries(
    queries: string[]
  ): Promise<{ query: string; results: ExaSearchResult[] }[]> {
    const searchPromises = queries.map(async (query) => {
      try {
        const results = await this.searchAndGetContents(
          query,
          SEARCH_CONFIG.RESULTS_PER_QUERY
        );
        return { query, results };
      } catch (error) {
        console.error(`Error searching for query "${query}":`, error);
        return { query, results: [] };
      }
    });

    return Promise.all(searchPromises);
  }
}

export default ExaSearchService;
