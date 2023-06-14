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
  wrongAnswerQuestions: QuizData[];
  resultId: number;
}
