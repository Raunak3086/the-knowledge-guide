import React, { useState } from "react";

export default function Login({ setPage, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();
    onLogin({ userId: "user_123", name: "Demo User" });
  }

  return (
    <div className="card auth-card">
      <h2>Login</h2>

      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

        <button className="btn">Login</button>
      </form>

      <p className="muted">
        Don't have an account?{" "}
        <span className="link" onClick={() => setPage("register")}>
          Register
        </span>
      </p>
    </div>
  );
}
