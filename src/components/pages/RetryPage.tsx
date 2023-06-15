import { styled } from "styled-components";

import { useGetUserData } from "../../hooks/user/useGetUserData";

import RecordsSearchForm from "../form/RecordsSearchForm";

const RetryPage = () => {
  const {
    userId,
    userData,
    resultsData,
    selectedResult,
    onFinish,
    refetch,
    handleLoading,
    handleResultChange,
  } = useGetUserData();

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
