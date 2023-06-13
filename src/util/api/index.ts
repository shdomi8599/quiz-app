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

export const getQuizDatas = async (): Promise<QuizData[]> => {
  return await quizApi("api.php?amount=10").then((res) => res.data.results);
};
