export interface FollowUpQA {
  question: string;
  answer: string;
}

export interface ResearchRequest {
  topic: string;
  followUp: FollowUpQA[];
}

export interface ExaSearchResult {
  title: string;
  url: string;
  text: string;
  publishedDate?: string;
  author?: string;
}

export interface ValidationResult {
  isValid: boolean;
  reason: string;
}

export interface ResearchResponse {
  report: string;
  queries: string[];
  summary: string;
  validated: boolean;
  reason: string;
}

export interface QueryGenerationResult {
  queries: string[];
}

export interface ContentSummaryResult {
  summary: string;
}
