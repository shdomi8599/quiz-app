import { Result } from "antd";
import { memo } from "react";

type Props = {
  title: string;
  extra: JSX.Element;
};

const ResultSelectBox = ({ title, extra }: Props) => {
  return <Result status="warning" title={title} extra={extra} />;
};

export default memo(ResultSelectBox);
