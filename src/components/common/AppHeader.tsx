import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { Layout } from "antd";
import { useRecoilState } from "recoil";
import { FaBars } from "react-icons/fa";

import {
  currentNavItemState,
  elapsedTimeState,
  userDataState,
  wrongAnswerQuestionsState,
} from "../../recoil/atom";
import { useOffResize } from "../../hooks/useOffResize";
import { NAV_ITEMS } from "../../constants";
import { confirmAlert } from "./Alert";

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [currentNavItem, setCurrentNavItem] =
    useRecoilState(currentNavItemState);

  const [, setWrongAnswerQuestions] = useRecoilState(wrongAnswerQuestionsState);

  const [, setElapsedTime] = useRecoilState(elapsedTimeState);

  const [, setUserData] = useRecoilState(userDataState);

  const [isNav, setIsNav] = useState(false);
  useOffResize(768, "up", setIsNav); //768px보다 페이지가 커지면 네비를 off하기 위한 hook

  const { pathname } = location;
  const isQuizPage = pathname.includes("quiz");

  const navItemsKeys = useMemo(() => Object.keys(NAV_ITEMS), []);
  const navItems = navItemsKeys.map((item) => (
    <NavItemBox
      $pathname={pathname}
      $item={NAV_ITEMS[item]}
      key={item}
      onClick={() => onClickNavItem(item)}
    >
      {item}
    </NavItemBox>
  ));

  const handleNavigationToggle = useCallback(() => {
    setIsNav((prevIsNav) => !prevIsNav);
  }, []);

  const resetState = useCallback(() => {
    setIsNav(false);
    setElapsedTime(0);
    setUserData(null);
    setWrongAnswerQuestions([]);
  }, []);

  //비동기 동작 순서를 고려해서 확실하게 reset 후, 이동시키기 위해 navigate를 useEffect 처리
  const handleNavItem = (key: string) => {
    if (currentNavItem === key) {
      return;
    }
    resetState();
    setCurrentNavItem(key);
  };

  const onClickNavItem = (key: string) => {
    if (isQuizPage) {
      confirmAlert("정말 포기하시겠습니까?", "퀴즈 포기가")
        .then(() => {
          handleNavItem(key);
        })
        .catch(() => {});
    } else {
      handleNavItem(key);
    }
  };

  useEffect(() => {
    const path = NAV_ITEMS[currentNavItem];
    //퀴즈,재도전 페이지 이동 시, 일어나는 문제를 방지하기 위함
    if (path) {
      navigate(path);
    }
  }, [currentNavItem]);

  return (
    <HeaderBox>
      <div className="logo-box">
        <img
          onClick={() => onClickNavItem("홈")}
          src={"/logo.png"}
          alt="logo"
        />
      </div>
      <NavBox>
        <ul>{navItems}</ul>
      </NavBox>
      <FaBars className="bars-icon" onClick={handleNavigationToggle} />
      <ModalNavBox $isNav={isNav}>
        <ul>{navItems}</ul>
      </ModalNavBox>
    </HeaderBox>
  );
};

export default AppHeader;
const HeaderBox = styled(Header)`
  width: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px calc((100% - 960px) / 2);
  z-index: 100;

  .logo-box {
    min-width: 140px;
    height: 60%;
    padding-left: 8px;

    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }

  .bars-icon {
    display: none;
    color: white;
    padding-right: 8px;
    font-size: 2rem;
    cursor: pointer;

    @media ${({ theme }) => theme.mediaQueries.tablet} {
      display: block;
    }
  }
`;

const NavBox = styled.nav`
  color: #cac7c7;

  @media ${({ theme }) => theme.mediaQueries.tablet} {
    display: none;
  }

  ul {
    display: flex;
  }
`;

type NavItemBoxProps = {
  $pathname: string;
  $item: string;
};

const NavItemBox = styled.li<NavItemBoxProps>`
  padding: 0px 20px;
  cursor: pointer;

  background-color: ${({ $pathname, $item, theme }) =>
    $pathname === $item ? theme.colors.mainHover : ""};
  color: ${({ $pathname, $item }) => ($pathname === $item ? "white" : "")};
`;

type ModalNavBoxProps = {
  $isNav: boolean;
};

const ModalNavBox = styled.nav<ModalNavBoxProps>`
  position: fixed;
  top: 64px;
  transition: 0.8s;
  width: 40%;
  height: 100%;
  right: ${({ $isNav }) => ($isNav ? "0" : "-70%")};
  padding: 20px;
  color: white;
  background-color: ${({ theme }) => theme.colors.main};

  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      text-align: center;
      cursor: pointer;
      border-radius: 8px;
      font-size: 1.2rem;

      &:hover {
        background: ${({ theme }) => theme.colors.mainHover};
      }
    }
  }
`;
