import React from 'react'
import './Error.css'
import animationData from '../animations/errorpage.json'
import Lottie from 'react-lottie';

function Error() {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData, // Lottie JSON data
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      };
  return (
    <div className='error404'>
            
          <Lottie options={defaultOptions} height={300} width={300}  />
          <p className='text-center fs-4'>Page Not Found</p>
    
    </div>
  )
}

export default Error