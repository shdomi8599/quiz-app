import { useRecoilValue } from "recoil";
import { Descriptions } from "antd";
import { styled } from "styled-components";

import { wrongAnswerQuestionsCountState } from "../../recoil";
import { useUserIdRedirect } from "../../hooks/useUserIdRedirect";

const ResultPage = () => {
  const wrongAnswerQuestionsCount = useRecoilValue(
    wrongAnswerQuestionsCountState
  );

  const { userId, navigate } = useUserIdRedirect();

  const wrongCount = wrongAnswerQuestionsCount;

  const correctCount = 10 - wrongAnswerQuestionsCount;

  // const descriptionsItems = [];

  return (
    <Box>
      <Descriptions column={6} title="퀴즈 결과표" bordered>
        <Descriptions.Item span={6} label="아이디">
          {userId}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="정답 수">
          {correctCount}개
        </Descriptions.Item>
        <Descriptions.Item span={3} label="오답 수">
          {wrongCount}개
        </Descriptions.Item>
        <Descriptions.Item span={6} label="소요 시간">
          8분 31초
        </Descriptions.Item>
      </Descriptions>
    </Box>
  );
};

export default ResultPage;

const Box = styled.main`
  display: flex;
  flex-direction: column;
`;
