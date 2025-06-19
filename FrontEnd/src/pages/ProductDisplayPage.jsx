import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import Divider from "../components/Divider";
import image1 from "../assets/minute_delivery.png";
import image2 from "../assets/Best_Prices_Offers.png";
import image3 from "../assets/Wide_Assortment.png";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params?.product?.split("-")?.slice(-1)[0];

  const [data, setData] = useState({ name: "", image: [] });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId },
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  const moreDetails = data.more_details || {};
  const ignoreKeys = ["Key Features", "Disclaimer"];

  return (
    <section className="container mx-auto p-4">
      {/* Top section: image & main info */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left: Images */}
        <div>
          <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
            <img
              src={data.image[image]}
              className="w-full h-full object-scale-down"
              alt="Product"
            />
          </div>

          {/* Image selectors */}
          <div className="flex items-center justify-center gap-3 my-2">
            {data.image.map((img, index) => (
              <div
                key={img + index + "point"}
                className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${
                  index === image && "bg-slate-300"
                }`}
              ></div>
            ))}
          </div>

          <div className="grid relative">
            <div
              ref={imageContainer}
              className="flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none"
            >
              {data.image.map((img, index) => (
                <div
                  className="w-20 h-20 cursor-pointer shadow-md"
                  key={img + index}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    onClick={() => setImage(index)}
                    className="w-full h-full object-scale-down"
                  />
                </div>
              ))}
            </div>
            <div className="w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center">
              <button
                onClick={handleScrollLeft}
                className="z-10 bg-white p-1 rounded-full shadow-lg"
              >
                <FaAngleLeft />
              </button>
              <button
                onClick={handleScrollRight}
                className="z-10 bg-white p-1 rounded-full shadow-lg"
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Name, Price, Cart Button */}
        <div className="p-4 lg:pl-7 text-base lg:text-lg">
          <p className="bg-green-300 w-fit px-2 rounded-full">10 Min</p>
          <h2 className="text-lg font-semibold lg:text-3xl">{data.name}</h2>
          <p>{data.unit}</p>

          <Divider />

          <div>
            <p>Price</p>
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
                <p className="font-semibold text-lg lg:text-xl">
                  {DisplayPriceInRupees(
                    pricewithDiscount(data.price, data.discount)
                  )}
                </p>
              </div>
              {data.discount && (
                <>
                  <p className="line-through">
                    {DisplayPriceInRupees(data.price)}
                  </p>
                  <p className="font-bold text-green-600 lg:text-2xl">
                    {data.discount}%{" "}
                    <span className="text-base text-neutral-500">Discount</span>
                  </p>
                </>
              )}
            </div>
          </div>

          {data.stock === 0 ? (
            <p className="text-lg text-red-500 my-2">Out of Stock</p>
          ) : (
            <div className="my-4">
              <AddToCartButton data={data} />
            </div>
          )}

          {/* Why shop section */}
          <h2 className="font-semibold text-lg lg:text-2xl mt-6">
            Why shop from binkeyit?
          </h2>
          <div className="my-4">
            {[image1, image2, image3].map((img, i) => {
              const titles = [
                "Superfast Delivery",
                "Best Prices & Offers",
                "Wide Assortment",
              ];
              const descs = [
                "Get your order delivered to your doorstep at the earliest from dark stores near you.",
                "Best price destination with offers directly from the manufacturers.",
                "Choose from 5000+ products across food, personal care, household & other categories.",
              ];
              return (
                <div key={i} className="flex items-center gap-4 my-4">
                  <img src={img} alt={titles[i]} className="w-20 h-20" />
                  <div className="text-sm">
                    <div className="font-semibold">{titles[i]}</div>
                    <p>{descs[i]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Description */}
        {data.description && (
          <div>
            <p className="font-semibold">Description</p>
            <p className="text-base">{data.description}</p>
          </div>
        )}

        {/* Key Features */}
        {moreDetails["Key Features"] && (
          <div>
            <p className="font-semibold">Key Features</p>
            <p className="text-base">{moreDetails["Key Features"]}</p>
          </div>
        )}

        {/* Other dynamic fields */}
        {Object.entries(moreDetails)
          .filter(([key]) => !ignoreKeys.includes(key))
          .map(([key, value], idx) => (
            <div key={idx}>
              <p className="font-semibold">{key}</p>
              <p className="text-base">{value}</p>
            </div>
          ))}

        {/* Static Disclaimer - always right column */}
        <div className="lg:col-start-2">
          <p className="font-semibold">Disclaimer</p>
          <p className="text-base">
            Every effort is made to maintain the accuracy of all information. However, actual product packaging and materials may contain more and/or different information. It is recommended not to solely rely on the information presented.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;
