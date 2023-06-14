import axios from "axios";

import { QuizData } from "../../types";
import { errorAlert } from "../../components/common/Alert";

const baseURL = "https://opentdb.com";

export const quizApi = axios.create({
  baseURL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getQuizDatas = async (size: number): Promise<QuizData[]> => {
  return await quizApi(`api.php?amount=${size}`)
    .then((res) => res.data.results)
    .catch(() => errorAlert("잠시 후에 다시 시도해주세요.", "퀴즈"));
};
