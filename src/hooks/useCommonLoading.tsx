import { useCallback } from "react";
import { useRecoilState } from "recoil";

import { commonLoadingState } from "../recoil/atom";

export const useCommonLoading = () => {
  const [commonLoading, setCommonLoading] = useRecoilState(commonLoadingState);

  const handleCommonLoading = useCallback(() => {
    setCommonLoading((prev) => !prev);
  }, []);

  return {
    handleCommonLoading,
    commonLoading,
  };
};
