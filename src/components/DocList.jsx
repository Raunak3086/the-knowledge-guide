export default function DocList({ docs, onOpen }) {
    return (
      <ul className="doc-list">
        {docs.map(d => (
          <li key={d.docId} className="doc-item" onClick={() => onOpen(d.docId)}>
            <strong>{d.title}</strong>
            <p className="muted">{d.snippet}</p>
          </li>
        ))}
      </ul>
    );
  }
  