import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/session";

export default function Home() {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <div className="min-h-screen bg-linear-to-b from-brand-blue-top to-brand-blue-bottom p-6">
      <div className="mx-auto flex max-w-md flex-col gap-4 pt-24">
        <p className="text-center text-lg font-bold text-white">Halo, {user?.name}!</p>
        <button
          onClick={() => navigate("/create")}
          className="rounded-2xl border-2 border-brand-dark bg-brand-yellow py-4 text-xl font-extrabold text-brand-dark"
        >
          BUAT ROOM
        </button>
        <button
          onClick={() => navigate("/join")}
          className="rounded-2xl border-2 border-brand-dark bg-sky-400 py-4 text-xl font-extrabold text-white"
        >
          GABUNG ROOM
        </button>
      </div>
    </div>
  );
}