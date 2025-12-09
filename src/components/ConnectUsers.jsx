import React, { useState } from "react";

export default function ConnectUsers() {
  const [users] = useState([
    { userId: "u2", name: "Harry" },
    { userId: "u3", name: "Hermione" }
  ]);

  return (
    <div className="card connect-box">
      <h3>Connect to Users</h3>

      {users.map(u => (
        <div key={u.userId} className="connect-item">
          {u.name}
          <button className="btn small">Connect</button>
        </div>
      ))}
    </div>
  );
}
