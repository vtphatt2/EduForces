export interface QuestionProps {
    questionNumber: number;  
    title: string;           
    answerList: string[];
    correctAnswer: string;    
    userAnswer?: string;     
    isAnswered?: boolean;     
    isFlagged?: boolean;      
}

export interface ProgressProps {
    questionList: {
        questionNumber: number;
        isAnswered?: boolean;
        isFlagged?: boolean;
    }[];
}

export interface AnnouncementProps {
    title: string;
    content: string;
}  

  
export interface ContestLiveProps {
    questionList: QuestionProps[];
    announcementList: AnnouncementProps[];
    contestTitle: string;
    contestTimestamp: string;
}
  