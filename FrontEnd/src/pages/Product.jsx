import { useState } from "react";

import { useSelector } from "react-redux";
import useFetchProduct from "../hooks/useFetchProduct";

const Product = () => {
  const [page, setPage] = useState(1);
  const { products } = useSelector((state) => state.product);

  const { refetch } = useFetchProduct({ page, limit: 12 , search: "" , setTotalPageCount: setPage });

  return <div>Product</div>;
};

export default Product;
