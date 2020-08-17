import React from "react";
import University from "../components/university.jsx";
import Indicator from "../components/indicator.jsx";

export default class Universities extends React.Component {
  constructor() {
    super();
    this.state = {
      result: [],
      wait: false,
      error: false,
    };
  }

  componentDidMount() {
    const SearchField = document.getElementById("SearchField");
    let value;

    SearchField.onkeyup = () => {
      if (value != SearchField.value.toLowerCase() && SearchField.value) {
        value = SearchField.value.toLowerCase();
        let xhr = new XMLHttpRequest();

        xhr.open("GET", `/api?type=universitiesByTitle&title=${value}`);
        this.setState({ wait: true });
        xhr.send();
        xhr.onreadystatechange = () => {
          if (xhr.readyState != 4) return;

          if (xhr.status != 200) {
            this.setState({ error: true });
          } else {
            this.setState({ result: JSON.parse(xhr.responseText) });
          }
          this.setState({ wait: false });
        };
      }
    };
  }

  render() {
    return (
      <div id="Output">
        <div id="SearchBar">
          <input type="text" id="SearchField" placeholder = "Введите название университета" checked/>
          {this.state.wait ? (
            <Indicator type="Wait" />
          ) : this.state.error ? (
            <Indicator type="Error" />
          ) : !this.state.result.length ? (
            <Indicator type="NothingFound" />
          ) : (
            <Indicator type="Success" />
          )}
        </div>
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
      </div>
    );
  }
}
