export const mockState = {
  room: { roomId: "r1", code: "X7Q4", name: "Room PLAYER_01", status: "waiting", maxPlayers: 4 },
  players: [
    { userId: "u1", name: "Kamu", avatarColor: "pink", isHost: true, isReady: true },
    { userId: "u2", name: "Kawan_02", avatarColor: "blue", isHost: false, isReady: true },
    { userId: "u3", name: "Kawan_03", avatarColor: "orange", isHost: false, isReady: false },
  ],
  me: { userId: "u1", isHost: true },
};