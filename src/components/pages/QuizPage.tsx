import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { styled } from "styled-components";
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

import { quizDatasState, wrongAnswerQuestionsState } from "../../recoil";
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

  const [isViewAnswer, setIsViewAnswer] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [wrongAnswerQuestions, setWrongAnswerQuestions] = useRecoilState(
    wrongAnswerQuestionsState
  );

  const [quizDatas] = useRecoilState(quizDatasState);

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
      .catch(() => errorAlert("잠시 후에 다시 시도해주세요.", "결과"));

    handleCommonLoading();

    navigate(`/result`);
  };

  useEffect(() => {
    const isWrongAnswer =
      selectedAnswer !== "" && selectedAnswer !== correctAnswer;
    if (isWrongAnswer && isViewAnswer) {
      setWrongAnswerQuestions((prev) => [...prev, quizData]);
    }
  }, [isViewAnswer]);

  return (
    <Box $isViewAnswer={isViewAnswer}>
      <Progress type="circle" percent={circleProgressPercent} />
      <Progress className="progress" percent={3} status="active" />
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

  .progress {
    width: 70%;
    margin: 0;
  }

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
