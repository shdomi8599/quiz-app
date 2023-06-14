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
  createdAt: string;
  wrongAnswerQuestions: QuizData[];
  resultTableItems: ResultTableItem[];
}

export interface ResultTableItem {
  label: string;
  content: string | number;
}

export interface HomeFormItem {
  nickname: string;
  level: number;
  userOption: UserOption;
  code?: string;
}

export type UserOption = "new" | "existing";
