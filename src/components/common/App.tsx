import "../../styels/App.css";

import { styled } from "styled-components";
import { Route, Routes } from "react-router-dom";
import { Layout, Spin } from "antd";

import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import { ROUTES } from "../../constants";
import { useCommonLoading } from "../../hooks/useCommonLoading";

function App() {
  const { commonLoading } = useCommonLoading();
  return (
    <Layout className="layout">
      {commonLoading && (
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
    </Layout>
  );
}

export default App;

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
