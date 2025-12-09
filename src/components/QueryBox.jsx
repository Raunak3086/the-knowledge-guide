import React, { useState } from "react";

export default function QueryBox({ docId, userId }) {
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");

  function ask(e) {
    e.preventDefault();
    setAns(`Answer for "${q}" (demo only)`);
  }

  return (
    <div className="card query-box">
      <h3>Ask Query</h3>

      <form onSubmit={ask}>
        <textarea value={q} onChange={e => setQ(e.target.value)} placeholder="Ask..." />
        <button className="btn">Ask</button>
      </form>

      {ans && <div className="answer">{ans}</div>}
    </div>
  );
}
