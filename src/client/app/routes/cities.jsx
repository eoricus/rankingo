import React from "react";
import University from "../components/university.jsx";
import Indicator from "../components/indicator.jsx";

export default class Cities extends React.Component {
  constructor() {
    super();
    this.state = {
      universities: [],
      cities: [],
      wait: true,
      error: false,
    };
    this.cities;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `/api?type=cities`);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState != 4) return;

      if (xhr.status != 200) {
        this.setState({ error: true });
      } else {
        this.setState({ cities: JSON.parse(xhr.responseText) });
        this.cities = JSON.parse(xhr.responseText);
      }
      this.setState({ wait: false });
    };
  }

  componentDidMount() {
    const SearchField = document.getElementById("SearchField");
    const Form = document.forms.Options;

    SearchField.oninput = () => {
      this.setState({wait: true})
      this.setState({
        cities: this.cities.filter((value) => {
          return value.titleForSearch.startsWith(
            SearchField.value.toLowerCase()
          );
        }),
      });
      this.setState({wait: false})
    };

    Form.onchange = () => {
      let value = Form.cities.value;

      if (value) {
        let xhr = new XMLHttpRequest();

        this.setState({ wait: true });
        xhr.open("GET", `/api?type=universitiesByCityID&cityID=${value}`);
        xhr.send();
        xhr.onreadystatechange = () => {
          if (xhr.readyState != 4) return;

          if (xhr.status != 200) {
            this.setState({ error: true });
          } else {
            this.setState({ universities: JSON.parse(xhr.responseText) });
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
          <input type="text" id="SearchField" placeholder = "Введите название города"/>
          {this.state.wait ? (
            <Indicator type="Wait" />
          ) : this.state.error ? (
            <Indicator type="Error" />
          ) : !this.state.cities.length ? (
            <Indicator type="NothingFound" />
          ) : (
            <Indicator type="Success" />
          )}
          <form id="Options" name="Options">
            {this.state.cities.map((element) => {
              let id = `city${element.id}`;
              return (
                <div className="Option">
                  <input
                    id={id}
                    type="radio"
                    name="cities"
                    value={element.id}
                  />
                  <label htmlFor={id}>{element.title}</label>
                </div>
              );
            })}
          </form>
        </div>

        <div id="Items">
          {this.state.universities ? (
            this.state.universities.map((e, i) => {
              return (
                <University
                  i={i + 1}
                  title={e.title}
                  cityID={e.cityID}
                  graduates={e.graduates}
                  verifiedGraduates={e.verifiedGraduates}
                />
              );
            })
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}