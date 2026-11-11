import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JoinRoom from "./pages/JoinRoom";
import CreateRoom from "./pages/CreateRoom";
import Lobby from "./pages/Lobby";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/join" element={<JoinRoom />} />
      <Route path="/create" element={<CreateRoom />} />
      <Route path="/lobby/:code" element={<Lobby />} />
    </Routes>
  );
}