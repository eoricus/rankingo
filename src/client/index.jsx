import React from "react";
import ReactDOM from "react-dom";

// Элементы
import Header from "./app/header.jsx";
import Main from "./app/main.jsx";

// Стили
import "./app/styles/global.scss";
import "./app/styles/header.scss";
import "./app/styles/main.scss";

ReactDOM.render(
  <div id="app">
    <Header />
    <Main />
  </div>,
  document.getElementById("body")
);
