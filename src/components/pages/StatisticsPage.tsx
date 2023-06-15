import { styled } from "styled-components";

import { useGetUserDatas } from "../../hooks/useGetUserDatas";

const StatisticsPage = () => {
  const { loading, usersData } = useGetUserDatas();

  console.log(usersData);
  return <Box>통계페이지입니다.</Box>;
};

export default StatisticsPage;

const Box = styled.main``;
