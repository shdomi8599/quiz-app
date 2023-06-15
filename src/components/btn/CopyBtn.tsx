import { Button } from "antd";
import { errorAlert, successAlert } from "../common/Alert";

type Props = {
  content: string;
};

const CopyBtn = ({ content }: Props) => {
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      successAlert("클립보드에 복사되었습니다.", "아이디 복사");
    } catch (error) {
      errorAlert("다시 시도해주세요.", "아이디 복사");
    }
  };

  return (
    <Button className="copy-btn" onClick={doCopy}>
      복사
    </Button>
  );
};

export default CopyBtn;
