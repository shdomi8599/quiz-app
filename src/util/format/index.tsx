import CopyBtn from "../../components/common/CopyBtn";

export const formatResultItemContent = (
  label: string,
  content: string | number
) => {
  if (label === "아이디") {
    return (
      <>
        {content}
        <CopyBtn content={String(content)} />
      </>
    );
  }
  if (label === "정답 수" || label === "오답 수") {
    return `${content}개`;
  }
  if (label === "소요 시간" || label === "전체 시간") {
    return `${content}초`;
  }
};
