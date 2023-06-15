import CopyBtn from "../../components/btn/CopyBtn";
import { ResultItem, UserData } from "../../types";

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

export const formatDate = (date: Date): string => {
  const year = date.getFullYear().toString();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;
};

export const formatUsers = (usersData: UserData[]) => {
  return usersData?.map((data) => {
    const userId = data.userId;

    const maskedUserId = userId.slice(0, -3) + "***";

    const userResultsData = data.results;

    const accumulateAnswers = userResultsData?.reduce(
      (acc, result) =>
        acc +
        Number(
          result.resultTableItems.find((item) => item.label === "정답 수")
            ?.content
        ),
      0
    );
    return {
      key: userId,
      userId: maskedUserId,
      accumulateAnswers,
    };
  });
};

export const formatSelectItems = (resultsData: ResultItem[]) => {
  return resultsData?.map(({ createdAt }, idx) => {
    const date = formatDate(new Date(createdAt.seconds * 1000));
    return {
      value: idx,
      label: date,
    };
  });
};
