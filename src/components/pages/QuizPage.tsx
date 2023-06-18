import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { css, keyframes, styled } from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import { decode } from "he";
import { Button, RadioChangeEvent, Progress } from "antd";

import {
  currentNavItemState,
  elapsedTimeState,
  quizDatasState,
  quizLevelState,
  resultTableItemsState,
  wrongAnswerQuestionsState,
} from "../../recoil/atom";
import {
  quizDatasLegnthState,
  wrongAnswerQuestionsCountState,
} from "../../recoil/selector";
import { formatCircleProgressPercent } from "../../util/format";
import { getDbDataByDocName, setDbData } from "../../util/firebase";
import { useRedirectAndBack } from "../../hooks/useRedirectAndBack";
import { useLoadingAndError } from "../../hooks/useLoadingAndError";
import { ResultItem, UserData } from "../../types";
import { errorAlert } from "../common/Alert";

import QuizCard from "../card/QuizCard";
import CommonBtn from "../btn/CommonBtn";

const QuizPage = () => {
  const { handleLoading } = useLoadingAndError();

  const { userId, navigate } = useRedirectAndBack();

  const { id } = useParams();

  const secLimit = 30;
  const [sec, setSec] = useState(secLimit);

  const [isViewAnswer, setIsViewAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const quizLevel = useRecoilValue(quizLevelState);
  const quizDatas = useRecoilValue(quizDatasState);
  const quizDatasLegnth = useRecoilValue(quizDatasLegnthState);
  const wrongAnswerQuestionsCount = useRecoilValue(
    wrongAnswerQuestionsCountState
  );

  const currentNavItem = useRecoilValue(currentNavItemState);

  const [, setResultTableItems] = useRecoilState(resultTableItemsState);

  const [elapsedTime, setElapsedTime] = useRecoilState(elapsedTimeState);

  const [wrongAnswerQuestions, setWrongAnswerQuestions] = useRecoilState(
    wrongAnswerQuestionsState
  );

  const progressBarPercent = (sec * 10) / 3;

  const progressBarColor = () => {
    if (isViewAnswer) {
      return "gray";
    }
    if (sec <= 10) {
      return "red";
    }
    if (sec <= 20) {
      return "#f3f039";
    }
    return;
  };

  const quizId = Number(id);

  const circleProgressPercent = formatCircleProgressPercent(
    quizId,
    quizLevel,
    isViewAnswer
  );

  const quizData = quizDatas[quizId - 1];

  const handleSelectedAnswer = useCallback((e: RadioChangeEvent) => {
    setSelectedAnswer(e.target.value);
  }, []);

  const handlerIsCheckAnswer = useCallback(
    () => () => {
      if (selectedAnswer === "") {
        return errorAlert("정답을 선택해주세요", "퀴즈");
      }
      setIsViewAnswer(true);
    },
    [selectedAnswer]
  );

  const resetAnswer = useCallback(() => {
    setSec(secLimit);
    setSelectedAnswer("");
    setIsViewAnswer(() => false);
  }, []);

  const navigateToNextQuiz = () => {
    navigate(`/quiz/${quizId + 1}`);
  };

  const navigateToResultPage = async () => {
    handleLoading();

    const wrongCount = wrongAnswerQuestionsCount;

    const correctCount = quizLevel - wrongAnswerQuestionsCount;

    const resultTableItems = [
      { label: "아이디", content: userId },
      { label: "정답 수", content: correctCount },
      { label: "오답 수", content: wrongCount },
      {
        label: "소요 시간",
        content: elapsedTime,
      },
      {
        label: "전체 시간",
        content: 30 * quizLevel,
      },
    ];
    setResultTableItems(resultTableItems);

    //재도전이라면 리턴되도록
    if (currentNavItem === "재도전") {
      handleLoading();

      return navigate(`/result`);
    }

    const userData = await getDbDataByDocName<UserData>("users", userId);

    const createdAt = new Date();

    const resultsData = userData && (userData.results as ResultItem[]);

    const resultId = userData ? resultsData.length + 1 : 1;

    const newResult = {
      resultId,
      createdAt,
      wrongAnswerQuestions,
      resultTableItems,
    };

    const newData = userData
      ? { ...userData, results: [...resultsData, newResult] }
      : { userId, results: [newResult] };

    await setDbData("users", userId, newData);

    handleLoading();

    navigate(`/result`);
  };

  useEffect(() => {
    if (isViewAnswer) {
      const newElapsedTime = secLimit - sec;
      setElapsedTime((prev) => prev + newElapsedTime);
    }

    const correctAnswer = quizData ? decode(quizData?.correct_answer) : "";

    const isWrongAnswer =
      selectedAnswer !== "" && selectedAnswer !== correctAnswer;

    if (isWrongAnswer && isViewAnswer) {
      setWrongAnswerQuestions((prev) => [...prev, quizData]);
    }
  }, [isViewAnswer]);

  useEffect(() => {
    if (isViewAnswer) {
      return;
    }

    if (sec === 0) {
      return setIsViewAnswer(() => true);
    }

    const interval = setInterval(() => {
      setSec((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [sec, isViewAnswer]);

  useEffect(() => {
    resetAnswer();
  }, [quizId]);

  return (
    <Box $isViewAnswer={isViewAnswer}>
      <Progress type="circle" percent={circleProgressPercent} />
      <ProgressBarBox $sec={sec}>
        <Progress
          className="progress-bar"
          percent={progressBarPercent}
          status="active"
          strokeColor={progressBarColor()}
        />
        <span className="custom-sec">{sec}초</span>
      </ProgressBarBox>
      <QuizCard
        handleSelectedAnswer={handleSelectedAnswer}
        selectedAnswer={selectedAnswer}
        isViewAnswer={isViewAnswer}
        quizData={quizData}
      />
      {isViewAnswer ? (
        quizId === quizDatasLegnth ? (
          <CommonBtn onClick={navigateToResultPage}>결과 확인</CommonBtn>
        ) : (
          <CommonBtn onClick={navigateToNextQuiz}>다음 문제</CommonBtn>
        )
      ) : (
        <CommonBtn onClick={handlerIsCheckAnswer}>정답 확인</CommonBtn>
      )}
    </Box>
  );
};

export default QuizPage;

type BoxProps = {
  $isViewAnswer: boolean;
};

const Box = styled.main<BoxProps>`
  display: flex;
  flex-direction: column;
  gap: 40px;

  .ant-radio-group {
    width: 100%;
    .ant-space {
      width: 100%;
    }
  }

  .radio-box {
    width: 100%;
    padding: 20px 40px;

    ${({ $isViewAnswer, theme }) =>
      !$isViewAnswer &&
      `
    &:hover {
      border-radius: 10px;
      color: white;
      background-color: ${theme.colors.main}};
    }
  `}
  }
`;

const vibrationAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-1.2px);
  }
  100% {
    transform: translateY(0);
  }
`;

type ProgressBarBoxProps = {
  $sec: number;
};

const ProgressBarBox = styled.div<ProgressBarBoxProps>`
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .progress-bar {
    width: 100%;
    margin: 0;
    animation: ${({ $sec }) =>
      $sec <= 10 && $sec > 0
        ? css`
            ${vibrationAnimation} 0.2s ease-in-out infinite
          `
        : "none"};

    > span {
      display: none;
    }
  }

  .custom-sec {
    position: absolute;
    right: 0px;
  }
`;
