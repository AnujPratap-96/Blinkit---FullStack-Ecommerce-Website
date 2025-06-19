import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { setUserDetails } from "../store/userSlice";
import AxiosToastError from "../utils/AxiosToastError";


const useFetchUserDetails = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Axios(SummaryApi.userDetails);
      dispatch(setUserDetails(response.data.data));
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    loading,
    refetch: fetchUser,
  };
};

export default useFetchUserDetails;
