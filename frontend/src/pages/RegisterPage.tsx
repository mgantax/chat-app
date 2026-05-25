import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, username, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        login(data.token, data.username);
        navigate("/");
      } else {
        const err = await response.json();
        setError(err.message || "Registration failed");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto", padding: "0 16px" }}>
      <h2>Create Account</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input placeholder="First name" value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={inputStyle} />
        <input placeholder="Last name" value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={inputStyle} />
        <input placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle} />
        <input placeholder="Email" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle} />
        <input placeholder="Password" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle} />
        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
        <button onClick={handleSubmit} style={buttonStyle}>
          Register
        </button>
        <p style={{ textAlign: "center", color: "#666" }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}
            style={{ color: "#007bff", cursor: "pointer" }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "14px",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
};