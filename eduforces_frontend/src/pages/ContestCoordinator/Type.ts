export interface ContestCoordinatorBlockProps {
    title: string;
    timestamp: string;
    duration?: string;
}

  
export interface ContestCoordinatorProps {
    contestList: ContestCoordinatorBlockProps[];
}