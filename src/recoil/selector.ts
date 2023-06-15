import { selector } from "recoil";

import {
  quizDatasState,
  userDataState,
  wrongAnswerQuestionsState,
} from "./atom";

export const quizDatasLegnthState = selector({
  key: "quizDatasLegnthState",
  get: ({ get }) => {
    const quizDatas = get(quizDatasState);
    return quizDatas.length;
  },
});

export const wrongAnswerQuestionsCountState = selector({
  key: "wrongAnswerQuestionsCountState",
  get: ({ get }) => {
    const wrongAnswerQuestions = get(wrongAnswerQuestionsState);
    return wrongAnswerQuestions.length;
  },
});

export const resultsDataState = selector({
  key: "resultsDataState",
  get: ({ get }) => {
    const userData = get(userDataState);
    return userData?.results;
  },
});
