import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlayerCard from "../components/PlayerCard";
import InviteSlot from "../components/InviteSlot";
import Toast from "../components/Toast";
import { getSocket } from "../lib/socket";
import { mockState } from "../mock/roomState";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const GAMES = ["Stick Brawl", "Jellyfish Deadlock", "Game 3"];

export default function Lobby() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(USE_MOCK ? mockState : null);
  const [toast, setToast] = useState(null);
  const [confirmDisband, setConfirmDisband] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (USE_MOCK) return;
    const socket = getSocket();
    socket.emit("room:join", { code });

    const handlers = {
      "room:state": setState,
      "room:player_joined": (p) =>
        setState((s) => ({ ...s, players: [...s.players, p] })),
      "room:player_left": ({ userId }) =>
        setState((s) => ({ ...s, players: s.players.filter((p) => p.userId !== userId) })),
      "room:player_ready": ({ userId, isReady }) =>
        setState((s) => ({
          ...s,
          players: s.players.map((p) => (p.userId === userId ? { ...p, isReady } : p)),
        })),
      "room:kicked": () => navigate("/"),
      "room:disbanded": () => navigate("/"),
      "tournament:starting": ({ countdown }) =>
        showToast("info", `Game dimulai dalam ${countdown}...`),
      toast: ({ type, message }) => showToast(type, message),
    };

    Object.entries(handlers).forEach(([ev, fn]) => socket.on(ev, fn));
    return () => Object.entries(handlers).forEach(([ev, fn]) => socket.off(ev, fn));
  }, [code, navigate]);

  if (!state) {
    return (
      <div className="min-h-screen bg-brand-blue-top p-6 text-white">
        <p>Memuat lobi...</p>
        <button onClick={() => navigate("/")} className="mt-4 rounded-xl bg-white px-4 py-2 font-bold text-brand-dark">
          Kembali
        </button>
      </div>
    );
  }

  const { room, players, me: meInfo } = state;
  const isHost = meInfo.isHost;
  const me = players.find((p) => p.userId === meInfo.userId);
  const emptySlots = room.maxPlayers - players.length;
  const canStart = players.every((p) => p.isReady) && players.length > 1;

  const emit = (event, data) => {
    if (!USE_MOCK) getSocket().emit(event, data);
  };

  const toggleReady = () => {
    const isReady = !me.isReady;
    emit("room:set_ready", { code, isReady });
    setState((s) => ({
      ...s,
      players: s.players.map((p) => (p.userId === me.userId ? { ...p, isReady } : p)),
    }));
  };

  const kick = (target) => {
    emit("room:kick", { code, targetUserId: target.userId });
    setState((s) => ({ ...s, players: s.players.filter((p) => p.userId !== target.userId) }));
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(room.code);
    showToast("success", "Kode room disalin");
  };

  const start = () =>
    USE_MOCK ? showToast("info", "Mode mock: game dimulai") : emit("tournament:start", { code });

  const leave = () => {
    emit("room:leave", { code });
    navigate("/");
  };

  const onBack = () => (isHost ? setConfirmDisband(true) : leave());

  return (
    <div className="min-h-screen bg-linear-to-b from-brand-blue-top to-brand-blue-bottom">
      <Toast toast={toast} />
      <div className="mx-auto max-w-md p-4">
        <header className="mb-4 flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Kembali"
            className="h-11 w-11 rounded-full border-2 border-white bg-blue-500 text-xl text-white"
          >
            ‹
          </button>
          <h1 className="text-xl font-extrabold text-white">RUANG TUNGGU</h1>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {players.map((p) => (
            <PlayerCard
              key={p.userId}
              player={p}
              isMe={p.userId === meInfo.userId}
              canKick={isHost && p.userId !== meInfo.userId}
              onKick={() => kick(p)}
            />
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <InviteSlot key={i} />
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-brand-dark bg-white p-3">
          <div className="flex gap-1">
            {["bg-orange-400", "bg-pink-500", "bg-indigo-300"].map((c, i) => (
              <span
                key={i}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-dark text-sm font-bold text-white ${c}`}
              >
                {i + 1}
              </span>
            ))}
          </div>
          <div>
            <p className="font-extrabold text-brand-dark">3 Game Berurutan</p>
            <p className="text-[11px] font-bold text-slate-500">{GAMES.join(" · ")}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border-2 border-brand-dark bg-brand-dark p-3 text-white">
          <span className="text-xs font-bold">Kode room</span>
          <span className="text-2xl font-extrabold tracking-widest text-brand-yellow">{room.code}</span>
        </div>

        {isHost ? (
          <div className="mt-3 flex flex-col gap-3">
            <button onClick={copyCode} className="rounded-2xl border-2 border-brand-dark bg-sky-400 py-3 font-bold text-white">
              Salin kode
            </button>
            <button
              onClick={start}
              disabled={!canStart}
              className={`rounded-2xl border-2 border-brand-dark py-4 text-xl font-extrabold ${
                canStart ? "bg-brand-yellow text-brand-dark" : "bg-slate-300 text-slate-500"
              }`}
            >
              MULAI
            </button>
            {!canStart && <p className="text-center text-xs font-bold text-white">Menunggu semua pemain siap</p>}
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <p className="text-center text-sm font-bold text-white">Menunggu host memulai permainan...</p>
            <button
              onClick={toggleReady}
              className="rounded-2xl border-2 border-brand-dark bg-brand-green py-4 text-xl font-extrabold text-brand-dark"
            >
              {me?.isReady ? "BATAL SIAP" : "SIAP"}
            </button>
          </div>
        )}
      </div>

      {confirmDisband && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-xs rounded-2xl border-2 border-brand-dark bg-white p-5 text-center">
            <p className="text-lg font-extrabold text-brand-dark">Buburkan room?</p>
            <p className="mt-1 text-sm text-slate-600">Semua pemain akan dikeluarkan.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => setConfirmDisband(false)} className="rounded-xl bg-slate-200 py-2 font-bold">
                Batal
              </button>
              <button onClick={leave} className="rounded-xl bg-brand-red py-2 font-bold text-white">
                Buburkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}