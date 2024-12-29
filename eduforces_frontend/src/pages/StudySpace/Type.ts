export interface QuestionProps {
  id: string;
  question: string;
  all_answer: string[];
  correct_answer: string;
  isDone: boolean;
}

export interface QuestionPropsAPI {
  question_id: string;
  contest_id: string;
  description: string;
  answers: string[];
  correct_answer: string;
  update_at: string;
  subject: string;
  is_public: boolean;
  question_tag: string;
}

export interface FilterItemProps {
  label: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void; // Added onChange prop
}