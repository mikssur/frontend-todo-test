import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { TodoProvider } from "./contexts/TodoContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <TodoProvider>
        <App />
      </TodoProvider>
    </AuthProvider>
  </React.StrictMode>
);
