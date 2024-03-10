import { createSlice } from '@reduxjs/toolkit'

const initialState={
    currentUser:null,
    error:null,
    loading:false
}

export const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        // sign in process has started
        signInStart:(state)=>{
            state.error=null;
            state.loading=true;
        },
        signInSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        signInFailure:(state,action)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=action.payload;
        }
    }
})

export const{signInStart,signInSuccess,signInFailure}=userSlice.actions;
export default userSlice.reducer