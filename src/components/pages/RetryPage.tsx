import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useGetUserData } from "../../hooks/user/useGetUserData";
import { useSetQuizAppState } from "../../hooks/useSetQuizAppState";

import RecordsSearchForm from "../form/RecordsSearchForm";

const RetryPage = () => {
  const navigate = useNavigate();

  const { userId, resultsData, selectedResult, onFinish, handleResultChange } =
    useGetUserData();

  const { setCurrentNavItem, setUserId, setQuizDatas, setQuizLevel } =
    useSetQuizAppState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (resultsData) {
      const targetResultData = resultsData[selectedResult as number];

      const { wrongAnswerQuestions } = targetResultData;

      setUserId(userId as string);

      setQuizDatas(wrongAnswerQuestions);

      setQuizLevel(wrongAnswerQuestions.length);

      setCurrentNavItem("재도전");

      navigate("/quiz/1");
    }
  }, [selectedResult]);

  return (
    <RecordsSearchForm
      resultsData={resultsData}
      handleResultChange={handleResultChange}
      btnName="목록 조회"
      onFinish={onFinish}
    />
  );
};

export default RetryPage;
