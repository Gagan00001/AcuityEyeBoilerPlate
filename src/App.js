import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./screens/Login";
import Sidebar from "./screens/Sidebar";
import SampleForm from "./screens/Sample/Form";
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
            <Route exact path="/" element={<Login />}></Route>
            <Route
              path="/sampleForm"
              element={
                <div>
                  <Sidebar
                  // openMenuClass={openMenu}
                  // handleTabModule={handleTabModule("sidebar")}
                  />
                  <div className="right-content">
                    <SampleForm />
                  </div>
                </div>
              }
            ></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
