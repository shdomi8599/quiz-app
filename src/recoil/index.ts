import { atom, selector } from "recoil";

import { QuizData, ResultTableItem, UserData } from "../types";

export const quizLevelState = atom({
  key: "quizLevelState",
  default: 10,
});

export const commonLoadingState = atom({
  key: "commonLoadingState",
  default: false,
});

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

export const quizDatasLegnthState = selector({
  key: "quizDatasLegnthState",
  get: ({ get }) => {
    const quizDatas = get(quizDatasState);
    return quizDatas.length;
  },
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

export const elapsedTimeState = atom({
  key: "elapsedTimeState",
  default: 0,
});

export const resultTableItemsState = atom<ResultTableItem[]>({
  key: "resultTableItemsState",
  default: [],
});

export const userDatasState = atom<UserData[]>({
  key: "userDatasState",
  default: [],
});
