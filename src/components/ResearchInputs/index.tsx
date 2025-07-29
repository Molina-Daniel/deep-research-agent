import QuestionsForm from "./QuestionsForm";
import TopicInput from "./TopicInput";

const ResearchInputs = () => {
  return (
    <div className="w-full justify-center items-center flex flex-col">
      <TopicInput />
      <QuestionsForm />
    </div>
  );
};

export default ResearchInputs;
