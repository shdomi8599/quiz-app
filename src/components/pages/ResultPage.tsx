import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Descriptions, Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";
import { styled } from "styled-components";

import {
  resultTableItemsState,
  wrongAnswerQuestionsCountState,
} from "../../recoil";
import { confettiRealisticLook, confettiStar } from "../../util/confetti";
import { useUserIdRedirect } from "../../hooks/useUserIdRedirect";

import CopyBtn from "../common/CopyBtn";

const ResultPage = () => {
  useUserIdRedirect();

  const wrongCount = useRecoilValue(wrongAnswerQuestionsCountState);

  const resultTableItems = useRecoilValue(resultTableItemsState);

  const tableItemsCount = resultTableItems.length;

  useEffect(() => {
    if (wrongCount === 0 && tableItemsCount) {
      return confettiStar();
    }
    if (tableItemsCount) {
      confettiRealisticLook();
    }
  }, []);

  return (
    <Box>
      <Result
        icon={<SmileOutlined />}
        title={
          <>
            <div>축하합니다! 모든 퀴즈를 완료하셨습니다.</div>
            <div className="sub-title">
              아이디를 저장해두시면 다양한 컨텐츠에 활용하실 수 있습니다.
            </div>
          </>
        }
        extra={
          <Descriptions column={6} title="결과표" bordered>
            {resultTableItems.map(({ span, label, content }) => (
              <Descriptions.Item key={label} span={span} label={label}>
                {content}
                {label === "아이디" && <CopyBtn content={content} />}
              </Descriptions.Item>
            ))}
          </Descriptions>
        }
      />
    </Box>
  );
};

export default ResultPage;

const Box = styled.main`
  display: flex;
  flex-direction: column;

  .sub-title {
    margin-top: 20px;
    font-size: 1.4rem;
    font-weight: 800;
  }

  .copy-btn {
    margin-left: 8px;
  }
`;
