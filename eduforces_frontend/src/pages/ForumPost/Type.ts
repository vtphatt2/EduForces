export interface CommentProps {
  id: string;
  content: string;
  author: string;
  timestamp: string;
}

export interface CommentPropsAPI {
  comment_id: string;
  content: string;
  author_id: string;
  timestamp: string;
  parent_comment_id: string;
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

export interface PostPropsAPI {
  post_id: string;
  title: string;
  content: string;
  author_id: string;
  timestamp: string;
}

export interface ForumPostProps {
  post: PostProps;
  userInfo: UserInfoProps;
  commentList: CommentProps[];
  postTitle: string;
}
