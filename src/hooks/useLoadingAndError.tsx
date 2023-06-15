import { useCallback } from "react";
import { useRecoilState } from "recoil";

import { loadingState } from "../recoil/atom";
import { errorAlert } from "../components/common/Alert";

export const useLoadingAndError = () => {
  const [loading, setLoading] = useRecoilState(loadingState);

  const handleError = useCallback((mode: "퀴즈" | "유저") => {
    handleLoading();
    if (mode === "퀴즈") {
      errorAlert("잠시 후에 다시 시도해주세요.", "퀴즈");
    }
    if (mode === "유저") {
      errorAlert("닉네임이 존재하지 않습니다.", "유저");
    }
  }, []);

  const handleLoading = useCallback(() => {
    setLoading((prev) => !prev);
  }, []);

  return {
    handleLoading,
    loading,
    handleError,
  };
};
