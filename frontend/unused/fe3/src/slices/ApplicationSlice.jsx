import { createSlice } from '@reduxjs/toolkit';

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    ApplicationsData: [],  
    error: null,
  },
  reducers: {
    setApplicationsData: (state, action) => {
      state.ApplicationsData = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setApplicationsData, setError } = applicationSlice.actions;
export default applicationSlice.reducer;
