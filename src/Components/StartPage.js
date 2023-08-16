import React from 'react';
import { Link } from 'react-router-dom';
import 'react-bootstrap';
import './style.css';
import formIcon from './img/icon1.svg';
import visvulizeIcon from './img/icon2.svg';
import joinHandsIcon from './img/icon3.svg';

const StartPage = () => {
  return (
    <div className='container-fluid justify-content-around' style={{marginLeft: 25, marginRight: 25}}>
      <div className='row justify-content-start mt-5 mb-5 pt-5 pb-5'>
        <h1 style={{fontSize: 120}}>Kūpan</h1>
        <p className='col-lg-7 col-md-7 col-sm-12' style={{fontSize:15}}>Welcome to Jñāna, your ultimate business enhancement platform. We provide comprehensive feedback tools, tailored forms, and immersive visualizations to empower your business with data-driven insights for continuous improvement.</p>
        <Link to="/login">
          <button style={{fontSize:20}}>Get Started</button>
        </Link>
      </div>  
      <div className='row justify-content-around'>
        <div className='col-lg-3 col-md-3 col-sm-10'>
          <div className='row justify-content-start'>
            <h1 className='col-1'>1</h1>
            <img className='col-3' src={formIcon} alt="form icon"/>
          </div>
          <div className='row' style={{ borderTop: "1px solid #000 "}}></div>
          <p style={{fontSize:12}}>Create tailored feedback forms with ease using our intuitive customization tools, enabling you to gather precise insights from your customers and stakeholders effortlessly.</p>
        </div>

        <div className='col-lg-3 col-md-3 col-sm-10'>
          <div className='row justify-content-start'>
            <h1 className='col-1'>2</h1>
            <img className='col-3' src={visvulizeIcon} alt="form icon"/>
          </div>
          <div className='row' style={{ borderTop: "1px solid #000 "}}></div>
          <p style={{fontSize:12}}>Unlock the power of data with our detailed visualizations, offering a comprehensive overview of your business performance and allowing you to make informed decisions with clarity.</p>
        </div>
        <div className='col-lg-3 col-md-3 col-sm-10'>
          <div className='row justify-content-start'>
            <h1 className='col-1'>3</h1>
            <img className='col-3' src={joinHandsIcon} alt="form icon"/>
          </div>
          <div className='row' style={{ borderTop: "1px solid #000 "}}></div>
          <p style={{fontSize:12}}>Experience a seamless journey with our user-friendly interface, designed to provide a step up for your business by simplifying complex processes and streamlining tasks for maximum efficiency.</p>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
