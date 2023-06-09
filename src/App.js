import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import { store } from "./store";

import "./css/style.scss";
import "./css/mixin.scss";
import "./css/antd-overrides.less";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<Login />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
