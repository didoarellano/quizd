import { createRoot } from "react-dom/client";
import { App } from "./app/index.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
  </>
);
