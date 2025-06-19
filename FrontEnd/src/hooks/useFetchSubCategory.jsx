import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setAllSubCategory,
  setLoadingSubCategory,
} from "../store/subCategorySlice";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "react-hot-toast";

const useFetchSubCategory = () => {
  const dispatch = useDispatch();

  const fetchSubCategory = useCallback(async () => {
    try {
      dispatch(setLoadingSubCategory(true));
      const response = await Axios(SummaryApi.getSubCategory);
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(
          setAllSubCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
      }
    } catch (error) {
     
      toast.error(
        "Something went wrong while fetching subcategories. " + error.message
      );
    } finally {
      dispatch(setLoadingSubCategory(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSubCategory();
  }, [fetchSubCategory]);

  return {
    refetch: fetchSubCategory,
  };
};

export default useFetchSubCategory;
