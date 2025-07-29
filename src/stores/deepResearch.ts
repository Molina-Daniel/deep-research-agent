import { create } from "zustand";
import { ResearchResponse } from "@/lib/types/research";

interface DeepResearchState {
  topic: string;
  questions: string[];
  currentQuestion: number;
  answers: string[];
  questionsCompleted: boolean;
  isFetchingQuestions: boolean;
  // Research API state
  isResearching: boolean;
  researchResult: ResearchResponse | null;
  researchError: string | null;
}

interface DeepResearchActions {
  setTopic: (topic: string) => void;
  setQuestions: (questions: string[]) => void;
  setCurrentQuestion: (currentQuestion: number) => void;
  setAnswers: (answers: string[]) => void;
  setQuestionsCompleted: (completed: boolean) => void;
  setIsFetchingQuestions: (isFetching: boolean) => void;
  // Research API actions
  setIsResearching: (isResearching: boolean) => void;
  setResearchResult: (result: ResearchResponse | null) => void;
  setResearchError: (error: string | null) => void;
  startResearch: () => Promise<void>;
  resetResearch: () => void;
}

export const useDeepResearchStore = create<
  DeepResearchState & DeepResearchActions
>((set, get) => ({
  topic: "",
  questions: [],
  currentQuestion: 0,
  answers: [],
  questionsCompleted: false,
  isFetchingQuestions: false,
  // Research API state
  isResearching: false,
  researchResult: null,
  researchError: null,

  // Research inputs actions
  setTopic: (topic: string) => set({ topic }),
  setQuestions: (questions: string[]) => set({ questions }),
  setCurrentQuestion: (currentQuestion: number) => set({ currentQuestion }),
  setAnswers: (answers: string[]) => set({ answers }),
  setQuestionsCompleted: (completed: boolean) =>
    set({ questionsCompleted: completed }),
  setIsFetchingQuestions: (isFetching: boolean) =>
    set({ isFetchingQuestions: isFetching }),

  // Deep Research API actions
  setIsResearching: (isResearching: boolean) => set({ isResearching }),
  setResearchResult: (result: ResearchResponse | null) =>
    set({ researchResult: result }),
  setResearchError: (error: string | null) => set({ researchError: error }),

  startResearch: async () => {
    const state = get();

    // Prepare the request payload
    const followUp = state.questions
      .map((question, index) => ({
        question,
        answer: state.answers[index] || "",
      }))
      .filter((qa) => qa.answer.trim() !== ""); // Only include answered questions

    const requestPayload = {
      topic: state.topic,
      followUp,
    };

    set({
      isResearching: true,
      researchError: null,
      researchResult: null,
    });

    try {
      const response = await fetch("/api/deep-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ResearchResponse = await response.json();

      set({
        researchResult: result,
        isResearching: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Research failed:", errorMessage);

      set({
        researchError: errorMessage,
        isResearching: false,
      });
    }
  },

  resetResearch: () =>
    set({
      topic: "",
      questions: [],
      currentQuestion: 0,
      answers: [],
      questionsCompleted: false,
      isFetchingQuestions: false,
      isResearching: false,
      researchResult: null,
      researchError: null,
    }),
}));
