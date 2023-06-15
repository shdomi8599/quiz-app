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

export const QUIZ_UESR_OPTIONS = [
  { label: "신규 유저", value: "new" },
  { label: "기존 유저", value: "existing" },
];

export const QUIZ_LEVEL_ITEMS = [
  { label: "하", value: 10 },
  { label: "중", value: 25 },
  { label: "상", value: 50 },
];

export const RANKING_COLUMNS = [
  {
    title: "랭킹",
    dataIndex: "rank",
    key: "rank",
  },
  {
    title: "아이디",
    dataIndex: "userId",
    key: "userId",
  },
  {
    title: "누적 정답",
    dataIndex: "accumulateAnswers",
    key: "accumulateAnswers",
  },
];

export const FORM_NICKNAME_RULES = [
  {
    required: true,
    message: "닉네임을 입력해야 합니다.",
  },
  {
    pattern: /^[^\s]+$/,
    message: "닉네임에는 공백을 포함할 수 없습니다.",
  },
];
