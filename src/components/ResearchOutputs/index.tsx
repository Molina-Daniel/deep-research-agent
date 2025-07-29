"use client";
import { useDeepResearchStore } from "@/stores/deepResearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResearchOutputs = () => {
  const { isResearching, researchResult, researchError, questionsCompleted } =
    useDeepResearchStore();

  if (!questionsCompleted) {
    return null;
  }

  // Provisional research output UI
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Research Results</h1>

      {isResearching && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              Research in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Our AI is analyzing your topic and generating a comprehensive
              research report. This may take a few minutes...
            </p>
          </CardContent>
        </Card>
      )}

      {researchError && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Research Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{researchError}</p>
          </CardContent>
        </Card>
      )}

      {researchResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">
                Research Completed Successfully!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Validation Status:
                  </h3>
                  <p
                    className={`font-medium ${
                      researchResult.validated
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {researchResult.validated
                      ? "✅ Validated - Sufficient content found"
                      : "⚠️ Limited content"}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {researchResult.reason}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Search Queries Used:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {researchResult.queries.map((query, index) => (
                      <li key={index}>{query}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {researchResult.summary && (
            <Card>
              <CardHeader>
                <CardTitle>Content Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {researchResult.summary}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {researchResult.report && (
            <Card>
              <CardHeader>
                <CardTitle>Research Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {researchResult.report}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-gray-500 overflow-x-auto">
                {JSON.stringify(researchResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ResearchOutputs;
