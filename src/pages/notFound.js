import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class notFound extends Component {
  render() {
    return (
      <div>
        <h1>Сторінку не знайдено</h1>
        <h3>
          <Link to={"/"}>Повернутись на головну</Link>
        </h3>
      </div>
    );
  }
}
