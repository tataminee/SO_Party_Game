// Stickman sementara. Nanti ganti dengan SVG dari Figma.
function Stickman({ className }) {
  return (
    <svg viewBox="0 0 64 96" className={`h-24 ${className}`} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
      <circle cx="32" cy="16" r="12" fill="currentColor" />
      <path d="M32 28V62M32 40L12 54M32 40L52 54M32 62L16 90M32 62L48 90" />
    </svg>
  );
}

const colorClass = { pink: "text-pink-500", blue: "text-sky-400", orange: "text-orange-400" };

export default function PlayerCard({ player, isHost, isMe, canKick, onKick }) {
  return (
    <div className="relative flex flex-col items-center rounded-2xl border-2 border-white/40 bg-white/15 px-2 pb-3 pt-8">
      {isHost && (
        <span className="absolute left-2 top-2 rounded-md bg-brand-yellow px-2 text-[10px] font-extrabold text-brand-dark">
          👑 HOST
        </span>
      )}
      {isMe && (
        <span className="absolute right-2 top-2 rounded-md bg-white px-2 text-[10px] font-extrabold text-brand-dark">
          KAMU
        </span>
      )}
      {canKick && (
        <button
          onClick={onKick}
          aria-label={`Keluarkan ${player.name}`}
          className="absolute right-2 top-2 h-7 w-7 rounded-full border-2 border-white bg-brand-red text-sm font-bold text-white"
        >
          ✕
        </button>
      )}

      <Stickman className={colorClass[player.color]} />

      <p className="mt-2 rounded-full bg-brand-dark px-4 py-0.5 text-xs font-bold text-white">{player.name}</p>
      <p
        className={`mt-2 rounded-full border-2 border-brand-dark px-4 py-0.5 text-[11px] font-extrabold ${
          player.ready ? "bg-brand-yellow text-brand-dark" : "bg-slate-200 text-slate-500"
        }`}
      >
        {player.ready ? "SIAP" : "MENUNGGU"}
      </p>
    </div>
  );
}
