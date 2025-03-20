import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfile, logout } from "../server/api";

export const fetchProfile = createAsyncThunk("getProfile", async () => {
    const profile = await getProfile();
    return profile.data;
});

const globalReducer = createSlice({
    name: 'store',
    initialState: {
        user: null,
        paramId:null
    },
    reducers: {
        setParamId:(state,action)=>{
            state.paramId = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProfile.fulfilled, (state, action) => {
                state.user = action.payload.user; // Store actual socket instance
            })
    }
});

export const {setParamId} = globalReducer.actions;

export const globalStore = globalReducer.reducer;
