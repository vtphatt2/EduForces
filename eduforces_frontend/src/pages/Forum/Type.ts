export interface CommentProps {
  content: string;
  votes: number;
  author: string;
  timestamp: string;
}

export interface UserInfoProps {
  elo: number;
  university: string;
  avatarSrc: string;
}

export interface PostProps {
  content: string;
  postAuthor: string;
  timestamp: string;
}

export interface ForumPostProps {
  post: PostProps;
  userInfo: UserInfoProps;
  commentList: CommentProps[];
  postTitle: string;
}
