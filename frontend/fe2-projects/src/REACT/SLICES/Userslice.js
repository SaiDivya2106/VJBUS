import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendURL = process.env.REACT_APP_backend_url; // Flask Backend URL

// Login Thunk
export const userThunk = createAsyncThunk("UserThunk", async (userCredObj, thunkApi) => {
    try {
        const res = await axios.post(`${backendURL}/login`, userCredObj, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,  // Ensures cookies are sent
        });
       
        if (res.data.message === "Login successful!") {
            return res.data.user;  // Store user data in Redux state
        } else {
            return thunkApi.rejectWithValue(res.data.error);
        }
    } catch (err) {
        return thunkApi.rejectWithValue(err.response?.data?.error || "Login failed");
    }
});

// Check Auth Thunk
export const checkAuthThunk = createAsyncThunk("CheckAuthThunk", async (_, thunkApi) => {
   
    
    try {
        const res = await axios.get(`${backendURL}/check-auth`,{ withCredentials: true });
        
        return res.data.user;
    } catch (err) {
        return thunkApi.rejectWithValue("Not authenticated");
    }
});

// Logout Thunk
export const logoutThunk = createAsyncThunk("LogoutThunk", async (_, thunkApi) => {
    try {
        await axios.post(`${backendURL}/logout`, {}, { withCredentials: true });
        return null;
    } catch (err) {
        return thunkApi.rejectWithValue("Logout failed");
    }
});

// Redux Slice
export const User = createSlice({
    name: "userSlice",
    initialState: {
        isPending: false,
        currentUser: null,
        loginStatus: false,
        errorOccured: false,
        errorMessage: "",
    },
    reducers: {
        resetState: (state) => {
            state.currentUser = null;
            state.isPending = false;
            state.loginStatus = false;
            state.errorMessage = "";
            state.errorOccured = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userThunk.pending, (state) => {
                state.isPending = true;
            })
            .addCase(userThunk.fulfilled, (state, action) => {
                state.isPending = false;
                state.errorOccured = false;
                state.loginStatus = true;
                state.currentUser = action.payload;
            })
            .addCase(userThunk.rejected, (state, action) => {
                state.isPending = false;
                state.errorOccured = true;
                state.loginStatus = false;
                state.errorMessage = action.payload;
            })
            .addCase(checkAuthThunk.fulfilled, (state, action) => {
                state.loginStatus = true;
                state.currentUser = action.payload ; // Only storing ID for now
            })
            .addCase(checkAuthThunk.rejected, (state) => {
                state.loginStatus = false;
                state.currentUser = null;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.loginStatus = false;
                state.currentUser = null;
            });
    },
});

export const { resetState } = User.actions;
export default User.reducer;


// import { createSlice} from "@reduxjs/toolkit";
// import { isPending } from "@reduxjs/toolkit";
// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from 'axios'

// const backendURL = process.env.REACT_APP_backend_url;

// export const userThunk=createAsyncThunk('UserThunk',async(userCredObj,thunkApi)=>{
//     try{

        
//         if(userCredObj!=null)
//             {  
//                   const res=await axios.post(`${backendURL}/login`,userCredObj, {
//                     headers: {
//                       'Content-Type': 'application/json',
                     
//                     }})
//                     //(res)
                    
//                   if(res.data.message==='Login successful!'){
                    
                    
//                     sessionStorage.setItem('Token', res.data.token);
//                 const userData = JSON.stringify(res.data.user);
//                 localStorage.setItem('currentUser', userData);
//                 localStorage.setItem('loginStatus', 'true');
//                 //("done man!!")
                
//                   }
//                   else{
                    
//                     return thunkApi.rejectWithValue(res.data.error)
//                   }
//                 return res.data.user
//             }
          
//     }
//     catch(err){
//         return thunkApi.rejectWithValue(err)
//     }
// })



// export const User=createSlice(
//     {
//         name:"userSlice",
//         initialState:{
//             isPending:false,
//             currentUser: JSON.parse(localStorage.getItem('currentUser')) || {},
//     loginStatus: localStorage.getItem('loginStatus') === 'true',
//             errorOccured:false,
//             errorMessage:{},


//         },
        
//         reducers:{
//             resetState:(state,action)=>{
//                 state.currentUser={}
//                 state.isPending=false
//                 state.loginStatus=false
//                 state.errorMessage={}
//                 state.errorOccured=false
//             localStorage.removeItem('currentUser');
//             localStorage.removeItem('loginStatus');
//             sessionStorage.removeItem('Token');
//             }
//         },
//         extraReducers:(builder)=>{
//             builder
//             .addCase(userThunk.pending,(state,action)=>{
//                 state.isPending=true
//             })
//             .addCase(userThunk.fulfilled,(state,action)=>{
                
//                 state.isPending=false
//                 state.errorOccured=false
//                 state.loginStatus=true
//                 state.errorMessage=""
//                 state.currentUser=action.payload

//             })
//             .addCase(userThunk.rejected,(state,action)=>{
                
//                 state.isPending=false
//                 state.errorOccured=true
//                 state.loginStatus=false
//                 state.errorMessage=action.payload
//                 state.currentUser=""
//             })
//         }

       
//     }
// )
// export const {resetState}=User.actions

// export default User.reducer