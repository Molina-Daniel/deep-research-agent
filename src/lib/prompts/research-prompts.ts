import { FollowUpQA } from "../types/research";

export const generateQueriesPrompt = (
  topic: string,
  followUp: FollowUpQA[]
): string => {
  const followUpContext =
    followUp.length > 0
      ? `\n\nAdditional context from follow-up questions:\n${followUp
          .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
          .join("\n\n")}`
      : "";

  return `You are a research assistant. Generate up to 3 optimized search queries that will help gather comprehensive information to write a detailed research report on the given topic.

Topic: ${topic}${followUpContext}

Requirements:
- Generate 2-3 specific, targeted search queries
- Each query should focus on different aspects of the topic
- Queries should be optimized for web search engines
- Avoid overly broad or generic terms
- Consider current events, statistics, expert opinions, and practical applications

Return your response as a JSON object with this structure:
{
  "queries": ["query1", "query2", "query3"]
}`;
};

export const summarizeContentPrompt = (
  topic: string,
  rawContent: string,
  followUp: FollowUpQA[]
): string => {
  const followUpContext =
    followUp.length > 0
      ? `\n\nAdditional context from follow-up questions:\n${followUp
          .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
          .join("\n\n")}`
      : "";

  return `You are a research analyst. Curate and summarize the following raw content into a concise, well-structured summary that will be used to write a comprehensive research report.

Topic: ${topic}${followUpContext}

Raw Content:
${rawContent}

Requirements:
- Create a clear, structured summary
- Focus on key facts, statistics, and insights relevant to the topic
- Remove redundant information
- Organize information logically
- Maintain factual accuracy
- Keep the summary comprehensive but concise (aim for 500-800 words)

Return your response as a JSON object with this structure:
{
  "summary": "your curated summary here"
}`;
};

export const validateContentPrompt = (
  topic: string,
  followUp: FollowUpQA[],
  summary: string
): string => {
  const followUpContext =
    followUp.length > 0
      ? `\n\nFollow-up Q&A:\n${followUp
          .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
          .join("\n\n")}`
      : "";

  return `You are a research quality assessor. Evaluate whether the current content is sufficient to write a comprehensive research report.

Topic: ${topic}${followUpContext}

Curated Summary:
${summary}

Assessment Criteria:
- Does the content adequately cover the main aspects of the topic?
- Is there sufficient depth and detail for a comprehensive report?
- Are key questions about the topic addressed?
- Is the information current and relevant?
- Are there any critical gaps in the information?

Return your response as a JSON object with this structure:
{
  "isValid": true/false,
  "reason": "detailed explanation of your assessment"
}`;
};

export const generateReportPrompt = (
  topic: string,
  followUp: FollowUpQA[],
  summary: string,
  queries: string[]
): string => {
  const followUpContext =
    followUp.length > 0
      ? `\n\nFollow-up Questions & Answers:\n${followUp
          .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
          .join("\n\n")}`
      : "";

  return `You are an expert research writer. Generate a detailed, structured research report based on all the provided information.

Topic: ${topic}${followUpContext}

Research Summary:
${summary}

Search Queries Used: ${queries.join(", ")}

Requirements:
- Write a comprehensive, well-structured research report
- Use clear headings and subheadings
- Include an executive summary at the beginning
- Present information in a logical flow
- Include specific facts, statistics, and insights
- Reference the follow-up Q&A when relevant
- Write in a professional, academic tone
- Aim for 1000-1500 words
- Use markdown formatting for structure

Generate only the report content, not wrapped in JSON.`;
};
