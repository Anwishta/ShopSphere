import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../pages/redux/api/productApiSlice";
import Loader from "../components/Loader";
import Header from "../components/Header";
import Product from "./Products/Product";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import HomeImage from "../assets/HomeFinal.png";
import NewsletterSection from "../components/NewsLetter";
import { useTheme } from '../context/ThemeContext';
import OurServices from "../components/OurServices";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });
  const { isDarkMode } = useTheme();

  const [products, setProducts] = useState([]);

  // const [Product , setProducts] = useState();
  // useEffect(() => {
  //   if (data && data.products) {
  //     setProducts(data.products);
  //   }
  // }, [data]);


  // useEffect(() => {
  //   if (isError) {
  //     toast.error("Something went wrong! Please try again.");
  //   }
  // }, [isError]);

  return (
    <>
      {!keyword && <Header />}
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} min-h-screen flex flex-col ml-10`}>
          <section className={`flex flex-col lg:flex-row items-center w-full mb-10 justify-between ${isDarkMode ? 'bg-gradient-to-t from-gray-900 to-gray-800' : 'bg-gradient-to-t from-white to-gray-100'
            }`}>
            <div className="text-center lg:text-left max-w-2xl m-16">
              <h1 className={`text-6xl font-sans font-extrabold mb-6 animate-fade-in-up ${isDarkMode ? 'text-gray-100' : 'text-gray-800'
                }`}>
                Shop the Latest Styles,
                <span className={`${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`}>Anytime</span>
              </h1>
              <p className={`text-lg mb-8 animate-fade-in-up delay-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                Discover the trendiest apparel, accessories, and more at prices
                you'll love. Your new look is just a click away!
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 overflow-hidden">
                <button className={`${isDarkMode
                    ? 'bg-rose-500 hover:bg-rose-600'
                    : 'bg-rose-600 hover:bg-rose-700'
                  } text-white px-6 py-3 rounded-md shadow-md transition duration-300`}>
                  <Link to="/shop">Start Shopping</Link>
                </button>
                <button className={`bg-transparent border transition duration-300 px-6 py-3 rounded-md shadow-md ${isDarkMode
                    ? 'text-rose-400 border-rose-400 hover:bg-rose-400 hover:text-gray-900'
                    : 'text-rose-600 border-rose-600 hover:bg-rose-600 hover:text-white'
                  }`}>
                  <Link to="/offers">Explore Deals</Link>
                </button>
                <button className={`bg-transparent border transition duration-300 px-6 py-3 rounded-md shadow-md ${isDarkMode
                    ? 'text-rose-400 border-rose-400 hover:bg-rose-400 hover:text-gray-900'
                    : 'text-rose-600 border-rose-600 hover:bg-rose-600 hover:text-white'
                  }`}>
                  <Link to="/contributors">Meet our Contributors</Link>
                </button>
              </div>
            </div>

            <div className="mt-10 lg:mt-0 animate-bounce-y">
              <img
                src={HomeImage}
                alt="Featured Product"
                className="max-w-full rounded-lg"
              />
            </div>
          </section>
          {/* Add OurServices component here */}
          <OurServices />
          <Footer />
        </div>
      )}
    </>
  );
};

export default Home;

const styles = `
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceY {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 1s ease-out forwards;
}

.animate-fade-in-up.delay-2 {
  animation-delay: 0.2s;
}

.animate-bounce-y {
  animation: bounceY 2s infinite ease-in-out;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);