export default function DocViewer({ docId }) {
    if (!docId) return <div className="viewer empty">Select a document</div>;
  
    return (
      <div className="viewer">
        <h2>Document: {docId}</h2>
        <p>This is where the document content will appear.</p>
      </div>
    );
  }
  