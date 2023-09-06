import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const StartPage = () => {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <div>
      <div
        className={`StartUpPage ${hovered ? 'hovered' : ''}`}>
        <h1 className={`StartUpTitle ${hovered ? 'hovered' : ''}`}>Kūpan</h1>
        <div className='row justify-content-center align-items-center m-0'>
          <p className={`StartUpDescription  ${hovered ? 'hovered' : ''} col-lg-4 col-md-4 col-sm-11`}>Discover seamless savings with our all-in-one coupon platform. Connect shops, distributors, and savvy customers through our intuitive system. Distributors effortlessly create and distribute coupons, while shops redeem and benefit. Shoppers unlock exclusive discounts, enhancing their shopping experience. Elevate your savings game with our efficient coupon website.</p>
          <Link to="/login" className='col-lg-8 col-md-6 col-sm-12'>
            <button className='GetStarted' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
