import { styled } from "styled-components";

import { useGetUsersData } from "../../hooks/useGetUsersData";

const StatisticsPage = () => {
  const { loading, usersData } = useGetUsersData();

  console.log(usersData);
  return <Box>통계페이지입니다.</Box>;
};

export default StatisticsPage;

const Box = styled.main``;
