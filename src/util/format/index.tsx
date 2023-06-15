import CopyBtn from "../../components/btn/CopyBtn";

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

export const formatResultItemSpan = (label: string) => {
  if (label === "아이디") {
    return 6;
  }
  return 3;
};

/**
 * 날짜를 입력받아 포맷팅에 맞게 날짜를 리턴해주는 함수, 작성일자에 활용
 * @param date
 * @returns 예시 2023년 4월 1일 12시 34분 56초
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear().toString();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;
};
