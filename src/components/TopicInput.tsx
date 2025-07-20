"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  topicInput: z
    .string()
    .min(3, { message: "Topic must be at least 3 characters long" })
    .max(50, { message: "Topic must be at most 50 characters long" }),
});

export default function TopicInput() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topicInput: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

      console.log("Questions:", data);
      form.reset();
    } catch (error) {
      console.error("Error submitting topic:", error);
      // TODO: Handle error appropriately
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="topicInput"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="text-center h-14 !text-lg sm:text-left"
                  placeholder="What topic would you like to research?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            className="px-8 py-3 text-lg font-body font-medium cursor-pointer"
          >
            Begin
          </Button>
        </div>
      </form>
    </Form>
  );
}
