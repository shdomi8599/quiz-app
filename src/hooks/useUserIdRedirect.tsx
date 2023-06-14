import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

import { userIdState } from "../recoil";

export const useUserIdRedirect = () => {
  const userId = useRecoilValue(userIdState);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/");
    }
  }, [userId]);

  return {
    userId,
    navigate,
  };
};
