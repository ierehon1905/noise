import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { I18nProvider } from "./langs";
import { AppStateProvider } from "./state";

ReactDOM.render(
  <React.StrictMode>
    <I18nProvider>
      <AppStateProvider>
        <App />
      </AppStateProvider>
    </I18nProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
