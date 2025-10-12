import React, { Component } from "react";
import { ThemeContext } from "./context/ThemeContexts";

class Title extends Component {
  static contextType = ThemeContext;

  render() {
    const { theme } = this.context;
    const { name, title } = this.props;

    return (
      <div className="page-title">
        <h1 className={`title ${theme ? "title-light" : "title-dark"}`}>
          {name} <span className="title-accent">{title}</span>
        </h1>
        <div className="title-underline"></div>
      </div>
    );
  }
}

export default Title;
