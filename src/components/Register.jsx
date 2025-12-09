import React, { useState } from "react";

export default function Register({ setPage, onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function submit(e) {
    e.preventDefault();
    onRegister({ userId: "user_123", name });
  }

  return (
    <div className="card auth-card">
      <h2>Register</h2>

      <form onSubmit={submit}>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} />

        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" />

        <button className="btn">Create Account</button>
      </form>

      <p className="muted">
        Already have an account?{" "}
        <span className="link" onClick={() => setPage("login")}>
          Login
        </span>
      </p>
    </div>
  );
}
