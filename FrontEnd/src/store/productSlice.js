import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  loadingProducts: false,
  selectedProduct: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products =  action.payload;
    },
    setLoadingProducts: (state, action) => {
      state.loadingProducts = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
});

export const { setProducts, setLoadingProducts, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
