import { useCallback, useState } from "react";
import { styled } from "styled-components";

import { UserData } from "../../types";
import { RANKING_COLUMNS } from "../../constants";

import TableContent from "../table/TableContent";
import TableSkeleton from "../skeleton/TableSkeleton";
import useGetUserDatas from "../../hooks/useGetUserDatas";

const RankingPage = () => {
  const { commonLoading, userDatas } = useGetUserDatas();

  const [page, setPage] = useState(1);

  const [size, setSize] = useState(10);

  const formatUsers = userDatas.map((data) => {
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

  const sortedUsers = formatUsers
    .sort((a, b) => {
      const sumA = a.accumulateAnswers as number;
      const sumB = b.accumulateAnswers as number;
      return sumB - sumA;
    })
    .map((data, idx) => {
      return {
        ...data,
        rank: idx + 1,
      };
    });

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;

  const data = sortedUsers.slice(startIndex, endIndex);

  const totalElements = userDatas.length;

  const handlePageChange = useCallback((newPage: number, newSize: number) => {
    setPage(newPage);
    setSize(newSize);
  }, []);

  return (
    <Box>
      {commonLoading ? (
        <TableSkeleton size={size} />
      ) : (
        <TableContent<UserData>
          dataSource={data}
          columns={RANKING_COLUMNS}
          page={page}
          size={size}
          handlePageChange={handlePageChange}
          totalElements={totalElements}
        />
      )}
    </Box>
  );
};

export default RankingPage;

const Box = styled.main`
  margin: 40px 0px;
`;
