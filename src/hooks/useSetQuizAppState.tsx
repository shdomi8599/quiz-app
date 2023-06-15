import { useSetRecoilState } from "recoil";

import {
  currentNavItemState,
  quizDatasState,
  quizLevelState,
  userIdState,
} from "../recoil/atom";

export const useSetQuizAppState = () => {
  const setCurrentNavItem = useSetRecoilState(currentNavItemState);

  const setUserId = useSetRecoilState(userIdState);

  const setQuizDatas = useSetRecoilState(quizDatasState);

  const setQuizLevel = useSetRecoilState(quizLevelState);
  return {
    setCurrentNavItem,
    setUserId,
    setQuizDatas,
    setQuizLevel,
  };
};
