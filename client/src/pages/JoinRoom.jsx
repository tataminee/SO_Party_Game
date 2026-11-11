import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkRoom, listRooms, ERROR_TEXT } from "../lib/api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const MOCK_ROOMS = [
  { roomId: "1", code: "X7Q4", name: "Arena Kapur", currentPlayers: 2, maxPlayers: 4 },
  { roomId: "2", code: "AB12", name: "Ahayy", currentPlayers: 3, maxPlayers: 4 },
];

export default function JoinRoom() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");

  const refresh = async () => {
    try {
      setRooms(USE_MOCK ? MOCK_ROOMS : await listRooms());
    } catch {
      setError("Gagal memuat daftar room");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const join = async (c) => {
    setError("");
    try {
      if (!USE_MOCK) await checkRoom(c);
      navigate(`/lobby/${c}`);
    } catch (e) {
      setError(ERROR_TEXT[e.message] || "Gagal bergabung");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-brand-blue-top to-brand-blue-bottom p-6">
      <div className="mx-auto flex max-w-md flex-col gap-4 text-white">
        <button onClick={() => navigate("/")} aria-label="Kembali"
          className="h-11 w-11 rounded-full border-2 border-white bg-blue-500 text-xl">‹</button>
        <h1 className="text-2xl font-extrabold">GABUNG ROOM</h1>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          placeholder="Kode room"
          className="rounded-xl border-2 border-brand-dark bg-white p-3 text-center text-2xl font-extrabold tracking-widest text-brand-dark"
        />
        <button
          onClick={() => join(code)}
          disabled={!code}
          className="rounded-2xl border-2 border-brand-dark bg-brand-yellow py-3 text-xl font-extrabold text-brand-dark disabled:opacity-50"
        >
          GABUNG
        </button>
        {error && <p className="font-bold text-brand-yellow">{error}</p>}

        <p className="font-bold">Atau pilih room publik</p>
        {rooms.map((r) => (
          <div key={r.roomId} className="flex items-center justify-between rounded-xl bg-white p-3 text-brand-dark">
            <div>
              <p className="font-extrabold">{r.name}</p>
              <p className="text-xs">{r.currentPlayers}/{r.maxPlayers} pemain</p>
            </div>
            <button onClick={() => join(r.code)} className="rounded-lg bg-brand-yellow px-4 py-1 font-bold">
              GABUNG
            </button>
          </div>
        ))}
        <button onClick={refresh} className="rounded-xl bg-sky-400 py-2 font-bold">Refresh</button>
      </div>
    </div>
  );
}