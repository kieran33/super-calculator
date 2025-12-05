import { Routes, Route } from "react-router-dom";
import Home from "../views/home";
import TierList from "../views/tierList";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chips" element={<TierList />} />
    </Routes>
  );
}
