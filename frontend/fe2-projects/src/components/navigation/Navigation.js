// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHandPaper, faSignOutAlt, faHouse  } from '@fortawesome/free-solid-svg-icons';
// import './Navigation.css';
// import a from '../images/duplica.png';
// import { useSelector } from 'react-redux';
// import Userslice from '../../REACT/SLICES/Userslice';
// import { resetState } from '../../REACT/SLICES/Userslice';
// import { resetState1 } from '../../REACT/SLICES/PRCslice';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// function Navigation() {

//   const dispatch=useDispatch()
//   const navigate = useNavigate();
//   let [username, setUsername] = useState('');
//   const data=useSelector((state)=>state.User)
//   const data1=useSelector((state)=>state.PRC)
//   console.log(data.currentUser)
//   if(data.currentUser.name)
//   {
//     username=data.currentUser.name
//   }
//   else{
//     username=data1.currentUser.department
//   }
//   const handleLogout = () => {
//     dispatch(resetState())
//     dispatch(resetState1())
//     navigate('/login')
//   };
//   const Navigate=useNavigate()
//   // useEffect(()=>{
//   //   if(data.loginStatus)
//   //   {
//   //     if(data.currentUser.role==='faculty')
//   //     {
//   //       Navigate('/fileUpload')
//   //     }
//   //     else if(data.currentUser.role==='student')
//   //     {
//   //       Navigate('/')
//   //     }
//   //   }
//   // },[])

//   return (
//     <div>
//       <ul className='nav bg-dark bg-gradient justify-content-between p-1 pb-0'>
//         <li className='title text-white'>
//           <div className='logoo d-flex justify-content-start gap-2'> 
//           <img src={a} className='img11' alt='Logo' />
//           <p className='pt-1'>DuplicaXpert</p>
//           </div>
          
//         </li>
//         <div className='d-flex'>
//           <li className='nav-item'>
//             <Link className='nav-link text-white' to='/'> <FontAwesomeIcon icon={faHouse} />
//             </Link>
//           </li>
//           <li className='nav-item'>
//             <Link className='nav-link text-white' to='/catalog'>Catalog</Link>
//           </li>
//           {!username  ? (
//             <>
//               <li className='nav-item'>
//                 <Link className='nav-link text-white' to='/login'>Login</Link>
//               </li>
//               <li className='nav-item'>
//                 <Link className='nav-link text-white' to='/register'>Register</Link>
//               </li>
//             </>
//           ) : (
//             <>
//               <li className='nav-item text-white p-2'>
//                 <FontAwesomeIcon icon={faHandPaper} /> Hi {username}
//               </li>
//               <li className='nav-item text-white p-2' onClick={handleLogout} style={{ cursor: 'pointer' }}>
//                 <FontAwesomeIcon icon={faSignOutAlt} /> Logout
//               </li>
//             </>
//           )}
//         </div>
//       </ul>
//     </div>
//   );
// }
// export default Navigation;
