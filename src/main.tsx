// Import Swedish locale from local copy
import "./locales/schedulerpro.locale.SvSE.js";

import { LocaleHelper } from "@bryntum/schedulerpro";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// Set Swedish as default locale
LocaleHelper.localeName = "SvSE";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
