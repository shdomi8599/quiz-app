import "../../styels/App.css";
import theme from "../../styels/theme";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Layout } from "antd";

import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import { ROUTES } from "../../constants";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Layout className="layout">
          <AppHeader />
          <Routes>
            {ROUTES.map((el) => (
              <Route key={el.path} path={el.path} element={el.element} />
            ))}
          </Routes>
          <AppFooter />
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
