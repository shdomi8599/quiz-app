import {
  Badge,
  Button,
  Card,
  Modal,
  Radio,
  RadioChangeEvent,
  Space,
} from "antd";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { styled } from "styled-components";
import { decode } from "he";

import { QuizData } from "../../types";
import { shuffleDatas } from "../../util/random";
import { useModalUtil } from "../../hooks/useModalUtil";

type Props = {
  handleSelectedAnswer?: (e: RadioChangeEvent) => void;
  selectedAnswer?: string;
  isViewAnswer: boolean;
  quizData: QuizData;
  quizId?: number;
};

const QuizCard = ({
  quizData,
  handleSelectedAnswer,
  selectedAnswer,
  isViewAnswer,
  quizId,
}: Props) => {
  const location = useLocation();

  const { pathname } = location;

  const isMistakePage = pathname.includes("mistake");

  const { isModalOpen, handleModalCancel, showModal } = useModalUtil({});

  const handleModalOk = () => {
    handleModalCancel();
  };

  const quizTitle = quizData ? decode(quizData?.question) : "";

  const correctAnswer = quizData ? decode(quizData?.correct_answer) : "";

  const wrongAnswer =
    quizData?.incorrect_answers?.map((answer) => decode(answer)) || [];

  const answers = useMemo(
    () => shuffleDatas([...wrongAnswer, correctAnswer]),
    [quizData]
  );
  return (
    <>
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
      {quizData?.mistakeNote && isMistakePage && (
        <>
          <MistakeBox>
            <Button onClick={showModal} type="primary">
              오답 노트 조회
            </Button>
          </MistakeBox>
          <Modal
            title={`${quizId}번 문제 오답노트`}
            open={isModalOpen}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
          >
            {quizData?.mistakeNote}
          </Modal>
        </>
      )}
    </>
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

const MistakeBox = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;
