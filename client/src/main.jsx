import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import RouterWrapper from "./RouterWrapper.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterWrapper />
  </AuthProvider>
);
