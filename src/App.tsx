import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./components/pages/HomePage";
import QuizPage from "./components/pages/QuizPage";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

function App() {
  //라우트에 들어갈 데이터들
  const routes = [
    { path: "/", element: <HomePage /> },
    { path: "/quiz/:id", element: <QuizPage /> },
  ];

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {routes.map((el) => (
          <Route key={el.path} path={el.path} element={el.element} />
        ))}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
