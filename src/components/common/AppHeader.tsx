import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { Layout } from "antd";
import { useRecoilState } from "recoil";
import { FaBars } from "react-icons/fa";

import {
  currentNavItemState,
  elapsedTimeState,
  quizDatasState,
  userIdState,
  wrongAnswerQuestionsState,
} from "../../recoil";
import { useOffResize } from "../../hooks/useOffResize";
import { NAV_ITEMS } from "../../constants";
import { confirmAlert } from "./Alert";

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [, setUserId] = useRecoilState(userIdState);

  const [currentNavItem, setCurrentNavItem] =
    useRecoilState(currentNavItemState);

  const [, setWrongAnswerQuestions] = useRecoilState(wrongAnswerQuestionsState);

  const [, setElapsedTime] = useRecoilState(elapsedTimeState);

  const [, setQuizDatas] = useRecoilState(quizDatasState);

  const [isNav, setIsNav] = useState(false);
  useOffResize(768, "up", setIsNav); //768px보다 페이지가 커지면 네비를 off하기 위한 hook

  const { pathname } = location;
  const isQuizPage = pathname.includes("quiz");

  const navItemsKeys = useMemo(() => Object.keys(NAV_ITEMS), []);
  const navItems = navItemsKeys.map((item) => (
    <NavItemBox
      $currentNavItem={currentNavItem}
      $item={item}
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
    setUserId("");
    setIsNav(false);
    setElapsedTime(0);
    setQuizDatas([]);
    setWrongAnswerQuestions([]);
  }, []);

  const handleNavItem = useCallback((key: string) => {
    setCurrentNavItem(key);
    resetState();
  }, []);

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
  $currentNavItem: string;
  $item: string;
};

const NavItemBox = styled.li<NavItemBoxProps>`
  padding: 0px 20px;
  cursor: pointer;

  background-color: ${({ $currentNavItem, $item, theme }) =>
    $currentNavItem === $item ? theme.colors.mainHover : ""};
  color: ${({ $currentNavItem, $item }) =>
    $currentNavItem === $item ? "white" : ""};
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
