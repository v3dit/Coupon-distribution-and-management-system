import React from 'react';
import { Link } from 'react-router-dom';
import 'react-bootstrap';
import './style.css';
import rotatingImg from './img/1.png';

const StartPage = () => {
  return (
    <div className='container-fluid justify-content-around' style={{ paddingLeft: '7vw', paddingRight: '7vw', position: 'relative' }}>
      <div className='row justify-content-start mt-5 mb-5 pt-5 pb-5'>
        <h1 style={{ fontSize: '12.5vh' }}>Kūpan</h1>
        <p className='col-lg-5 col-md-5 col-sm-5' style={{ fontSize: '2.1vh' }}>Welcome to Jñāna, your ultimate business enhancement platform. We provide comprehensive feedback tools, tailored forms, and immersive visualizations to empower your business with data-driven insights for continuous improvement.</p>
        <Link to="/login">
          <button style={{ fontSize: '3vh' }}>Get Started</button>
        </Link>
      </div>
      <img className="rotating-image" src={rotatingImg} alt="Rotating" />
    </div>
  );
};

export default StartPage;
