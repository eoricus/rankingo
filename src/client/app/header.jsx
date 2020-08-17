import React from "react";

export default class Header extends React.Component {
  constructor() {
    super();
    let hidden = localStorage.getItem("hidden");
    this.state = {
      hidden: hidden ? true : false,
    };
  }

  componentDidMount() {
    if (!this.state.hidden) {
      const Hide = document.getElementById("HideHeader");

      Hide.onclick = () => {
        this.setState({ hidden: true });
        localStorage.setItem("hidden", "true");
      };
    }
  }

  render() {
    if (!this.state.hidden) {
      return (
        <header>
          <span>
            <b>Rankingo</b> — это рейтинг российских университетов по количеству
            верифицированных выпускников в ВК. Удивительно, но я не смог найти
            похожих рейтингов в интернете.
            <br />
            <b> Все данные собраны из открытых участников</b>
            <br />
            Автор:&#160;
            <a href="https://vk.com/erikmikoyan2003">ВК</a>
            ,&#160;
            <a href="https://github.com/erikmikoyan2003">ГХ</a>
          </span>
          <button id="HideHeader">&#10006;</button>
        </header>
      );
    } else return "";
  }
}
