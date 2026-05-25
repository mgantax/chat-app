import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Room {
  id: string;
  name: string;
  createdBy: string;
}

export default function RoomsPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState<"my" | "discover">("my");

  const fetchRooms = async () => {
    try {
      const [myRes, allRes] = await Promise.all([
        fetch("/api/rooms", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/rooms/all", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const myData = await myRes.json();
      const allData = await allRes.json();
      setMyRooms(myData);
      setAllRooms(allData);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [token]);

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("roomName") as string;
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      setMyRooms((prev) => [...prev, data]);
      e.currentTarget.reset();
    } catch (error) {
      console.error("Failed to create room", error);
    }
  };

  const handleJoin = async (roomId: string) => {
    try {
      await fetch(`/api/rooms/${roomId}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchRooms();
      navigate(`/chat/${roomId}`);
    } catch (error) {
      console.error("Failed to join room", error);
    }
  };

  const myRoomIds = new Set(myRooms.map((r) => r.id));
  const discoverRooms = allRooms.filter((r) => !myRoomIds.has(r.id));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: 0 }}>Chat Rooms</h1>
        <button onClick={handleLogout}
          style={{ padding: "8px 16px", background: "#dc3545", color: "white",
            border: "none", borderRadius: "20px", cursor: "pointer" }}>
          Log Out
        </button>
      </div>

      <form onSubmit={handleCreateRoom}
        style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input type="text" name="roomName" placeholder="New room name" required
          style={{ flex: 1, padding: "8px 12px", borderRadius: "8px",
            border: "1px solid #ddd", outline: "none" }} />
        <button type="submit"
          style={{ padding: "8px 16px", background: "#28a745", color: "white",
            border: "none", borderRadius: "8px", cursor: "pointer" }}>
          Create
        </button>
      </form>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button onClick={() => setActiveTab("my")}
          style={{ padding: "8px 16px", borderRadius: "8px", border: "none",
            cursor: "pointer",
            background: activeTab === "my" ? "#007bff" : "#f0f0f0",
            color: activeTab === "my" ? "white" : "black" }}>
          My Rooms ({myRooms.length})
        </button>
        <button onClick={() => setActiveTab("discover")}
          style={{ padding: "8px 16px", borderRadius: "8px", border: "none",
            cursor: "pointer",
            background: activeTab === "discover" ? "#007bff" : "#f0f0f0",
            color: activeTab === "discover" ? "white" : "black" }}>
          Discover ({discoverRooms.length})
        </button>
      </div>

      {activeTab === "my" && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {myRooms.length === 0 && (
            <p style={{ color: "#888" }}>No rooms yet — create one above.</p>
          )}
          {myRooms.map((room) => (
            <li key={room.id}
              onClick={() => navigate(`/chat/${room.id}`)}
              style={{ padding: "16px", border: "1px solid #eee",
                borderRadius: "8px", marginBottom: "8px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>💬</span>
              <div>
                <div style={{ fontWeight: 500 }}>{room.name}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  Created by {room.createdBy}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeTab === "discover" && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {discoverRooms.length === 0 && (
            <p style={{ color: "#888" }}>No new rooms to discover.</p>
          )}
          {discoverRooms.map((room) => (
            <li key={room.id}
              style={{ padding: "16px", border: "1px solid #eee",
                borderRadius: "8px", marginBottom: "8px",
                display: "flex", alignItems: "center",
                justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "20px" }}>🌐</span>
                <div>
                  <div style={{ fontWeight: 500 }}>{room.name}</div>
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    Created by {room.createdBy}
                  </div>
                </div>
              </div>
              <button onClick={() => handleJoin(room.id)}
                style={{ padding: "8px 16px", background: "#007bff",
                  color: "white", border: "none", borderRadius: "8px",
                  cursor: "pointer" }}>
                Join
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}