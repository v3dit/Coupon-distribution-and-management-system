import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import img1 from './img/Group 15.png';
import img2 from './img/Ellipse 4.png';
import img3 from './img/system.svg';

const StartPage = () => {

  return (
    <div>
      <div className='StartUpPage row p-0 m-0'>
        <img className='HPImg1' src={img1} alt='Graphic' style={{ width: '50vw', position: 'absolute', right: '0px', padding: '0px', margin: '0px', zIndex: '0' }} />
        <img className='HPImg2' src={img2} alt='Graphic' style={{ width: '10vw', position: 'absolute', left: '0px', top: '70vh', padding: '0px', zIndex: '0' }} />
        <div className='StartUpStart'>
          <h1 className={'StartUpTitle'}>Kūpan</h1>
          <p className={'StartUpDescription'}>Discover seamless savings with our all-in-one coupon platform. Connect shops, distributors, and savvy customers through our intuitive system. Distributors effortlessly create and distribute coupons, while shops redeem and benefit. Shoppers unlock exclusive discounts, enhancing their shopping experience. Elevate your savings game with our efficient coupon website.</p>
          <Link to="/login" className='GetStarted'>
            <button>Get Started</button>
          </Link>
        </div>
        <div className='row justify-content-center align-items-center p-0' style={{marginTop: '10vw'}}>
          <h1 className='col-10' style={{ width: '70vw', color: 'white', textAlign: 'center', marginTop: '5vw', zIndex: '2' }}>Distribute Coupons the Smart Way with Kūpan</h1>
          <div className='col-10 mt-5' style={{height: '90vw'}}>
            <img src={img3} alt='Graphic' style={{ width: '80vw', position: 'absolute', alignSelf: 'center' }} />
          </div>
          <h1 className='col-10' style={{ width: '70vw', color: 'white', textAlign: 'center' }}>
            Have Full Control Of Your Customer and Distibutor List
            <br /><br /><br />
            Forget the Hassle Of Printing and Distribution
            <br /><br /><br />
            Send and Let Customer Receive Coupons In The Most Easy And Reliable Way
            <br /><br /><br />
            Connect With Distributor And Shops Just An E-Mail And A Click
            <br /><br /><br />
            All coupons are Protected and Safeguarded By Us
            <br /><br /><br />
            Get A Demo Let Kūpan Do the Lifting
          </h1>
          <h3 className='col-10' style={{ width: '70vw', color: 'white', textAlign: 'center' }}>Drop a mail at <a href="mailto: start@drilldown.online">start@drilldown.online</a></h3>
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </div>
    </div>
  );
};

export default StartPage;
