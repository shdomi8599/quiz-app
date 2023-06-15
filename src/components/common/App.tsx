import "../../styels/App.css";

import { styled } from "styled-components";
import { Route, Routes } from "react-router-dom";
import { Layout, Spin } from "antd";

import { ROUTES } from "../../constants";
import { useLoadingAndError } from "../../hooks/useLoadingAndError";

import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

function App() {
  const { loading } = useLoadingAndError();
  return (
    <LayoutBox>
      {loading && (
        <LoadingBox>
          <Spin className="spin" />
        </LoadingBox>
      )}
      <AppHeader />
      <Routes>
        {ROUTES.map((el) => (
          <Route key={el.path} path={el.path} element={el.element} />
        ))}
      </Routes>
      <AppFooter />
    </LayoutBox>
  );
}

export default App;

const LayoutBox = styled(Layout)`
  min-height: 100vh;
`;

const LoadingBox = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  opacity: 0.5;
  z-index: 101;
`;
