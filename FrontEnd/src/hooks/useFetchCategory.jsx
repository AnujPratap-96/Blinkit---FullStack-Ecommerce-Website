import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setAllCategory, setLoadingCategory } from "../store/categorySlice";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "react-hot-toast";

const useFetchCategory = () => {
  const dispatch = useDispatch();

  const fetchCategory = useCallback(async () => {
    try {
      dispatch(setLoadingCategory(true));

      const response = await Axios(SummaryApi.getCategory);
      const { data: responseData } = response;
     

      if (responseData.success) {
        dispatch(
          setAllCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
      }
    } catch (error) {
      toast.error(
        "Something went wrong while fetching categories. " + error.message
      );
    } finally {
      dispatch(setLoadingCategory(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return {
    refetch: fetchCategory,
  };
};

export default useFetchCategory;
