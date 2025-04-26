import React from 'react';

import NavBar from '../../AllCorrectPages/NavBar';
import Footer from '../footer/Footer';
import { Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <div>
      <NavBar />
        {/* <NavigationBar /> */}
        <div style={{minHeight:'89vh'}}>
        <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default RootLayout