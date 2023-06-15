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
  }, []);

  useEffect(() => {
    const preventGoBack = () => {
      navigate("/");
    };

    window.addEventListener("popstate", preventGoBack);

    return () => window.removeEventListener("popstate", preventGoBack);
  }, []);

  return {
    userId,
    navigate,
  };
};
