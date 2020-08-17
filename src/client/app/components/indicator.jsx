import React from "react";

export default function Indicator(props) {
  return (
    <div className={`Indicator ${props.type}`}>
      <div></div>
      <div>
        {props.type == "Wait"
          ? "Загрузка"
          : props.type == "Error"
          ? "Ошибка на стороне сервера"
          : props.type == "NothingFound"
          ? "Ничего не найдено"
          : ""}
      </div>
    </div>
  );
}
