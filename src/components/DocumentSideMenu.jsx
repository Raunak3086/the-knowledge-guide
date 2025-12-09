
import React, { useState, useMemo, useCallback } from 'react';
import SkeletonLoader from './SkeletonLoader';
import ContextMenu from './ContextMenu';
import './DocumentSideMenu.css';

const DocumentSideMenu = ({
  documents,
  activeDocId,
  onDocumentSelect,
  onAddNewDocument,
  onDocumentDelete,
  onDocumentRename,
  isLoadingDocs,
  docsError,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [draftName, setDraftName] = useState('');
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    doc: null,
  });

  // ✅ NEW: Tab state for switching between "My Documents" and "Connect to User"
  const [activeTab, setActiveTab] = useState('myDocuments'); // 'myDocuments' or 'connectUser'

  // ✅ NEW: Connect to User states
  const [connectEmail, setConnectEmail] = useState('');
  const [connectPassword, setConnectPassword] = useState('');
  const [isLoadingConnect, setIsLoadingConnect] = useState(false);
  const [connectError, setConnectError] = useState(null);
  const [connectSuccess, setConnectSuccess] = useState(false);
  const [connectedUserDocs, setConnectedUserDocs] = useState([]);
  const [connectedUserEmail, setConnectedUserEmail] = useState('');

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // ✅ FIX 1: Ensure documents is always an array
  const safeDocuments = useMemo(() => {
    if (Array.isArray(documents)) {
      return documents;
    }
    return [];
  }, [documents]);

  // ✅ FIX 2: Filter with proper null/undefined checks
  const filteredDocuments = useMemo(() => {
    if (!Array.isArray(safeDocuments)) {
      return [];
    }

    const searchLower = (searchTerm || '').toLowerCase().trim();

    return safeDocuments.filter((doc) => {
      if (!doc || typeof doc !== 'object') {
        return false;
      }

      const docName = (doc.name || doc.title || 'Untitled').toLowerCase();
      return docName.includes(searchLower);
    });
  }, [safeDocuments, searchTerm]);

  // ✅ NEW: Connect to User function
  const handleConnectToUser = async (e) => {
    e.preventDefault();

    if (!connectEmail.trim() || !connectPassword.trim()) {
      setConnectError('Please enter both email and password');
      return;
    }

    setIsLoadingConnect(true);
    setConnectError(null);
    setConnectSuccess(false);

    try {
      // Call backend to authenticate user and get their documents
      const response = await fetch('http://localhost:5000/api/docs/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: connectEmail.trim(),
          password: connectPassword.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to connect to user');
      }

      const data = await response.json();
      console.log(data);
      // Ensure data.docs is an array
      const userDocs = Array.isArray(data) ? data : [];

      setConnectedUserDocs(userDocs);
      setConnectedUserEmail(connectEmail);
      setConnectSuccess(true);
      setConnectEmail('');
      setConnectPassword('');

      // Optional: Auto-switch to connected user's docs if any exist
      if (userDocs.length > 0) {
        setActiveTab('connectedDocs');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setConnectError(error.message || 'Failed to connect to user. Check credentials and try again.');
      setConnectedUserDocs([]);
    } finally {
      setIsLoadingConnect(false);
    }
  };

  // ✅ NEW: Clear connected user session
  const handleDisconnectUser = () => {
    setConnectedUserDocs([]);
    setConnectedUserEmail('');
    setConnectError(null);
    setConnectSuccess(false);
    setActiveTab('myDocuments');
  };

  const handleDelete = (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      onDocumentDelete(docId);
    }
  };

  const handleRenameClick = (doc) => {
    setRenamingId(doc.id);
    setDraftName(doc.name || doc.title || 'Untitled');
  };

  const handleSaveRename = (e) => {
    e.stopPropagation();
    if (draftName.trim()) {
      onDocumentRename(renamingId, draftName.trim());
    }
    setRenamingId(null);
    setDraftName('');
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setRenamingId(null);
    setDraftName('');
  };

  const handleContextMenu = (e, doc) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      doc: doc,
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  return (
    <div
      className={`document-side-menu ${isCollapsed ? 'collapsed' : ''}`}
      onClick={closeContextMenu}
    >
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          doc={contextMenu.doc}
          onClose={closeContextMenu}
          onRename={handleRenameClick}
          onDelete={handleDelete}
        />
      )}

      <button onClick={toggleCollapse} className="collapse-btn" aria-label="Toggle sidebar">
        {isCollapsed ? '»' : '«'}
      </button>

      {!isCollapsed && (
        <>
          {/* ✅ NEW: Tab Navigation */}
          <div className="document-tabs">
            <button
              className={`tab-button ${activeTab === 'myDocuments' ? 'active' : ''}`}
              onClick={() => setActiveTab('myDocuments')}
              aria-label="View my documents"
            >
              My Documents
            </button>
            <button
              className={`tab-button ${activeTab === 'connectUser' ? 'active' : ''}`}
              onClick={() => setActiveTab('connectUser')}
              aria-label="Connect to another user"
            >
              Connect User
            </button>
          </div>

          {/* ✅ MY DOCUMENTS TAB */}
          {activeTab === 'myDocuments' && (
            <div className="document-list">
              <div className="document-list-header">
                <h2>My Documents</h2>
                <span className="doc-count">{filteredDocuments.length}</span>
              </div>

              {/* Loading State */}
              {isLoadingDocs ? (
                <div className="skeleton-list">
                  <SkeletonLoader className="skeleton-item" count={6} />
                </div>
              ) : docsError ? (
                <div className="error-message-container">
                  <p className="error-message">⚠️ {docsError}</p>
                </div>
              ) : safeDocuments.length === 0 ? (
                <p className="no-documents-message">No documents yet. Create one to get started.</p>
              ) : (
                <>
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search documents..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search documents"
                  />

                  {/* Documents List */}
                  {filteredDocuments.length > 0 ? (
                    <ul className="documents-ul">
                      {filteredDocuments.map((doc) => (
                        <li
                          key={doc.id}
                          className={`document-item ${doc.id === activeDocId ? 'active' : ''}`}
                          onClick={() => {
                            if (renamingId !== doc.id) {
                              onDocumentSelect(doc);
                            }
                          }}
                          onContextMenu={(e) => handleContextMenu(e, doc)}
                        >
                          {renamingId === doc.id ? (
                            <div className="rename-container">
                              <input
                                type="text"
                                value={draftName}
                                onChange={(e) => setDraftName(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveRename(e);
                                  } else if (e.key === 'Escape') {
                                    handleCancelRename(e);
                                  }
                                }}
                                autoFocus
                                className="rename-input"
                                aria-label="Document name"
                              />
                              <button
                                onClick={handleSaveRename}
                                className="doc-action-btn save"
                                title="Save (Enter)"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelRename}
                                className="doc-action-btn delete"
                                title="Cancel (Esc)"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="document-info">
                              <span className="doc-name" title={doc.name || doc.title}>
                                {doc.name || doc.title || 'Untitled'}
                              </span>
                              {doc.updatedAt && (
                                <span className="doc-date">
                                  {new Date(doc.updatedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-documents-message">No documents match your search.</p>
                  )}
                </>
              )}
            </div>
          )}

          {/* ✅ NEW: CONNECT TO USER TAB */}
          {activeTab === 'connectUser' && (
            <div className="connect-user-section">
              <div className="connect-user-header">
                <h2>Connect to User</h2>
                <p className="connect-user-subtitle">Access documents from another user</p>
              </div>

              {/* If already connected */}
              {connectedUserEmail && (
                <div className="connected-user-info">
                  <div className="connected-badge">
                    <span className="connected-email">👤 {connectedUserEmail}</span>
                    <button
                      className="disconnect-btn"
                      onClick={handleDisconnectUser}
                      title="Disconnect from this user"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}

              {/* Connection Form */}
              {!connectedUserEmail ? (
                <form className="connect-form" onSubmit={handleConnectToUser}>
                  {connectError && (
                    <div className="error-message-container">
                      <p className="error-message">⚠️ {connectError}</p>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={connectEmail}
                      onChange={(e) => setConnectEmail(e.target.value)}
                      placeholder="user@example.com"
                      disabled={isLoadingConnect}
                      required
                      aria-label="User email"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={connectPassword}
                      onChange={(e) => setConnectPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={isLoadingConnect}
                      required
                      aria-label="User password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="connect-btn"
                    disabled={isLoadingConnect || !connectEmail.trim() || !connectPassword.trim()}
                  >
                    {isLoadingConnect ? 'Connecting...' : 'Connect'}
                  </button>
                </form>
              ) : (
                /* Show connected user's documents */
                <div className="connected-documents">
                  {connectedUserDocs.length > 0 ? (
                    <>
                      <h3 className="connected-docs-title">
                        {connectedUserDocs.length} document{connectedUserDocs.length !== 1 ? 's' : ''} available
                      </h3>
                      <ul className="documents-ul">
                        {connectedUserDocs.map((doc) => (
                          <li
                            key={doc.id}
                            className={`document-item ${doc.id === activeDocId ? 'active' : ''}`}
                            onClick={() => onDocumentSelect(doc)}
                          >
                            <div className="document-info">
                              <span className="doc-name" title={doc.name || doc.title}>
                                {doc.name || doc.title || 'Untitled'}
                              </span>
                              {doc.updatedAt && (
                                <span className="doc-date">
                                  {new Date(doc.updatedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="no-documents-message">
                      No documents available from this user.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Add New Document Button - Only show on My Documents tab */}
          {activeTab === 'myDocuments' && (
            <button
              className="add-new-document-btn"
              onClick={onAddNewDocument}
              disabled={isLoadingDocs || !!docsError}
              aria-label="Add new document"
            >
              + Add New Document
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentSideMenu;