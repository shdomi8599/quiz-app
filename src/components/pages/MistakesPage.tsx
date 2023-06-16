import { Button, Carousel, Modal, Input } from "antd";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";

import { useGetUserData } from "../../hooks/user/useGetUserData";
import { useModalUtil } from "../../hooks/useModalUtil";
import { ResultItem } from "../../types";
import { confirmAlert, errorAlert } from "../common/Alert";
import { setDbData } from "../../util/firebase";

import QuizCard from "../card/QuizCard";
import RecordsSearchForm from "../form/RecordsSearchForm";

const { TextArea } = Input;

const MistakesPage = () => {
  const {
    userId,
    userData,
    resultsData,
    selectedResult,
    refetch,
    onFinish,
    handleLoading,
    handleResultChange,
  } = useGetUserData();

  const [mistakeContent, setMistakeContent] = useState("");

  const { isModalOpen, handleModalCancel, showModal } = useModalUtil({
    setMistakeContent,
  });

  const [viewData, setViewData] = useState<ResultItem>();

  const [quizCardPage, setQuizCardPage] = useState(1);

  const handleModalOk = () => {
    if (!mistakeContent) {
      return errorAlert("글을 작성해주세요.", "노트 작성");
    }
    confirmAlert("정말 작성하시겠습니까?", "노트 작성이")
      .then(async () => {
        handleLoading();

        if (resultsData && userData) {
          const selectedResultItem = resultsData[selectedResult as number];

          const { wrongAnswerQuestions } = selectedResultItem;

          const newWrongAnswerQuestions = wrongAnswerQuestions.map(
            (quiz, index) =>
              index === quizCardPage - 1
                ? { ...quiz, mistakeNote: mistakeContent }
                : quiz
          );

          const findResultDataIndex = resultsData.findIndex(
            (result) => result.resultId === Number(selectedResult) + 1
          );

          if (findResultDataIndex !== -1) {
            const newResultData = {
              ...resultsData[findResultDataIndex],
              wrongAnswerQuestions: newWrongAnswerQuestions,
            };

            const newResultsData = [...resultsData];

            newResultsData[findResultDataIndex] = newResultData;

            const newUserData = {
              ...userData,
              results: newResultsData,
            };

            await setDbData("users", userId as string, newUserData);
          }
        }

        handleModalCancel();

        refetch();
      })
      .catch(() => {
        handleLoading();
      });
    handleLoading();
  };

  const handleQuizChange = useCallback((currentSlide: number) => {
    setQuizCardPage(currentSlide + 1);
  }, []);

  const handleMistakeContent = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setMistakeContent(e.target.value);
    },
    []
  );

  useEffect(() => {
    if (resultsData) {
      setViewData(resultsData[selectedResult as number]);
      setQuizCardPage(1);
    }
  }, [selectedResult, resultsData]);

  return (
    <>
      <RecordsSearchForm
        resultsData={resultsData}
        handleResultChange={handleResultChange}
        onFinish={onFinish}
        btnName={"오답 조회"}
      />
      {viewData && (
        <>
          <ModalBox
            title={`${quizCardPage}번 문제 오답노트 작성`}
            open={isModalOpen}
            cancelText={"취소"}
            okText={"작성"}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
          >
            <TextArea
              value={mistakeContent}
              onChange={handleMistakeContent}
              rows={7}
            />
          </ModalBox>
          <BtnBox>
            <Button type="primary" onClick={showModal}>
              오답 노트 작성
            </Button>
          </BtnBox>
          <CarouselBox afterChange={handleQuizChange}>
            {viewData.wrongAnswerQuestions.map((question, idx) => (
              <div key={idx} className="card-box">
                <QuizCard
                  quizId={idx + 1}
                  quizData={question}
                  isViewAnswer={true}
                />
              </div>
            ))}
          </CarouselBox>
        </>
      )}
    </>
  );
};

export default MistakesPage;

const CarouselBox = styled(Carousel)`
  padding: 120px calc((100% - 960px) / 2);
  padding-top: 40px;

  .card-box {
    padding: 0px 60px;

    .ant-card {
      height: 400px;
      width: 100%;
      .ant-ribbon-wrapper {
        padding: 20px;
      }
    }
  }

  .slick-dots {
    li {
      width: 100px;
      background-color: ${({ theme }) => theme.colors.sub};
    }
    .slick-active {
      width: 100px !important;
      > button {
        background-color: ${({ theme }) => theme.colors.main} !important;
      }
    }
  }
`;

const BtnBox = styled.div`
  padding: 20px calc((100% - 960px) / 2);
  display: flex;
  justify-content: center;
`;

const ModalBox = styled(Modal)`
  textarea {
    resize: none;
  }
`;
