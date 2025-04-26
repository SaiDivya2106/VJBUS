import { createSlice} from "@reduxjs/toolkit";
import { isPending } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
let backendURL = process.env.REACT_APP_backend_url;
//(apiUrl); // Should output: https://api.example.com
//(apiUrl,process.env)
export const PRCThunk=createAsyncThunk('PRCThunk',async(userCredObj,thunkApi)=>{
    try{
      

        if(userCredObj!=null)
            {  
                  const res=await axios.post(`${backendURL}/login_PRC`,userCredObj, {
                    headers: {
                      'Content-Type': 'application/json',
                      
                    }})
                    
                  if(res.data.message==='Login successful!'){
                   
                    return res.data.user
                   
                
                
                  }
                  else{
                    return thunkApi.rejectWithValue(res.data.error)
                  }
                
            }
          
    }
    catch(err){
        return thunkApi.rejectWithValue(err)
    }
})
export const PRCcheckAuthThunk = createAsyncThunk("PRCCheckAuthThunk", async (_, thunkApi) => {
   
    console.log("why calling me....")
    
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


export const PRC=createSlice(
    {
        name:"PRCSlice",
        initialState:{
            isPending:false,
            currentUser: null,
    loginStatus: false,
            errorOccured:false,
            errorMessage:{},


        },
        reducers:{
            resetState1:(state,action)=>{
                state.currentUser=null
                state.isPending=false
                state.loginStatus=false
                state.errorMessage=""
                state.errorOccured=false
               
            }
        },
        extraReducers:(builder)=>{
            builder
            .addCase(PRCThunk.pending,(state,action)=>{
                state.isPending=true
            })
            .addCase(PRCThunk.fulfilled,(state,action)=>{
                
                state.isPending=false
                state.errorOccured=false
                state.loginStatus=true
                state.errorMessage=""
                state.currentUser=action.payload

            })
            .addCase(PRCThunk.rejected,(state,action)=>{
                
                state.isPending=false
                state.errorOccured=true
                state.loginStatus=false
                state.errorMessage=action.payload
                
            })
            .addCase(PRCcheckAuthThunk.fulfilled, (state, action) => {
                            state.loginStatus = true;
                            state.currentUser = action.payload ; // Only storing ID for now
                        })
            .addCase(PRCcheckAuthThunk.rejected, (state) => {
                            state.loginStatus = false;
                            state.currentUser = null;
                        })
            .addCase(logoutThunk.fulfilled, (state) => {
                    state.loginStatus = false;
                    state.currentUser = null;
             });
        }

       
    }
)
export const {resetState1}=PRC.actions

export default PRC.reducer