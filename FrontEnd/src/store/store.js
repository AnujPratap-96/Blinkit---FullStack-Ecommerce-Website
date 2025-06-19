import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartProduct";
import addressReducer from "./addressSlice";
import orderReducer from "./orderSlice";
import categoryReducer from "./categorySlice";
import subCategoryReducer from "./subCategorySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    category: categoryReducer,
    subcategory: subCategoryReducer,
    product: productReducer,
    cartItem: cartReducer,
    addresses: addressReducer,
    orders: orderReducer,
  },
});
