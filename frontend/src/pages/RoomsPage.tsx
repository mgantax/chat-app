import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RoomsPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error("Failed to fetch rooms", error);
      }
    };
    fetchRooms();
  }, [token]);

  const onCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roomName = formData.get("roomName") as string;
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: roomName }),
      });
      const data = await response.json();
      setRooms((prev) => [...prev, data]);
      e.currentTarget.reset();
    } catch (error) {
      console.error("Failed to create room", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: 0 }}>Your Chat Rooms</h1>
        <button onClick={handleLogout}
          style={{ padding: "8px 16px", background: "#dc3545", color: "white",
            border: "none", borderRadius: "20px", cursor: "pointer" }}>
          Log Out
        </button>
      </div>

      <form onSubmit={onCreateRoom}
        style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input type="text" name="roomName" placeholder="New room name" required
          style={{ flex: 1, padding: "8px 12px", borderRadius: "20px",
            border: "1px solid #ddd", outline: "none" }} />
        <button type="submit"
          style={{ padding: "8px 16px", background: "#28a745", color: "white",
            border: "none", borderRadius: "20px", cursor: "pointer" }}>
          Create
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {rooms.map((room) => (
          <li key={room.id}
            onClick={() => navigate(`/chat/${room.id}`)}
            style={{ padding: "16px", border: "1px solid #eee",
              borderRadius: "8px", marginBottom: "8px", cursor: "pointer",
              display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "20px", marginRight: "12px" }}>💬</span>
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
}