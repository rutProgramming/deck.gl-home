import React from "react";
import ReactDOM from "react-dom/client";
import raw from "./data/sample_planes_with_heading.json";
import { normalizePlanes } from "./domain/plane.normalize";
import { planesStore } from "./store/planes.store";
import { App } from "./App";

planesStore.loadPlanes(normalizePlanes(raw));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);