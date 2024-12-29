export interface ContestCoordinatorBlockProps {
    id: number;
    title: string;
    timestamp: string;
    duration?: string;
}

  
export interface ContestCoordinatorProps {
    contestList: ContestCoordinatorBlockProps[];
}