import React from "react";
import { Router } from "@reach/router";
import { Link } from "gatsby";

const A = () => {
  return (
    <>
      <h2>route A</h2>
      <Link to="/app">Go To app Home</Link>
    </>
  );
};
const B = () => {
  return (
    <>
      <h2>route b</h2>
      <Link to="/app">Go To app Home</Link>
    </>
  );
};

const App = () => {
  return (
    <>
      <h1>Welcome to my client only routes</h1>
      <Link to="/app/a">Go To A</Link>
      <Link to="/app/b">Go To B</Link>
      <Link to="/">Go To Home</Link>

      <Router basepath="/app">
        <A path="/a" />
        <B path="/b" />
      </Router>
    </>
  );
};
export default App;
