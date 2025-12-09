import React, { useState } from "react";
import DocList from "./DocList";
import DocViewer from "./DocViewer";
import QueryBox from "./QueryBox";
import ConnectUsers from "./ConnectUsers";

export default function Dashboard({ user }) {
  const [docs] = useState([
    { docId: "doc1", title: "Sample Doc 1", snippet: "Lorem ipsum..." },
    { docId: "doc2", title: "Sample Doc 2", snippet: "Dolor sit amet..." }
  ]);

  const [selected, setSelected] = useState(null);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>Your Documents</h3>
        <DocList docs={docs} onOpen={docId => setSelected(docId)} />
      </aside>

      <section className="mainpanel">
        <DocViewer docId={selected} />

        <div className="tools">
          <QueryBox docId={selected} userId={user.userId} />
          <ConnectUsers userId={user.userId} />
        </div>
      </section>
    </div>
  );
}
