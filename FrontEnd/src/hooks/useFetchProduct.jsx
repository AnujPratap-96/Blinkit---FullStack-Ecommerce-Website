import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import {  setProducts,  setLoadingProducts } from "../store/productSlice";
import Axios from "../utils/Axios";

const useFetchProduct = ({ page, limit, search = "" , setTotalPageCount }) => {
  const dispatch = useDispatch();
  const fetchProductData = useCallback(async () => {
    try {
      dispatch(setLoadingProducts(true));
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page: page,
          limit: limit,
          search: search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        dispatch( setProducts(responseData.data));
        if (setTotalPageCount) {
          setTotalPageCount(responseData.totalCount);
         
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      dispatch(setLoadingProducts(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProductData();
  }, [page]);
  return {
    refetch: fetchProductData,
  };
};

export default useFetchProduct;
