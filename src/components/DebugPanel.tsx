"use client";
import { useDeepResearchStore } from "@/stores/deepResearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DebugPanel = () => {
  const {
    topic,
    questions,
    answers,
    questionsCompleted,
    isResearching,
    researchResult,
    researchError,
    resetResearch,
  } = useDeepResearchStore();

  return (
    <Card className="w-full max-w-4xl mt-8 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-800 text-sm flex items-center justify-between">
          🐛 Debug Panel (Development Only)
          <Button
            variant="outline"
            size="sm"
            onClick={resetResearch}
            className="text-xs"
          >
            Reset All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs">
          <div>
            <strong>Topic:</strong> {topic || "(not set)"}
          </div>
          <div>
            <strong>Questions ({questions.length}):</strong>
            <ul className="list-disc list-inside ml-2 mt-1">
              {questions.map((q, i) => (
                <li key={i} className="truncate">
                  {q} → <em>{answers[i] || "(not answered)"}</em>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <strong>Questions Completed:</strong>{" "}
              {questionsCompleted ? "✅" : "❌"}
            </div>
            <div>
              <strong>Is Researching:</strong> {isResearching ? "🔄" : "⏸️"}
            </div>
            <div>
              <strong>Has Result:</strong> {researchResult ? "✅" : "❌"}
            </div>
            <div>
              <strong>Has Error:</strong> {researchError ? "❌" : "✅"}
            </div>
          </div>
          {researchError && (
            <div className="bg-red-100 p-2 rounded text-red-700">
              <strong>Error:</strong> {researchError}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugPanel;
