import { styled } from "styled-components";

import { Footer } from "antd/es/layout/layout";

const AppFooter = () => {
  return <FooterBox>QuizTech ©2023 Created by shdomi8599</FooterBox>;
};

export default AppFooter;

const FooterBox = styled(Footer)`
  text-align: center;
`;
