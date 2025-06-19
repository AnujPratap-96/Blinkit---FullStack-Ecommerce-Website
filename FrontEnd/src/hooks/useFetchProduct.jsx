import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { setProducts, setLoadingProducts } from "../store/productSlice";
import Axios from "../utils/Axios";

const useFetchProduct = ({ page, limit, search = "", setTotalPageCount }) => {
  const dispatch = useDispatch();

  const fetchProductData = useCallback(
    async ({ page: fetchPage = page, limit: fetchLimit = limit, search: fetchSearch = search } = {}) => {
      try {
        dispatch(setLoadingProducts(true));

        const response = await Axios({
          ...SummaryApi.getProduct,
          data: {
            page: fetchPage,
            limit: fetchLimit,
            search: fetchSearch,
          },
        });

        const { data: responseData } = response;

        if (responseData.success) {
          dispatch(setProducts(responseData.data));
          if (setTotalPageCount) {
            setTotalPageCount(Math.ceil(responseData.totalCount ));
          }
        }
      } catch (error) {
        AxiosToastError(error);
      } finally {
        dispatch(setLoadingProducts(false));
      }
    },
    [dispatch, page, limit, search, setTotalPageCount]
  );

  useEffect(() => {
    fetchProductData(); // uses default values
  }, [fetchProductData]);

  return {
    refetch: fetchProductData, // can now be called with parameters
  };
};


export default useFetchProduct;
