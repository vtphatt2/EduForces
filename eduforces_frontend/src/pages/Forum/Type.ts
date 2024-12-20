export interface PostProps {
  title: string;
  shortDescription: string;
  author: string;
  id: string;
}

export interface NavPageProps {
  numPages: number;
}

export interface TextAreaProps {
  placeholder: string;
  maxLength: number;
  id: string;
}

export interface ForumProps {
  postList: PostProps[];
  numPages: number;
}
