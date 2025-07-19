import TopicInput from "@/components/TopicInput";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen w-full gap-8 py-16 px-4 text-center">
      <h1 className="text-4xl font-bold">
        Uncover Deep Insights with AI-Powered Research
      </h1>
      <p className="text-lg max-w-2xl text-muted-foreground">
        An intelligent agent that asks the right follow-up questions, builds
        perfect search queries, and delivers structured, insightful research
        reports.
      </p>

      <div className="w-full max-w-2xl">
        <TopicInput />
      </div>
    </main>
  );
}
