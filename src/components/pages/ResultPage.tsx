import { useRecoilValue } from "recoil";
import { Descriptions } from "antd";
import { styled } from "styled-components";

import { resultTableItemsState } from "../../recoil";
import { useUserIdRedirect } from "../../hooks/useUserIdRedirect";

const ResultPage = () => {
  useUserIdRedirect();

  const resultTableItems = useRecoilValue(resultTableItemsState);

  return (
    <Box>
      <Descriptions column={6} title="퀴즈 결과표" bordered>
        {resultTableItems.map(({ span, label, content }) => (
          <Descriptions.Item key={label} span={span} label={label}>
            {content}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Box>
  );
};

export default ResultPage;

const Box = styled.main`
  display: flex;
  flex-direction: column;
`;
