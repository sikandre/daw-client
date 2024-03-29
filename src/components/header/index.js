import React from 'react';
import { Link } from 'react-router-dom';
import { Auth } from './Auth';

const Header = () => {
  return (
    <div className='ui secondary pointing menu'>
      <Link to='/' className='item'>
        Projects
      </Link>
      <div className='right menu'>
        <Auth />
      </div>
    </div>
  );
};

export default Header;
