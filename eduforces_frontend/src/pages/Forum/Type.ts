export interface PostProps {
  title: string;
  shortDescription: string;
  author: string;
  id: string;
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
