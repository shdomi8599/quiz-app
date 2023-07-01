import { Dispatch, SetStateAction, useEffect } from "react";

export const useOffResize = (
  size: number,
  set: "up" | "down",
  setEvent: Dispatch<SetStateAction<boolean>>
) => {
  const upOffMenu = () => {
    if (window.innerWidth > size) {
      setEvent(false);
    }
  };

  const downOffMenu = () => {
    if (window.innerWidth < size) {
      setEvent(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (set === "up") {
      window.addEventListener("resize", upOffMenu);
    }
    if (set === "down") {
      window.addEventListener("resize", downOffMenu);
    }
    return () => {
      if (set === "up") {
        window.removeEventListener("resize", upOffMenu);
      }
      if (set === "down") {
        window.removeEventListener("resize", downOffMenu);
      }
    };
  }, []);
};
