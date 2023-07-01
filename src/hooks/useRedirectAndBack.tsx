import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { userIdState } from "../recoil/atom";

export const useRedirectAndBack = () => {
  const userId = useRecoilValue(userIdState);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const preventGoBack = () => {
      navigate("/");
    };

    window.addEventListener("popstate", preventGoBack);

    return () => window.removeEventListener("popstate", preventGoBack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    userId,
    navigate,
  };
};
