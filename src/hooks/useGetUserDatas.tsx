import { useRecoilState } from "recoil";
import { useCallback, useEffect } from "react";

import { useCommonLoading } from "./useCommonLoading";
import { userDatasState } from "../recoil/atom";
import { UserData } from "../types";
import { getDbAllData } from "../util/firebase";
import { errorAlert } from "../components/common/Alert";

const useGetUserDatas = () => {
  const { commonLoading, handleCommonLoading } = useCommonLoading();

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

  return {
    commonLoading,
    usersData,
  };
};

export default useGetUserDatas;
