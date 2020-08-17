import React from "react";
import cities from "../../cities.json";

export default function University(props) {
  return (
    <div className="University">
      <div className="Number">
        <h1>#{props.i}</h1>
      </div>

      <div className="Info">
        <h3>{props.title}</h3>
        <span>{cities[props.cityID]}, </span>
        <span>
          выпускников — <b>{props.graduates}</b>,{" "}
        </span>
        <span>
          верифицированных —
          <b className="Verified">&#160;{props.verifiedGraduates}&#160;</b>
        </span>
      </div>
    </div>
  );
}
