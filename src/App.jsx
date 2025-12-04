import { BrowserRouter } from "react-router-dom";
import Router from "./router/router";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}
