import axios from "axios";
import { QuizData } from "../../types";

const baseURL = "https://opentdb.com";

export const quizApi = axios.create({
  baseURL,
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getQuizDatas = async (size: number): Promise<QuizData[]> => {
  return await quizApi(`api.php?amount=${size}`).then(
    (res) => res.data.results
  );
};
