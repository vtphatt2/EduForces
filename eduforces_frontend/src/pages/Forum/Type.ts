export interface PostProps {
  title: string;
  shortDescription: string;
  author: string;
}

export interface NavPageProps {
  pageList: number[];
}

export interface TextAreaProps {
  placeholder: string;
  maxLength: number;
}

export interface ForumProps {
  postList: PostProps[];
  pageList: number[];
}
