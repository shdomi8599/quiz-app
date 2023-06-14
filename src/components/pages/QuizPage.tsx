import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Space, Radio, RadioChangeEvent, Badge } from "antd";
import { useRecoilState } from "recoil";
import { styled } from "styled-components";

import {
  quizDatasState,
  userIdState,
  wrongAnswerQuestionsState,
} from "../../recoil";
import { getDbDataByDocName, setDbData } from "../../util/firebase";
import { UserData } from "../../types";
import { errorAlert } from "../common/Alert";
import { shuffleDatas } from "../../util/random";
import { useUserIdRedirect } from "../../hooks/useUserIdRedirect";

const QuizPage = () => {
  const { userId, navigate } = useUserIdRedirect();

  const { id } = useParams();

  const quizId = Number(id);

  const [isCheckAnswer, setIsCheckAnswer] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState("");

  const [wrongAnswerQuestions, setWrongAnswerQuestions] = useRecoilState(
    wrongAnswerQuestionsState
  );

  const [quizDatas] = useRecoilState(quizDatasState);

  const quizData = useMemo(() => quizDatas[quizId - 1], [quizDatas, quizId]);

  const correctAnswer = quizData ? quizData.correct_answer : "";

  const wrongAnswer = quizData ? quizData.incorrect_answers : [];

  const answers = useMemo(
    () => shuffleDatas([...wrongAnswer, correctAnswer]),
    [quizData]
  );

  const handleSelectedAnswer = useCallback((e: RadioChangeEvent) => {
    setSelectedAnswer(e.target.value);
  }, []);

  const handlerIsCheckAnswer = useCallback(() => {
    setIsCheckAnswer((prev) => !prev);
  }, []);

  const resetAnswer = useCallback(() => {
    setSelectedAnswer("");
    handlerIsCheckAnswer();
  }, []);

  const navigateToNextQuiz = () => {
    resetAnswer();
    navigate(`/quiz/${quizId + 1}`);
  };

  const navigateToResultPage = async () => {
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

    navigate(`/result`);
  };

  useEffect(() => {
    const isWrongAnswer =
      selectedAnswer !== "" && selectedAnswer !== correctAnswer;
    if (isWrongAnswer && isCheckAnswer) {
      setWrongAnswerQuestions((prev) => [...prev, quizData]);
    }
  }, [isCheckAnswer]);

  return (
    <Box $isCheckAnswer={isCheckAnswer}>
      <Card className="card" title={quizData?.question} bordered={false}>
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
                  disabled={isCheckAnswer}
                >
                  {answer}
                </Radio>
              </Badge.Ribbon>
            ))}
          </Space>
        </Radio.Group>
      </Card>
      {isCheckAnswer ? (
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
  $isCheckAnswer: boolean;
};

const Box = styled.main<BoxProps>`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .card {
    width: 70%;
    height: auto;

    .ant-card-head-title {
      white-space: normal;
    }

    .ant-ribbon {
      display: ${({ $isCheckAnswer }) => ($isCheckAnswer ? "display" : "none")};
      top: 20px;
      left: -33px;
    }
  }

  .radio-box {
    margin: 20px 40px;
  }
`;
