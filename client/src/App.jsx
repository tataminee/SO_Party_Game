import { Routes, Route, Navigate } from "react-router-dom";
import Lobby from "./pages/Lobby";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/lobby/X7Q4" replace />} />
      <Route path="/lobby/:code" element={<Lobby />} />
    </Routes>
  );
}