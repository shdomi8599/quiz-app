import { useEffect } from "react";
import { styled } from "styled-components";

import { useGetUserData } from "../../hooks/user/useGetUserData";
import { useSetQuizAppState } from "../../hooks/useSetQuizAppState";

import RecordsSearchForm from "../form/RecordsSearchForm";

const RetryPage = () => {
  const {
    userId,
    resultsData,
    selectedResult,
    onFinish,
    handleLoading,
    handleResultChange,
  } = useGetUserData();

  const { setCurrentNavItem, setUserId, setQuizDatas, setQuizLevel } =
    useSetQuizAppState();

  useEffect(() => {
    if (resultsData && selectedResult) {
      const targetResultData = resultsData[selectedResult];
      const { wrongAnswerQuestions } = targetResultData;
      setCurrentNavItem("재도전");
    }
  }, [selectedResult]);

  return (
    <>
      <RecordsSearchForm
        resultsData={resultsData}
        handleResultChange={handleResultChange}
        btnName="목록 조회"
        onFinish={onFinish}
      />
    </>
  );
};

export default RetryPage;

const Box = styled.main``;
