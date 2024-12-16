export interface HomePostProps {
    title: string;
    content: string;
    postAuthor: string;
}


export interface HomeContestProps {
    title: string;
    timestamp: string;
}


export interface HomeLeaderboardProps {
    ranking?: number;
    username: string;
    elo: number;
}  

  
export interface HomeProps {
    postList: HomePostProps[];
    contestList: HomeContestProps[];
    leaderboardList: HomeLeaderboardProps[];
}
  