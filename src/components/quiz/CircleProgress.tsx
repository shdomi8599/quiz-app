import { Progress } from "antd";
import { memo } from "react";

const CircleProgress = ({ percent }: { percent: number }) => {
  return <Progress type="circle" percent={percent} />;
};
export default memo(CircleProgress);
