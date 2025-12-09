import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to DocSage</h1>
        <p>Click the button below to start interacting with your documents.</p>
        <Link to="/login" className="btn-primary">Go to Login</Link>
      </div>
    </div>
  );
}

export default Home;

