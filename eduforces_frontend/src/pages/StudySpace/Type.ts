export interface QuestionProps {
  id: string;
  question: string;
  all_answer: string[];
  correct_answer: string;
  isDone: boolean;
}

export interface FilterItemProps {
  label: string;
  isChecked: boolean;
}
