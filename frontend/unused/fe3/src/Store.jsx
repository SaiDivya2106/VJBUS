import {configureStore} from '@reduxjs/toolkit';
import applicationReducer from './slices/ApplicationSlice'
import authReducer from './slices/authSlice';
export let store=configureStore({
    reducer:{
        applications:applicationReducer,
        auth:authReducer,
    },
});