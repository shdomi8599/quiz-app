import { useRecoilState } from "recoil";
import { useCallback, useEffect } from "react";

import { useCommonLoading } from "./useCommonLoading";
import { resultTableItemsState, userDatasState } from "../recoil/atom";
import { UserData } from "../types";
import { getDbAllData } from "../util/firebase";
import { errorAlert } from "../components/common/Alert";

const useGetUserDatas = () => {
  const { commonLoading, handleCommonLoading } = useCommonLoading();

  const [resultTableItems, setResultTableItems] = useRecoilState(
    resultTableItemsState
  );

  const [usersData, setUsersData] = useRecoilState(userDatasState);

  const fetchData = useCallback(async () => {
    try {
      handleCommonLoading();
      const res = await getDbAllData<UserData>("users");
      setUsersData(res);
    } catch (error) {
      errorAlert("잠시 후에 다시 시도해주세요", "조회");
    } finally {
      handleCommonLoading();
    }
  }, []);

  useEffect(() => {
    if (usersData.length > 0) {
      return;
    }

    fetchData();
  }, []);

  //유저가 결과조회까지 마치게되면 새로운 서버 데이터를 갖고 올 수 있도록하고, 결과데이터를 초기화시켜서 refecth 방지
  useEffect(() => {
    if (resultTableItems.length > 0) {
      fetchData();
      setResultTableItems([]);
    }
  }, [resultTableItems]);

  return {
    commonLoading,
    usersData,
  };
};

export default useGetUserDatas;
