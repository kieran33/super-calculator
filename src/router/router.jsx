import { Routes, Route } from "react-router-dom";
import Home from "../views/home";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}
