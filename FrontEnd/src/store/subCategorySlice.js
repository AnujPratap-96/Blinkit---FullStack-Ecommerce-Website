import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allSubCategory: [],
  loadingSubCategory: false,
};

const subCategorySlice = createSlice({
  name: 'subcategory',
  initialState,
  reducers: {
    setAllSubCategory: (state, action) => {
      state.allSubCategory = [...action.payload]
    },
    setLoadingSubCategory: (state, action) => {
      state.loadingSubCategory = action.payload;
    },
  },
});

export const { setAllSubCategory, setLoadingSubCategory } = subCategorySlice.actions;
export default subCategorySlice.reducer;
