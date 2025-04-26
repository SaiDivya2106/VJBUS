import {configureStore} from '@reduxjs/toolkit'

import Userslice from './REACT/SLICES/Userslice'
import PRCslice from './REACT/SLICES/PRCslice'
// import { userThunk } from './REACT/SLICES/userslice'
// to takes a proprty as reducers we need to add slices here so that the state can be acessed by globally

export const store=configureStore({
    reducer:{
        User : Userslice,
        PRC : PRCslice
    }
})
