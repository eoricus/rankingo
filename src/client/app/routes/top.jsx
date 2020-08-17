import React from "react";
import University from "../components/university.jsx";
import Indicator from "../components/indicator.jsx";

export default class Top extends React.Component {
  constructor() {
    super();
    this.state = {
      result: [],
      wait: false,
      error: false,
    };
  }

  componentDidMount() {
    let result = JSON.parse(localStorage.getItem("top"));

    // Если результат не записан
    if (result == null) {
      let xhr = new XMLHttpRequest();

      xhr.open("GET", "/api?type=top");
      this.setState({ wait: true });
      xhr.send();
      xhr.onreadystatechange = () => {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
          this.setState({ error: true });
        } else {
          this.setState({ result: JSON.parse(xhr.responseText) });
          localStorage.setItem("top", xhr.responseText);
        }
        this.setState({ wait: false });
      };
    } else {
      console.log("Результат получен из localStorage");
      this.setState({ result: result, wait: false });
    }
  }

  render() {
    let Output;
    // Ожидание
    if (this.state.wait) {
      Output = (
        <div>
          <div className="Indicator Wait"></div>
          Ничего не найдено
        </div>
      );
    }
    // Ошибка
    else if (this.state.error) {
      Output = (
        <div>
          <div className="Indicator Error"></div>
          Ничего не найдено
        </div>
      );
    }

    return (
      <div id="Output">
        <div id="SearchBar">
          {this.state.wait ? (
            <Indicator type="Wait" />
          ) : this.state.error ? (
            <Indicator type="Error" />
          ) : (
            <Indicator type="Success" />
          )}
        </div>

        {!(this.state.wait || this.state.error) ? (
          <div id="Items">
            {this.state.result.map((e, i) => {
              return (
                <University
                  i={i + 1}
                  title={e.title}
                  cityID={e.cityID}
                  graduates={e.graduates}
                  verifiedGraduates={e.verifiedGraduates}
                />
              );
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
