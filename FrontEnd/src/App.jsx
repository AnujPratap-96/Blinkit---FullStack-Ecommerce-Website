import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import GlobalProvider from "./provider/GlobalProvider";
import CartMobileLink from "./components/CartMobile";
import useFetchUserDetails from "./hooks/useFetchUserDetails";
import useFetchCategory from "./hooks/useFetchCategory";
import useFetchSubCategory from "./hooks/useFetchSubCategory";

function App() {
  const location = useLocation();

  useFetchUserDetails();
  useFetchCategory();
  useFetchSubCategory();

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[78vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {location.pathname !== "/checkout" && <CartMobileLink />}
    </GlobalProvider>
  );
}

export default App;
