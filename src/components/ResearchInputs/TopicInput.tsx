"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useDeepResearchStore } from "@/stores/deepResearch";

const formSchema = z.object({
  topicInput: z
    .string()
    .min(3, { message: "Topic must be at least 3 characters long" })
    .max(50, { message: "Topic must be at most 50 characters long" }),
});

export default function TopicInput() {
  const {
    questions,
    isFetchingQuestions,
    setTopic,
    setQuestions,
    setIsFetchingQuestions,
  } = useDeepResearchStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicInput: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setTopic(values.topicInput);
    setIsFetchingQuestions(true);
    try {
      const res = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: values.topicInput }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit topic");
      }

      setQuestions(data);
    } catch (error) {
      console.error("Error submitting topic:", error);
      // TODO: Handle error appropriately
    } finally {
      setIsFetchingQuestions(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-lg mx-auto"
      >
        <FormField
          control={form.control}
          name="topicInput"
          render={({ field }) => (
            <FormItem className="w-full flex-1">
              <FormControl>
                <Input
                  className="text-center h-14 !text-lg sm:text-left"
                  placeholder="What topic would you like to research?"
                  disabled={form.formState.isSubmitting || questions.length > 0}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="lg"
          className="px-8 py-7 text-lg font-body font-medium cursor-pointer"
          disabled={form.formState.isSubmitting || questions.length > 0}
        >
          {isFetchingQuestions ? (
            <>
              <Loader className="mr-1 animate-spin" />
              Loading...
            </>
          ) : (
            "Begin"
          )}
        </Button>
      </form>
    </Form>
  );
}
