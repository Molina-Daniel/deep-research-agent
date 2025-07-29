/**
 * Configuration constants for the Deep Research Agent
 *
 * Modify these values to customize the behavior of your research pipeline.
 * See config-examples.ts for alternative configurations.
 */

// Model names for different pipeline steps
// Each step can use a different model optimized for that specific task

export const MODELS = {
  PLANNING: "google/gemini-2.5-flash-lite-preview-06-17", // Query generation - needs creativity and understanding
  EXTRACTION: "google/gemini-2.5-flash-lite-preview-06-17", // Content summarization - needs efficiency and accuracy
  ANALYSIS: "google/gemini-2.5-flash-lite-preview-06-17", // Content validation - needs critical thinking
  REPORT: "google/gemini-2.5-flash-lite-preview-06-17", // Report generation - needs comprehensive writing
  // Alternative: "anthropic/claude-3.7-sonnet:thinking" for premium thinking model
};

// Temperature settings for different tasks
// Lower = more focused and deterministic, Higher = more creative and varied
export const TEMPERATURES = {
  PLANNING: 0.7, // More creative for diverse query generation
  EXTRACTION: 0.3, // More focused for accurate summarization
  ANALYSIS: 0.2, // Very focused for consistent validation
  REPORT: 0.4, // Balanced for engaging but accurate reports
};

// Search configuration
export const SEARCH_CONFIG = {
  MAX_QUERIES: 3, // Maximum search queries to generate
  RESULTS_PER_QUERY: 3, // Results to fetch per query
  EXCLUDED_DOMAINS: [
    "reddit.com",
    "twitter.com",
    "facebook.com",
    "youtube.com",
  ], // Domains to exclude from search
};

// Pipeline step names for logging and debugging
export const PIPELINE_STEPS = {
  QUERY_GENERATION: "Step 1: Generating search queries",
  WEB_SEARCH: "Step 2: Searching with Exa API",
  CONTENT_CURATION: "Step 3: Curating and summarizing content",
  VALIDATION: "Step 4: Validating content",
  REPORT_GENERATION: "Step 5: Generating final report",
} as const;
