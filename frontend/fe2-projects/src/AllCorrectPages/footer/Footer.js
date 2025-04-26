import React from 'react'
import { Link } from 'react-router-dom';
import './Footer.css'

function Footer() {
  return (
    <div className=' bg-dark shadow text-white  p-3  '>
         {/* <div className='foot d-flex justify-content-between'>
        <p className='title '>VNRVJIET DUPLICAXPERT</p>
        <Link className='footer-link text-white pt-1 nav-link w-20' to='/Credits'>CREDITS</Link>
      </div>      */}

      <div className='d-flex justify-content-around'>
        <div>
      <p className='protitle '>VNRVJIET DUPLICAXPERT</p>
      </div>
      <div>
      <Link className='footer-link text-white pt-1 w-20' to='/Credits'>CREDITS</Link>
      </div>
      </div>
    </div>
  )
}

export default Footer