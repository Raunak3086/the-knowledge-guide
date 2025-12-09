import React, { useEffect, useRef } from 'react';
import './ContextMenu.css';

const ContextMenu = ({ x, y, doc, onClose, onRename, onDelete }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleRename = () => {
    onRename(doc);
    onClose();
  };

  const handleDelete = () => {
    onDelete(doc.id);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ top: y, left: x }}
    >
      <ul>
        <li onClick={handleRename}>Rename</li>
        <li onClick={handleDelete} className="delete">Delete</li>
      </ul>
    </div>
  );
};

export default ContextMenu;
