import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGuest } from "../lib/api";
import { saveUser } from "../lib/session";

const COLORS = ["pink", "blue", "orange", "yellow"];
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export default function Start() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [color, setColor] = useState("pink");
  const [error, setError] = useState("");

  const submit = async () => {
    if (!name.trim()) return setError("Nama wajib diisi");
    try {
      const user = USE_MOCK
        ? { userId: crypto.randomUUID(), name: name.trim(), avatarColor: color }
        : await createGuest(name.trim(), color);
      saveUser(user);
      navigate("/");
    } catch {
      setError("Gagal terhubung ke server");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-brand-blue-top to-brand-blue-bottom p-6">
      <div className="mx-auto flex max-w-md flex-col gap-4 pt-16 text-white">
        <h1 className="text-2xl font-extrabold">Siapa namamu?</h1>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={12}
          placeholder="Nama (maks 12 huruf)"
          className="rounded-xl border-2 border-brand-dark bg-white p-3 text-brand-dark"
        />
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-pressed={color === c}
              className={`rounded-xl border-2 py-2 text-sm font-bold capitalize ${
                color === c ? "border-brand-yellow bg-white/30" : "border-white/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {error && <p className="font-bold text-brand-yellow">{error}</p>}
        <button
          onClick={submit}
          className="rounded-2xl border-2 border-brand-dark bg-brand-yellow py-4 text-xl font-extrabold text-brand-dark"
        >
          MASUK
        </button>
      </div>
    </div>
  );
}