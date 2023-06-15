import { useCallback, useState } from "react";
import { styled } from "styled-components";

import { UserData } from "../../types";
import { formatUsers } from "../../util/format";
import { RANKING_COLUMNS } from "../../constants";
import { useGetUsersData } from "../../hooks/user/useGetUsersData";

import TableContent from "../table/TableContent";
import TableSkeleton from "../skeleton/TableSkeleton";

const RankingPage = () => {
  const { loading, usersData } = useGetUsersData();

  const [page, setPage] = useState(1);

  const [size, setSize] = useState(10);

  const sortedUsers = formatUsers(usersData)
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

  const totalElements = usersData.length;

  const handlePageChange = useCallback((newPage: number, newSize: number) => {
    setPage(newPage);
    setSize(newSize);
  }, []);

  return (
    <Box>
      {loading ? (
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
