import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initFirebase, initFirebaseAnalytics } from "./lib/firebase";
import "./index.css";
import App from "./App.tsx";

initFirebase();
void initFirebaseAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
