import { useRecoilState, useRecoilValue } from "recoil";
import { useCallback } from "react";

import { userDataState } from "../../recoil/atom";
import { RecordsSearchFormItem, UserData } from "../../types";
import { getDbDataByDocName } from "../../util/firebase";
import { useLoadingAndError } from "../useLoadingAndError";
import { resultsDataState } from "../../recoil/selector";

export const useGetUserData = () => {
  const { loading, handleLoading, handleError } = useLoadingAndError();

  const [userData, setUserData] = useRecoilState(userDataState);

  const resultsData = useRecoilValue(resultsDataState);

  const userId = userData?.userId;

  const fetchData = async (userId: string) => {
    handleLoading();

    const dbUserData = await getDbDataByDocName<UserData>("users", userId);

    if (dbUserData) {
      setUserData(dbUserData);
    } else {
      return handleError("유저");
    }

    handleLoading();
  };

  const onFinish = useCallback(async (values: RecordsSearchFormItem) => {
    const { nickname, code } = values;
    const userId = nickname + code;
    await fetchData(userId);
  }, []);

  const refetch = useCallback(async () => {
    await fetchData(userId as string);
  }, [userId]);

  return {
    loading,
    resultsData,
    userId,
    onFinish,
    handleLoading,
    refetch,
    userData,
  };
};