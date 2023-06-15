import { Badge, Card, Radio, RadioChangeEvent, Space } from "antd";
import { styled } from "styled-components";
import { QuizData } from "../../types";
import { decode } from "he";
import { useMemo } from "react";
import { shuffleDatas } from "../../util/random";

type Props = {
  handleSelectedAnswer?: (e: RadioChangeEvent) => void;
  selectedAnswer?: string;
  isViewAnswer: boolean;
  quizData: QuizData;
};

const QuizCard = ({
  quizData,
  handleSelectedAnswer,
  selectedAnswer,
  isViewAnswer,
}: Props) => {
  const quizTitle = quizData ? decode(quizData?.question) : "";

  const correctAnswer = quizData ? decode(quizData?.correct_answer) : "";

  const wrongAnswer =
    quizData?.incorrect_answers?.map((answer) => decode(answer)) || [];

  const answers = useMemo(
    () => shuffleDatas([...wrongAnswer, correctAnswer]),
    [quizData]
  );
  return (
    <CardBox
      $isViewAnswer={isViewAnswer}
      title={<div>{quizTitle}</div>}
      bordered={false}
    >
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
    </CardBox>
  );
};
export default QuizCard;

type CardBoxProps = {
  $isViewAnswer: boolean;
};

const CardBox = styled(Card)<CardBoxProps>`
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
`;
