import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { UserData } from "../../types";
import { getDbAllData } from "../../util/firebase";

const RankingPage = () => {
  const [userDatas, setUserDatas] = useState<UserData[]>([]);

  useEffect(() => {
    getDbAllData<UserData>("users").then((res) => {
      setUserDatas(res);
    });
  }, []);

  return <Box>랭킹페이지입니다.</Box>;
};

export default RankingPage;

const Box = styled.main``;
