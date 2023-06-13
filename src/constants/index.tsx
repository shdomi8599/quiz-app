import HomePage from "../components/pages/HomePage";
import QuizPage from "../components/pages/QuizPage";
import RankingPage from "../components/pages/RankingPage";
import StatisticsPage from "../components/pages/StatisticsPage";
import MistakesPage from "../components/pages/MistakesPage";
import RetryPage from "../components/pages/RetryPage";

export const ROUTES = [
  { path: "/", element: <HomePage /> },
  { path: "/quiz/:id", element: <QuizPage /> },
  { path: "/ranking", element: <RankingPage /> },
  { path: "/statistics", element: <StatisticsPage /> },
  { path: "/mistakes", element: <MistakesPage /> },
  { path: "/retry", element: <RetryPage /> },
];

export const NAV_ITEMS: { [key: string]: string } = {
  홈: "/",
  랭킹: "/ranking",
  통계: "/statistics",
  오답노트: "/mistakes",
  재도전: "/retry",
};
