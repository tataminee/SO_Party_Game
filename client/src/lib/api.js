const BASE = import.meta.env.VITE_API_URL;

async function request(path, options) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.code || "UNKNOWN_ERROR");
  return json.data;
}

export const createGuest = (name, avatarColor) =>
  request("/auth/guest", { method: "POST", body: JSON.stringify({ name, avatarColor }) });

export const listRooms = () => request("/rooms");

export const createRoom = (name, isPrivate, userId) =>
  request("/rooms", { method: "POST", body: JSON.stringify({ name, isPrivate, userId }) });

export const checkRoom = (code) => request(`/rooms/${code}`);

export const ERROR_TEXT = {
  ROOM_NOT_FOUND: "Room tidak ditemukan",
  ROOM_FULL: "Room sudah penuh",
  ROOM_PRIVATE: "Room ini privat",
};