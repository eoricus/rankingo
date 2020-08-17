import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  Link,
} from "react-router-dom";

import Top from "./routes/top.jsx";
import Cities from "./routes/cities.jsx";
import Universities from "./routes/universities.jsx";

function MenuLink(props) {
  return (
    <div className="MenuLink">
      <Link to={props.to}>
        <h2>{props.title}</h2>
      </Link>
    </div>
  );
}

export default function Main() {
  return (
    <main>
      <Router>
        <nav id="Menu">
          <MenuLink to="universities" title="Университеты" />
          <MenuLink to="cities" title="Города" />
          <MenuLink to="top" title="Топ" />
        </nav>

        <Switch>
          <Route path="/universities" component={Universities} />
          <Route path="/cities" component={Cities} />
          <Route path="/top" component={Top} />
        </Switch>
      </Router>
    </main>
  );
}
