"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useDeepResearchStore } from "@/stores/deepResearch";

const FormSchema = z.object({
  answer: z.string().min(1).max(150, {
    message: "Answer must not be longer than 150 characters.",
  }),
});

export default function QuestionForm() {
  const {
    questions,
    answers,
    currentQuestion,
    setCurrentQuestion,
    setAnswers,
    setQuestionsCompleted,
    startResearch,
    isResearching,
  } = useDeepResearchStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      answer: answers[currentQuestion] || "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = data.answer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      form.setValue("answer", answers[currentQuestion + 1] || "");
    } else {
      // Mark questions as completed and start research
      setQuestionsCompleted(true);
      startResearch();
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      form.setValue("answer", answers[currentQuestion - 1] || "");
    }
  };

  if (questions.length === 0) return;

  return (
    <Card className="mb-8 mt-8 w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex flex-col items-center text-xl font-heading">
          <div className="w-full flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Let&apos;s refine your research
            </h2>
            <span className="text-sm text-gray-500">
              {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base sm:text-lg font-medium mb-2 text-left">
          {questions[currentQuestion]}
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Type your answer here..."
                      className="resize-none h-20 sm:!text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-around">
              <Button
                type="button"
                variant="outline"
                onClick={handlePreviousQuestion}
                size="lg"
                className="font-body font-medium text-md cursor-pointer"
                disabled={currentQuestion === 0 || isResearching}
              >
                {"Back"}
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid || isResearching}
                size="lg"
                className="font-body font-medium text-md cursor-pointer"
              >
                {isResearching
                  ? "Starting Research..."
                  : currentQuestion < questions.length - 1
                  ? "Next Question"
                  : "Start Research"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
