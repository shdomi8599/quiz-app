import { Button } from "antd";
import { ReactNode, memo } from "react";

type Props = {
  type?: "link" | "text" | "ghost" | "default" | "primary" | "dashed";
  htmlType?: "button" | "submit" | "reset";
  onClick?: () => void;
  children: ReactNode;
};

const CommonBtn = ({ type, onClick, children, htmlType }: Props) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      htmlType={htmlType}
      children={children}
    />
  );
};
export default memo(CommonBtn);
