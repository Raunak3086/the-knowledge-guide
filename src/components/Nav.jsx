import React from "react";

export default function Nav({ user, setPage, setUser }) {
  return (
    <header className="nav">
      <div className="brand">Slytherin Chronicles</div>

      <nav>
        {!user ? (
          <>
            <span className="link" onClick={() => setPage("login")}>Login</span>
            <span className="link" onClick={() => setPage("register")}>Register</span>
          </>
        ) : (
          <>
            <span className="muted">{user.name}</span>
            <button className="btn ghost" onClick={() => { 
              setUser(null); 
              setPage("login"); 
            }}>
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
