import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../lib/api";
import { getUser } from "../lib/session";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export default function CreateRoom() {
  const navigate = useNavigate();
  const user = getUser();
  const [name, setName] = useState(`Room ${user.name}`);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!name.trim()) return setError("Nama room wajib diisi");
    try {
      const data = USE_MOCK
        ? { code: "X7Q4" }
        : await createRoom(name.trim(), isPrivate, user.userId);
      navigate(`/lobby/${data.code}`);
    } catch {
      setError("Gagal membuat room");
    }
  };

  const pill = (active) =>
    `rounded-xl border-2 py-3 font-bold ${
      active ? "border-brand-dark bg-brand-yellow text-brand-dark" : "border-white/40 text-white"
    }`;

  return (
    <div className="min-h-screen bg-linear-to-b from-brand-blue-top to-brand-blue-bottom p-6">
      <div className="mx-auto flex max-w-md flex-col gap-4 text-white">
        <button onClick={() => navigate("/")} aria-label="Kembali"
          className="h-11 w-11 rounded-full border-2 border-white bg-blue-500 text-xl">‹</button>
        <h1 className="text-2xl font-extrabold">BUAT ROOM</h1>

        <label className="text-sm font-bold">Nama room</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          className="rounded-xl border-2 border-brand-dark bg-white p-3 text-brand-dark"
        />

        <label className="text-sm font-bold">Privasi</label>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setIsPrivate(false)} aria-pressed={!isPrivate} className={pill(!isPrivate)}>PUBLIK</button>
          <button onClick={() => setIsPrivate(true)} aria-pressed={isPrivate} className={pill(isPrivate)}>PRIVAT</button>
        </div>

        {error && <p className="font-bold text-brand-yellow">{error}</p>}
        <button
          onClick={submit}
          className="rounded-2xl border-2 border-brand-dark bg-brand-yellow py-4 text-xl font-extrabold text-brand-dark"
        >
          BUAT ROOM
        </button>
      </div>
    </div>
  );
}