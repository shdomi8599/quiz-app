import { Progress } from "antd";
import { css, keyframes, styled } from "styled-components";

type Props = {
  strokeColor?: string;
  percent: number;
  sec: number;
};

const BarProgress = ({ strokeColor, percent, sec }: Props) => {
  return (
    <Box $sec={sec}>
      <Progress
        className="progress-bar"
        percent={percent}
        status="active"
        strokeColor={strokeColor}
      />
      <span className="custom-sec">{sec}초</span>
    </Box>
  );
};

export default BarProgress;

type BoxProps = {
  $sec: number;
};

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

const Box = styled.div<BoxProps>`
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
