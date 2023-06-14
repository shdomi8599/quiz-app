import { atom, selector } from "recoil";

import { QuizData } from "../types";

export const userIdState = atom({
  key: "userIdState",
  default: "",
});

export const currentNavItemState = atom({
  key: "currentNavItemState",
  default: "홈",
});

export const quizDatasState = atom<QuizData[]>({
  key: "quizDatasState",
  default: [],
});

export const wrongAnswerQuestionsState = atom<QuizData[]>({
  key: "wrongAnswerQuestionsState",
  default: [],
});

export const wrongAnswerQuestionsCountState = selector({
  key: "wrongAnswerQuestionsCountState",
  get: ({ get }) => {
    const wrongAnswerQuestions = get(wrongAnswerQuestionsState);
    return wrongAnswerQuestions.length;
  },
});
