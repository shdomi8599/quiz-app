import { Button } from "antd";
import { ReactNode, memo } from "react";

type Props = {
  type?: "link" | "text" | "ghost" | "default" | "primary" | "dashed";
  onClick: () => void;
  children: ReactNode;
};

const CommonBtn = ({ type, onClick, children }: Props) => {
  return <Button type={type} onClick={onClick} children={children} />;
};
export default memo(CommonBtn);
