export interface QuizData {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

export interface UserData {
  userId: string;
  results?: ResultItem[];
}

export interface ResultItem {
  resultId: number;
  createdAt: { seconds: number; nanoseconds: number };
  wrongAnswerQuestions: QuizData[];
  resultTableItems: ResultTableItem[];
}

export interface ResultTableItem {
  label: string;
  content: string | number;
}

export interface MistakeFormItem {
  nickname: string;
  code?: string;
}

export interface HomeFormItem extends MistakeFormItem {
  level: number;
  userOption: UserOption;
}

export type UserOption = "new" | "existing";

export type TableColumn = {
  title: string;
  dataIndex: string;
  key: string;
};
