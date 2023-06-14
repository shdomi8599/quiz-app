import HomePage from "../components/pages/HomePage";
import QuizPage from "../components/pages/QuizPage";
import RankingPage from "../components/pages/RankingPage";
import StatisticsPage from "../components/pages/StatisticsPage";
import MistakesPage from "../components/pages/MistakesPage";
import RetryPage from "../components/pages/RetryPage";
import ResultPage from "../components/pages/ResultPage";

export const ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "/quiz/:id", element: <QuizPage /> },
  { path: "/ranking", element: <RankingPage /> },
  { path: "/statistics", element: <StatisticsPage /> },
  { path: "/mistakes", element: <MistakesPage /> },
  { path: "/retry", element: <RetryPage /> },
  { path: "/result", element: <ResultPage /> },
];

export const NAV_ITEMS: { [key: string]: string } = {
  홈: "/",
  랭킹: "/ranking",
  통계: "/statistics",
  오답노트: "/mistakes",
  재도전: "/retry",
};

export const QUIZ_LEVEL_ITEMS = [
  { label: "하", value: 10 },
  { label: "중", value: 25 },
  { label: "상", value: 50 },
];
