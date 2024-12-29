export interface QuestionProps {
    id: number;
    questionNumber: number;  
    title: string;           
    answerList: string[];    
    correctAnswer: string;      
}

export interface ContestCreateProps {
    questionList: QuestionProps[];
}