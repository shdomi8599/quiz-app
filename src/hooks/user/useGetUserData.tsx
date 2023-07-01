import { useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useState } from "react";

import { userDataState } from "../../recoil/atom";
import { RecordsSearchFormItem, UserData } from "../../types";
import { getDbDataByDocName } from "../../util/firebase";
import { useLoadingAndError } from "../useLoadingAndError";
import { resultsDataState } from "../../recoil/selector";

export const useGetUserData = () => {
  const { handleLoading, handleError } = useLoadingAndError();

  const [userData, setUserData] = useRecoilState(userDataState);

  const resultsData = useRecoilValue(resultsDataState);

  const [selectedResult, setSelectedResult] = useState<number>();

  const userId = userData?.userId;

  const handleResultChange = useCallback((value: number) => {
    setSelectedResult(value);
  }, []);

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

  const onFinish = async (values: RecordsSearchFormItem) => {
    const { nickname, code } = values;
    const userId = nickname + code;
    await fetchData(userId);
  };

  const refetch = async () => {
    await fetchData(userId as string);
  };

  return {
    userId,
    userData,
    resultsData,
    selectedResult,
    refetch,
    onFinish,
    handleLoading,
    handleResultChange,
  };
};
