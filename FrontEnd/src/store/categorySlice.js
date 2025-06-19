import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allCategory: [],
  loadingCategory: false,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setAllCategory: (state, action) => {
      state.allCategory = [...action.payload]
    },
    setLoadingCategory: (state, action) => {
      state.loadingCategory = action.payload;
    },
  },
});

export const { setAllCategory, setLoadingCategory } = categorySlice.actions;
export default categorySlice.reducer;
