import { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { UserData } from "../../types";
import { getDbAllData } from "../../util/firebase";
import { useCommonLoading } from "../../hooks/useCommonLoading";
import TableSkeleton from "../skeleton/TableSkeleton";
import TableContent from "../table/TableContent";
import { RANKING_COLUMNS } from "../../constants";

const RankingPage = () => {
  const { commonLoading, handleCommonLoading } = useCommonLoading();

  const [page, setPage] = useState(1);

  const [size, setSize] = useState(10);

  const [userDatas, setUserDatas] = useState<UserData[]>([]);

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;

  const data = userDatas.slice(startIndex, endIndex);

  const totalElements = userDatas.length;

  const handlePageChange = useCallback((newPage: number, newSize: number) => {
    setPage(newPage);
    setSize(newSize);
  }, []);

  useEffect(() => {
    handleCommonLoading();
    getDbAllData<UserData>("users").then((res) => {
      setUserDatas(res);
      handleCommonLoading();
    });
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

const Box = styled.main``;
