import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DocumentSideMenu from '../components/DocumentSideMenu';
import DocumentUploadModal from '../components/DocumentUploadModal';
import UploadForm from '../components/UploadForm';
import SkeletonLoader from '../components/SkeletonLoader';
import './Interact.css';
import axios from 'axios';

function Interact() {
  const location = useLocation();
  const navigate = useNavigate();
  
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

  // COMPLETE LOGOUT FUNCTION - Redirects to LOGIN
  const handleLogout = () => {
    // Clear authentication storage
    localStorage.removeItem('userId');
    localStorage.removeItem('userToken');
    sessionStorage.clear();
    
    // Reset all Interact state
    setUserId(null);
    setDocs([]);
    setDocId(null);
    setDocName('');
    setDocumentContent('');
    setSummary('');
    setAnswer('');
    setQuestion('');
    setIsModalOpen(false);
    
    // Navigate to LOGIN page (clears browser history)
    navigate('/login', { 
      replace: true,
      state: { from: location.pathname }
    });
  };

  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    }
  }, [location.state]);

  useEffect(() => {
    if (userId) {
      setIsLoadingDocs(true);
      axios.get(`https://doc-sage.onrender.com/api/docs/${userId}`)
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
      const response = await axios.get(`https://doc-sage.onrender.com/api/file/${id}`);
      setDocumentContent(response.data.text);
    } catch (error) {
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
      const response = await axios.get(`https://doc-sage.onrender.com/api/summary/${docId}`);
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
      const response = await axios.post('https://doc-sage.onrender.com/api/query', { docId, question });
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
      <div className="interact-page serpentique min-h-screen">
        <DocumentSideMenu documents={[]} isLoadingDocs={true} />
        <main className="main-content">
          <div className="main-content__header twin-serpent-glow p-6">
            <h1 className="main-content__title main-content__title--skeleton serpentique"><SkeletonLoader /></h1>
          </div>
          <div className="document-view document-view--skeleton twin-serpent-glow p-8 rounded-2xl"><SkeletonLoader /></div>
          <div className="grid-layout">
            <div className="grid-item grid-item--skeleton twin-serpent-glow p-6 rounded-xl"><SkeletonLoader /></div>
            <div className="grid-item grid-item--skeleton twin-serpent-glow p-6 rounded-xl"><SkeletonLoader /></div>
          </div>
        </main>
      </div>
    );
  }

  if (docsError) {
    return (
      <div className="interact-page serpentique min-h-screen">
        <DocumentSideMenu documents={[]} docsError={docsError} />
        <main className="main-content main-content--centered">
          <p className="error-message serpentique text-emerald-glow p-8 twin-serpent-glow rounded-2xl max-w-2xl mx-auto text-center">{docsError}</p>
        </main>
      </div>
    );
  }
  
  if (docs.length === 0) {
    return (
      <>
        <div className="interact-page serpentique min-h-screen">
          <DocumentSideMenu documents={docs} onAddNewDocument={openModal} />
          <main className="main-content main-content--centered">
            <div className="empty-state twin-serpent-glow p-12 rounded-2xl text-center max-w-2xl mx-auto bg-gradient-to-br from-serpent-primary to-labyrinth-dark">
              <h1 className="empty-state__title serpentique text-3xl mb-4 text-emerald-glow">🐍 No Chronicles</h1>
              <p className="empty-state__subtitle serpentique text-lg mb-8 opacity-90">Upload a serpent scroll to begin the Twin Serpents ritual.</p>
              <button onClick={openModal} className="serpent-btn px-12 py-4 text-lg font-bold">⚔️ Ingest Chronicle</button>
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
        <div className="interact-page serpentique min-h-screen">
          <DocumentSideMenu documents={docs} onAddNewDocument={openModal} onDocumentSelect={handleDocumentSelect} />
          <main className="main-content main-content--centered">
            <div className="empty-state twin-serpent-glow p-12 rounded-2xl text-center max-w-2xl mx-auto bg-gradient-to-br from-serpent-primary to-labyrinth-dark">
              <h1 className="empty-state__title serpentique text-3xl mb-4 text-emerald-glow">📜 Select Chronicle</h1>
              <p className="empty-state__subtitle serpentique text-lg mb-8 opacity-90">Choose a document from the sidebar to query the Prophecy.</p>
            </div>
          </main>
        </div>
        {isModalOpen && <DocumentUploadModal onClose={closeModal}><UploadForm setDocs={setDocs} userId={userId} onClose={closeModal} /></DocumentUploadModal>}
      </>
    );
  }

  return (
    <>
      <div className="interact-page serpentique min-h-screen">
        <DocumentSideMenu
          documents={docs}
          activeDocId={docId}
          onDocumentSelect={handleDocumentSelect}
          onAddNewDocument={openModal}
          onDocumentDelete={handleDeleteDocument}
          onDocumentRename={handleRenameDocument}
        />
        <main className="main-content">
          {/* HEADER WITH LOGIN REDIRECT LOGOUT */}
          <div className="main-content__header twin-serpent-glow p-6 rounded-t-2xl bg-gradient-to-r from-serpent-primary to-labyrinth-dark border-b border-emerald-glow">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="main-content__title serpentique text-2xl lg:text-3xl font-bold text-emerald-glow">
                  📜 {docName}
                </h1>
                
              </div>
              <button 
  onClick={handleLogout}
  className="logout-btn serpentique shadow-lg hover:shadow-twin-serpent"
  title="Return to Serpent's Lair"
  disabled={isLoadingDocs}
>
  <span className="door-icon">🚪</span>
  <span className="hidden sm:inline">Log out</span>
  <span className="sm:hidden"></span>
</button>

            </div>
            
          </div>

          <div className="document-view twin-serpent-glow p-8 rounded-b-2xl bg-gradient-to-b from-labyrinth-dark to-serpent-primary">
            {isLoadingDocumentContent ? (
              <SkeletonLoader />
            ) : documentContentError ? (
              <div className="error-message serpentique text-red-400 p-8 bg-red-500/10 rounded-xl border-2 border-red-500/30">
                {documentContentError}
              </div>
            ) : (
              <div className="document-view__content serpentique leading-relaxed max-h-[400px] overflow-y-auto prose prose-invert max-w-none">
                {documentContent}
              </div>
            )}
          </div>

          <div className="grid-layout grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            <div className="grid-item twin-serpent-glow p-8 rounded-2xl bg-gradient-to-br from-serpent-primary to-labyrinth-dark">
              <h2 className="grid-item__title serpentique text-2xl mb-6 text-emerald-glow flex items-center">
                🔮 Prophecy Summary
              </h2>
              <button 
                className="serpent-btn w-full mb-6 px-8 py-3 text-lg" 
                onClick={handleSummarize} 
                disabled={isLoadingSummarize || isLoadingDocumentContent}
              >
                {isLoadingSummarize ? '🔮 Resonating...' : 'Reveal Summary'}
              </button>
              <textarea
                className="grid-item__textarea serpent-input w-full h-48 p-4 rounded-xl resize-vertical"
                readOnly
                value={summary}
                placeholder="Summary of the chronicle will appear here..."
              />
            </div>

            <div className="grid-item twin-serpent-glow p-8 rounded-2xl bg-gradient-to-br from-serpent-primary to-labyrinth-dark">
              <h2 className="grid-item__title serpentique text-2xl mb-6 text-emerald-glow flex items-center">
                🐍 Twin Serpent Query
              </h2>
              <div className="query-box mb-6 p-6 bg-grey-cloak/30 rounded-2xl border-2 border-emerald-glow/50">
                <input
                  type="text"
                  className="query-box__input serpent-input w-full p-4 rounded-xl mb-4 text-lg"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What occurred at Cokeworth on November 1st, 1978?..."
                  disabled={isLoadingQuery || isLoadingDocumentContent}
                />
                <button 
                  className="serpent-btn w-full px-8 py-3 text-lg" 
                  onClick={handleQuery} 
                  disabled={!question.trim() || isLoadingQuery || isLoadingDocumentContent}
                >
                  {isLoadingQuery ? '🔮 Divining...' : '🐍 Ask the Serpents'}
                </button>
              </div>
              <textarea
                className="grid-item__textarea serpent-input w-full h-48 p-4 rounded-xl resize-vertical"
                readOnly
                value={answer}
                placeholder="Revelation from the Twin Serpents will appear here..."
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
