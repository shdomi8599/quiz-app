import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { css, keyframes, styled } from "styled-components";
import { useRecoilState, useRecoilValue } from "recoil";
import { decode } from "he";
import {
  Button,
  Card,
  Space,
  Radio,
  RadioChangeEvent,
  Badge,
  Progress,
} from "antd";

import {
  elapsedTimeState,
  quizDatasState,
  resultTableItemsState,
  wrongAnswerQuestionsCountState,
  wrongAnswerQuestionsState,
} from "../../recoil";
import { getDbDataByDocName, setDbData } from "../../util/firebase";
import { shuffleDatas } from "../../util/random";
import { UserData } from "../../types";
import { useUserIdRedirect } from "../../hooks/useUserIdRedirect";
import { useCommonLoading } from "../../hooks/useCommonLoading";
import { errorAlert } from "../common/Alert";

const QuizPage = () => {
  const { handleCommonLoading } = useCommonLoading();

  const { userId, navigate } = useUserIdRedirect();

  const { id } = useParams();

  const secLimit = 30;

  const [sec, setSec] = useState(secLimit);

  const [isViewAnswer, setIsViewAnswer] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [, setResultTableItems] = useRecoilState(resultTableItemsState);

  const wrongAnswerQuestionsCount = useRecoilValue(
    wrongAnswerQuestionsCountState
  );

  const [elapsedTime, setElapsedTime] = useRecoilState(elapsedTimeState);

  const [wrongAnswerQuestions, setWrongAnswerQuestions] = useRecoilState(
    wrongAnswerQuestionsState
  );

  const quizDatas = useRecoilValue(quizDatasState);

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

  const circleProgressPercent = isViewAnswer ? quizId * 10 : (quizId - 1) * 10;

  const quizData = quizDatas[quizId - 1];

  const quizTitle = quizData ? decode(quizData?.question) : "";

  const correctAnswer = quizData ? decode(quizData?.correct_answer) : "";

  const wrongAnswer = quizData
    ? quizData.incorrect_answers.map((answer) => decode(answer))
    : [];

  const answers = useMemo(
    () => shuffleDatas([...wrongAnswer, correctAnswer]),
    [quizData]
  );

  const handleSelectedAnswer = useCallback((e: RadioChangeEvent) => {
    setSelectedAnswer(e.target.value);
  }, []);

  const handlerIsCheckAnswer = () => {
    if (selectedAnswer === "") {
      return errorAlert("정답을 선택해주세요", "퀴즈");
    }
    setIsViewAnswer(true);
  };

  const resetAnswer = useCallback(() => {
    setSelectedAnswer("");
    setIsViewAnswer(false);
  }, []);

  const navigateToNextQuiz = () => {
    resetAnswer();
    navigate(`/quiz/${quizId + 1}`);
  };

  const navigateToResultPage = async () => {
    handleCommonLoading();

    const wrongCount = wrongAnswerQuestionsCount;

    const correctCount = 10 - wrongAnswerQuestionsCount;

    const newResultTableItems = [
      { label: "아이디", span: 6, content: userId },
      { label: "정답 수", span: 3, content: `${correctCount}개` },
      { label: "오답 수", span: 3, content: `${wrongCount}개` },
      { label: "소요 시간", span: 6, content: `${elapsedTime}초 / 600초` },
    ];
    setResultTableItems(newResultTableItems);

    await getDbDataByDocName<UserData>("users", userId)
      .then((res) => {
        const resultsData = res.results;

        const resultId = resultsData?.length && resultsData?.length + 1;

        const newData = {
          ...res,
          results: resultsData
            ? [...resultsData, { wrongAnswerQuestions, resultId }]
            : [{ wrongAnswerQuestions, resultId: 1 }],
        };

        setDbData("users", userId, newData);
      })
      .catch(() => errorAlert("잠시 후에 다시 시도해주세요.", "결과 조회"));

    handleCommonLoading();

    navigate(`/result`);
  };

  useEffect(() => {
    if (isViewAnswer) {
      const newElapsedTime = secLimit - sec;
      setElapsedTime((prev) => prev + newElapsedTime);
    }

    const isWrongAnswer =
      selectedAnswer !== "" && selectedAnswer !== correctAnswer;

    if (isWrongAnswer && isViewAnswer) {
      setWrongAnswerQuestions((prev) => [...prev, quizData]);
    }
  }, [isViewAnswer]);

  useEffect(() => {
    setSec(secLimit);
  }, [quizId]);

  useEffect(() => {
    if (isViewAnswer) {
      return;
    }

    if (sec === 0) {
      return setIsViewAnswer(true);
    }

    const interval = setInterval(() => {
      setSec((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [sec, isViewAnswer]);

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
      <Card className="card" title={<div>{quizTitle}</div>} bordered={false}>
        <Radio.Group onChange={handleSelectedAnswer} value={selectedAnswer}>
          <Space direction="vertical">
            {answers.map((answer) => (
              <Badge.Ribbon
                key={answer}
                placement="start"
                text={correctAnswer === answer ? "정답" : "오답"}
                color={correctAnswer === answer ? "blue" : "red"}
              >
                <Radio
                  className="radio-box"
                  key={answer}
                  value={answer}
                  disabled={isViewAnswer}
                >
                  {answer}
                </Radio>
              </Badge.Ribbon>
            ))}
          </Space>
        </Radio.Group>
      </Card>
      {isViewAnswer ? (
        id === "10" ? (
          <Button onClick={navigateToResultPage}>결과 확인</Button>
        ) : (
          <Button onClick={navigateToNextQuiz}>다음 문제</Button>
        )
      ) : (
        <Button onClick={handlerIsCheckAnswer}>정답 확인</Button>
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

  .card {
    width: 70%;
    height: auto;

    .ant-card-head-title {
      white-space: normal;
    }

    .ant-ribbon {
      display: ${({ $isViewAnswer }) => ($isViewAnswer ? "display" : "none")};
      top: 20px;
      left: -33px;
    }
  }

  .radio-box {
    margin: 20px 40px;
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
