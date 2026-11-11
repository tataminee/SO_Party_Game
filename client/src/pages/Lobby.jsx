import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlayerCard from "../components/PlayerCard";
import InviteSlot from "../components/InviteSlot";

// DATA PURA-PURA. Nanti diganti dengan data dari backend.
const dummyRoom = {
  code: "X7Q4",
  hostId: "p1",
  maxPlayers: 4,
  games: ["Stick Brawl", "Jellyfish Deadlock", "Game 3"],
  players: [
    { id: "p1", name: "Kamu", color: "pink", ready: true },
    { id: "p2", name: "Kawan_02", color: "blue", ready: true },
    { id: "p3", name: "Kawan_03", color: "orange", ready: false },
  ],
};

export default function Lobby() {
  const navigate = useNavigate();
  const [room, setRoom] = useState(dummyRoom);
  const myId = "p1"; // ganti ke "p2" untuk melihat tampilan tamu
  const isHost = room.hostId === myId;

  const emptySlots = room.maxPlayers - room.players.length;
  const allReady = room.players.every((p) => p.ready);
  const me = room.players.find((p) => p.id === myId);

  const toggleReady = () =>
    setRoom({ ...room, players: room.players.map((p) => (p.id === myId ? { ...p, ready: !p.ready } : p)) });

  return (
    <div className="min-h-screen bg-linear-to-b from-brand-blue-top to-brand-blue-bottom">
      <div className="mx-auto max-w-md p-4">
        <header className="mb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} aria-label="Kembali"
            className="h-11 w-11 rounded-full border-2 border-white bg-blue-500 text-xl text-white">‹</button>
          <h1 className="text-xl font-extrabold text-white">RUANG TUNGGU</h1>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {room.players.map((p) => (
            <PlayerCard key={p.id} player={p} isHost={p.id === room.hostId} isMe={p.id === myId}
              canKick={isHost && p.id !== myId} onKick={() => alert("kick " + p.name)} />
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => <InviteSlot key={i} />)}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-brand-dark bg-white p-3">
          <div className="flex gap-1">
            {["bg-orange-400", "bg-pink-500", "bg-indigo-300"].map((c, i) => (
              <span key={i} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-dark text-sm font-bold text-white ${c}`}>{i + 1}</span>
            ))}
          </div>
          <div>
            <p className="font-extrabold text-brand-dark">3 Game Berurutan</p>
            <p className="text-[11px] font-bold text-slate-500">{room.games.join(" · ")}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border-2 border-brand-dark bg-brand-dark p-3 text-white">
          <span className="text-xs font-bold">Kode room</span>
          <span className="text-2xl font-extrabold tracking-widest text-brand-yellow">{room.code}</span>
        </div>

        {isHost ? (
          <div className="mt-3 flex flex-col gap-3">
            <button onClick={() => navigator.clipboard.writeText(room.code)}
              className="rounded-2xl border-2 border-brand-dark bg-sky-400 py-3 font-bold text-white">Salin kode</button>
            <button disabled={!allReady}
              className={`rounded-2xl border-2 border-brand-dark py-4 text-xl font-extrabold ${allReady ? "bg-brand-yellow text-brand-dark" : "bg-slate-300 text-slate-500"}`}>MULAI</button>
            {!allReady && <p className="text-center text-xs font-bold text-white">Menunggu semua pemain siap</p>}
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-center text-sm font-bold text-white">Menunggu host memulai permainan...</p>
            <button onClick={toggleReady}
              className="rounded-2xl border-2 border-brand-dark bg-brand-green py-4 text-xl font-extrabold text-brand-dark">
              {me?.ready ? "BATAL SIAP" : "SIAP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
