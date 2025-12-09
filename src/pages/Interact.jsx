import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import DocumentSideMenu from '../components/DocumentSideMenu';
import DocumentUploadModal from '../components/DocumentUploadModal';
import UploadForm from '../components/UploadForm';
import SkeletonLoader from '../components/SkeletonLoader';
import './Interact.css';
import axios from 'axios';

function Interact() {
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [docs, setDocs] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [docsError, setDocsError] = useState(null);
  const [docId, setDocId] = useState(null);
  const [docName, setDocName] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [summary, setSummary] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoadingSummarize, setIsLoadingSummarize] = useState(false);
  const [isLoadingQuery, setIsLoadingQuery] = useState(false);
  const [isLoadingDocumentContent, setIsLoadingDocumentContent] = useState(false);
  const [documentContentError, setDocumentContentError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    }
  }, [location.state]);

  useEffect(() => {
    if (userId) {
      setIsLoadingDocs(true);
      axios.get(`http://localhost:5000/api/docs/${userId}`)
        .then(response => {
          setDocs(response.data);
          setDocsError(null);
        })
        .catch(error => {
          console.error('Failed to fetch docs', error);
          setDocsError('Failed to fetch documents.');
        })
        .finally(() => {
          setIsLoadingDocs(false);
        });
    }
  }, [userId]);

  const fetchDocumentContent = useCallback(async (id, name) => {
    setIsLoadingDocumentContent(true);
    setDocumentContent('');
    setDocumentContentError(null);
    setSummary('');
    setAnswer('');
    try {
      const response = await axios.get(`http://localhost:5000/api/file/${id}`);
      setDocumentContent(response.data.text);
    } catch (error)  {
      setDocumentContentError(`Failed to load content for "${name}". Please try again.`);
    } finally {
      setIsLoadingDocumentContent(false);
    }
  }, []);

  const handleDocumentSelect = useCallback((doc) => {
    if (docsError || !doc) return;
    setDocId(doc.id);
    setDocName(doc.name);
    fetchDocumentContent(doc.id, doc.name);
  }, [docsError, fetchDocumentContent]);

  const handleDeleteDocument = (idToDelete) => {
    const updatedDocs = docs.filter((doc) => doc.id !== idToDelete);
    setDocs(updatedDocs);
    if (docId === idToDelete) {
      if (updatedDocs.length > 0) {
        handleDocumentSelect(updatedDocs[0]);
      } else {
        setDocId(null);
        setDocName('');
        setDocumentContent('');
      }
    }
  };

  const handleRenameDocument = (idToRename, newName) => {
    const updatedDocs = docs.map((doc) =>
      doc.id === idToRename ? { ...doc, name: newName } : doc
    );
    setDocs(updatedDocs);
    if (docId === idToRename) {
      setDocName(newName);
    }
  };

  useEffect(() => {
    if (location.state?.docId && location.state?.docName) {
      handleDocumentSelect({ id: location.state.docId, name: location.state.docName });
      window.history.replaceState({}, document.title);
    }
  }, [location.state, handleDocumentSelect]);

  useEffect(() => {
    if (!docId && !isLoadingDocs && !docsError && docs?.length > 0) {
      handleDocumentSelect(docs[0]);
    }
  }, [docId, docs, isLoadingDocs, docsError, handleDocumentSelect]);

  const handleSummarize = async () => {
    if (!docId) return;
    setIsLoadingSummarize(true);
    setSummary('');
    try {
      const response = await axios.get(`http://localhost:5000/api/summary/${docId}`);
      setSummary(response.data.summary);
    } catch (error) {
      setSummary('Failed to fetch summary.');
    } finally {
      setIsLoadingSummarize(false);
    }
  };

  const handleQuery = async () => {
    if (!question.trim() || !docId) return;
    setIsLoadingQuery(true);
    setAnswer('');
    try {
      const response = await axios.post('http://localhost:5000/api/query', { docId, question });
      setAnswer(response.data.answer);
      setQuestion('');
    } catch (error) {
      setAnswer('Failed to get answer.');
    } finally {
      setIsLoadingQuery(false);
    }
  };

  if (isLoadingDocs) {
    return (
      <div className="interact-page">
        <DocumentSideMenu documents={[]} isLoadingDocs={true} />
        <main className="main-content">
          <div className="main-content__header">
            <h1 className="main-content__title main-content__title--skeleton"><SkeletonLoader /></h1>
          </div>
          <div className="document-view document-view--skeleton"><SkeletonLoader /></div>
          <div className="grid-layout">
            <div className="grid-item grid-item--skeleton"><SkeletonLoader /></div>
            <div className="grid-item grid-item--skeleton"><SkeletonLoader /></div>
          </div>
        </main>
      </div>
    );
  }

  if (docsError) {
    return (
      <div className="interact-page">
        <DocumentSideMenu documents={[]} docsError={docsError} />
        <main className="main-content main-content--centered">
          <p className="error-message">{docsError}</p>
        </main>
      </div>
    );
  }
  
  if (docs.length === 0) {
    return (
      <>
        <div className="interact-page">
          <DocumentSideMenu documents={docs} onAddNewDocument={openModal} />
          <main className="main-content main-content--centered">
            <div className="empty-state">
              <h1 className="empty-state__title">No Documents</h1>
              <p className="empty-state__subtitle">Upload a document to get started.</p>
            </div>
          </main>
        </div>
        {isModalOpen && <DocumentUploadModal onClose={closeModal}><UploadForm setDocs={setDocs} userId={userId} onClose={closeModal} /></DocumentUploadModal>}
      </>
    );
  }

  if (!docId) {
    return (
      <>
        <div className="interact-page">
          <DocumentSideMenu documents={docs} onAddNewDocument={openModal} onDocumentSelect={handleDocumentSelect} />
          <main className="main-content main-content--centered">
            <div className="empty-state">
              <h1 className="empty-state__title">Select a Document</h1>
              <p className="empty-state__subtitle">Choose a document from the sidebar to begin.</p>
            </div>
          </main>
        </div>
        {isModalOpen && <DocumentUploadModal onClose={closeModal}><UploadForm setDocs={setDocs} userId={userId} onClose={closeModal} /></DocumentUploadModal>}
      </>
    );
  }

  return (
    <>
      <div className="interact-page">
        <DocumentSideMenu
          documents={docs}
          activeDocId={docId}
          onDocumentSelect={handleDocumentSelect}
          onAddNewDocument={openModal}
          onDocumentDelete={handleDeleteDocument}
          onDocumentRename={handleRenameDocument}
        />
        <main className="main-content">
          <div className="main-content__header">
            <h1 className="main-content__title">{docName}</h1>
          </div>

          <div className="document-view">
            {isLoadingDocumentContent ? (
              <SkeletonLoader />
            ) : documentContentError ? (
              <p className="error-message">{documentContentError}</p>
            ) : (
              <p className="document-view__content">{documentContent}</p>
            )}
          </div>

          <div className="grid-layout">
            <div className="grid-item">
              <h2 className="grid-item__title">Summary</h2>
              <button className="grid-item__button" onClick={handleSummarize} disabled={isLoadingSummarize || isLoadingDocumentContent}>
                {isLoadingSummarize ? 'Summarizing...' : 'Summarize'}
              </button>
              <textarea
                className="grid-item__textarea"
                readOnly
                value={summary}
                placeholder="Summary will appear here..."
              />
            </div>

            <div className="grid-item">
              <h2 className="grid-item__title">Ask Query</h2>
              <div className="query-box">
                <input
                  type="text"
                  className="query-box__input"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isLoadingQuery || isLoadingDocumentContent}
                />
                <button className="query-box__button" onClick={handleQuery} disabled={!question || isLoadingQuery || isLoadingDocumentContent}>
                  {isLoadingQuery ? 'Asking...' : 'Ask'}
                </button>
              </div>
              <textarea
                className="grid-item__textarea"
                readOnly
                value={answer}
                placeholder="Answer will appear here..."
              />
            </div>
          </div>
        </main>
      </div>
      {isModalOpen && <DocumentUploadModal onClose={closeModal}><UploadForm setDocs={setDocs} userId={userId} onClose={closeModal} /></DocumentUploadModal>}
    </>
  );
}

export default Interact;