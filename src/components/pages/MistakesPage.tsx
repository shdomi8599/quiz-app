import { Button, Carousel, Modal } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";

import { userDataState } from "../../recoil/atom";
import { resultsDataState } from "../../recoil/selector";
import { getDbDataByDocName } from "../../util/firebase";
import { RecordsSearchFormItem, ResultItem, UserData } from "../../types";
import { useLoadingAndError } from "../../hooks/useLoadingAndError";

import QuizCard from "../card/QuizCard";
import RecordsSearchForm from "../form/RecordsSearchForm";

const MistakesPage = () => {
  const { handleLoading, handleError } = useLoadingAndError();

  const [, setUserData] = useRecoilState(userDataState);

  const resultsData = useRecoilValue(resultsDataState);

  const [viewData, setViewData] = useState<ResultItem>();

  const [selectedResult, setSelectedResult] = useState<number>();

  //인덱스로 추적
  const [quizPage, setQuizPage] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleOk = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleResultChange = useCallback((value: number) => {
    setSelectedResult(value);
  }, []);

  const handleQuizChange = useCallback((currentSlide: number) => {
    setQuizPage(currentSlide);
  }, []);

  const onFinish = useCallback(async (values: RecordsSearchFormItem) => {
    handleLoading();
    const { nickname, code } = values;

    const userId = nickname + code;

    const dbUserData = await getDbDataByDocName<UserData>("users", userId);

    if (dbUserData) {
      setUserData(dbUserData);
    } else {
      return handleError("유저");
    }

    handleLoading();
  }, []);

  useEffect(() => {
    if (resultsData) {
      setViewData(resultsData[selectedResult as number]);
    }
  }, [selectedResult]);

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
          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          ></Modal>
          <BtnBox>
            <Button type="primary" onClick={showModal}>
              오답 노트 작성
            </Button>
          </BtnBox>
          <CarouselBox afterChange={handleQuizChange}>
            {viewData.wrongAnswerQuestions.map((question, idx) => (
              <div key={idx} className="card-box">
                <QuizCard quizData={question} isViewAnswer={true} />
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
  padding: 0px calc((100% - 960px) / 2);
  display: flex;
  justify-content: center;
`;
