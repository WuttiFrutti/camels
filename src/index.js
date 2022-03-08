/* eslint-disable no-extend-native */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./config/routes.js";
import { ToastsElement } from "./toasts"

import 'bootstrap/dist/css/bootstrap.min.css';
import "./scss/main.scss"
import { ModalElement } from './modals.js';

Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

ReactDOM.render(
  <>
    <Router>
      <Routes />
      <ToastsElement />
      <ModalElement />
    </Router>
  </>,
  document.getElementById('root')
);

