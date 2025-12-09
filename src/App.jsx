import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Interact from './pages/Interact';
//import DocumentUpload from './pages/DocumentUpload';
import Login from './pages/Login';        
import Register from './pages/Register';  
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/interact"
          element={
            <Interact
            />
          }
        />

       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </>
  );
}

export default App;
