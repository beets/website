/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Entry point for Ranking pages
 */

import React from "react";
import ReactDOM from "react-dom";
import { Page } from "./ranking_page";

window.onload = () => {
  const withinPlace = document.getElementById("within-place-dcid").dataset.pwp;
  const placeType = document.getElementById("place-type").dataset.pt;
  const placeName = document.getElementById("place-name").dataset.pn;
  const statVar = document.getElementById("stat-var").dataset.sv;
  const isPerCapita = JSON.parse(
    document.getElementById("per-capita").dataset.pc.toLowerCase()
  );
  const urlParams = new URLSearchParams(window.location.search);
  const unit = urlParams.get("unit");
  let scaling = Number(urlParams.get("scaling"));
  scaling = isNaN(scaling) || scaling == 0 ? 1 : scaling;
  ReactDOM.render(
    React.createElement(Page, {
      placeName,
      placeType,
      withinPlace,
      statVar,
      isPerCapita,
      unit,
      scaling,
    }),
    document.getElementById("main-pane")
  );
};
