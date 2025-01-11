import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Navigation.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/api/userApiSlice";
import { logout } from "../redux/features/auth/authSlice";
import FavoriteCount from "../Products/FavoriteCount";
import { toast } from "react-toastify";
import { FaBlog } from "react-icons/fa";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      toast.info("Logged Out")
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Hamburger Menu Button - Only visible on mobile */}
      <button
        className="lg:hidden fixed top-6 left-6 z-50 p-2 text-white hover: rounded-lg transition-colors"
        onClick={toggleMobileMenu}
      >
        {showMobileMenu ? (
          <AiOutlineClose size={24} />
        ) : (
          <AiOutlineMenu size={24} />
        )}
      </button>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-black text-white transform ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 overflow-hidden`}
      >
        <div className="flex flex-col h-full p-6 mt-16">
          {/* Main Navigation Links */}
          <div className="flex flex-col space-y-6">
            <Link 
              to="/" 
              className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineHome size={26} />
              <span className="text-lg">HOME</span>
            </Link>
            <Link 
              to="/shop" 
              className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineShopping size={26} />
              <span className="text-lg">SHOP</span>
            </Link>
            <Link 
              to="/cart" 
              className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg"
              onClick={() => setShowMobileMenu(false)}
            >
              <AiOutlineShoppingCart size={26} />
              <span className="text-lg">CART</span>
            </Link>
            <Link 
              to="/favorite" 
              className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg"
              onClick={() => setShowMobileMenu(false)}
            >
              <FaHeart size={26} />
              <span className="text-lg">FAVORITE</span>
              <FavoriteCount />
            </Link>
            <Link 
              to="/blogs" 
              className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg"
              onClick={() => setShowMobileMenu(false)}
            >
              <FaBlog size={26} />
              <span className="text-lg">BLOGS</span>
            </Link>
          </div>

          {/* User Section */}
          <div className="mt-6 border-t border-gray-700 pt-6">
            {userInfo ? (
              <div className="space-y-4">
                <div className="pb-4">
                  <span className="text-lg text-white">{userInfo.username}</span>
                </div>
                {userInfo.isAdmin && (
                  <div className="space-y-3">
                    <Link 
                      to="/admin/dashboard" 
                      className="block p-2 hover:bg-gray-800 rounded-lg"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/productlist" 
                      className="block p-2 hover:bg-gray-800 rounded-lg"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Products
                    </Link>
                    <Link 
                      to="/admin/categorylist" 
                      className="block p-2 hover:bg-gray-800 rounded-lg"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Category
                    </Link>
                    <Link 
                      to="/admin/orderlist" 
                      className="block p-2 hover:bg-gray-800 rounded-lg"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Orders
                    </Link>
                    <Link 
                      to="/admin/userlist" 
                      className="block p-2 hover:bg-gray-800 rounded-lg"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Users
                    </Link>
                  </div>
                )}
                <Link 
                  to="/profile" 
                  className="block p-2 hover:bg-gray-800 rounded-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    logoutHandler();
                    setShowMobileMenu(false);
                  }} 
                  className="w-full text-left p-2 hover:bg-gray-800 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link 
                  to="/login" 
                  className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <AiOutlineLogin size={26} />
                  <span className="text-lg">LOGIN</span>
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <AiOutlineUserAdd size={26} />
                  <span className="text-lg">REGISTER</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div
        className="hidden lg:flex fixed inset-y-0 left-0 flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] h-[100vh] transition-all duration-300 ease-in-out z-40"
        id="navigation-container"
      >
        <div className="flex flex-col justify-center space-y-8">
          <Link to="/" className="flex items-center hover:translate-x-2 transition-transform p-2">
            <AiOutlineHome className="mr-4" size={26} />
            <span className="hidden nav-item-name text-lg">HOME</span>
          </Link>
          <Link to="/shop" className="flex items-center hover:translate-x-2 transition-transform p-2">
            <AiOutlineShopping className="mr-4" size={26} />
            <span className="hidden nav-item-name text-lg">SHOP</span>
          </Link>
          <Link to="/cart" className="flex items-center hover:translate-x-2 transition-transform p-2">
            <AiOutlineShoppingCart className="mr-4" size={26} />
            <span className="hidden nav-item-name text-lg">CART</span>
          </Link>
          <Link to="/favorite" className="flex items-center hover:translate-x-2 transition-transform p-2">
            <FaHeart className="mr-4" size={26} />
            <span className="hidden nav-item-name text-lg">FAVORITE</span>
            <FavoriteCount />
          </Link>
          <Link to="/blogs" className="flex items-center hover:translate-x-2 transition-transform p-2">
            <FaBlog className="mr-4" size={26} />
            <span className="hidden nav-item-name text-lg">BLOGS</span>
          </Link>
        </div>

        <div
          className="hidden lg:flex fixed inset-y-0 left-0 flex-col justify-between p-4 text-white bg-black w-[4%] hover:w-[15%] h-[100vh] transition-all duration-300 ease-in-out z-40"
          id="navigation-container"
        >
          <div className="flex flex-col justify-center space-y-8">
            <Link to="/" className="flex items-center hover:translate-x-2 transition-transform p-2">
              <AiOutlineHome size={26} />
              <span className="nav-item-name text-lg ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">HOME</span>
            </Link>
            <Link to="/shop" className="flex items-center hover:translate-x-2 transition-transform p-2">
              <AiOutlineShopping size={26} />
              <span className="nav-item-name text-lg ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">SHOP</span>
            </Link>
            <Link to="/cart" className="flex items-center hover:translate-x-2 transition-transform p-2">
              <AiOutlineShoppingCart size={26} />
              <span className="nav-item-name text-lg ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">CART</span>
            </Link>
            <Link to="/favorite" className="flex items-center hover:translate-x-2 transition-transform p-2">
              <FaHeart size={26} />
              <span className="nav-item-name text-lg ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                FAVORITE
                <FavoriteCount />
              </span>
            </Link>
            <Link to="/blogs" className="flex items-center hover:translate-x-2 transition-transform p-2">
              <FaBlog className="mr-4" size={26} />
              <span className="nav-item-name text-lg ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">BLOGS</span>
            </Link>
          </div>

          <div className="relative">
            {userInfo ? (
              <button
                onClick={toggleDropdown}
                className="flex items-center text-gray-8000 focus:outline-none p-2 w-full hover:bg-gray-800 rounded-lg"
              >
                <span className="text-white text-lg">{userInfo.username}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-2 ${dropdownOpen ? "rotate-180" : ""} transition-transform`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
              </button>
            ) : (
              <div className="space-y-6">
                <Link to="/login" className="flex items-center hover:translate-x-2 transition-transform p-2">
                  <AiOutlineLogin size={26} />
                  <span className="nav-item-name text-lg ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">LOGIN</span>
                </Link>
                <Link to="/register" className="flex items-center hover:translate-x-2 transition-transform p-2">
                  <AiOutlineUserAdd size={26} />
                  <span className="nav-item-name text-lg ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">REGISTER</span>
                </Link>
              </div>
            )}

            {dropdownOpen && userInfo && (
              <ul className={`absolute right-0 mt-2 mr-14 space-y-1 bg-gray-800 text-gray-300 rounded-lg overflow-hidden
              ${!userInfo.isAdmin ? "-top-20" : "-top-80"}`}>
                {userInfo.isAdmin && (
                  <>
                    <li>
                      <Link to="/admin/dashboard" className="block px-6 py-3 hover:bg-gray-700">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/productlist" className="block px-6 py-3 hover:bg-gray-700">
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/categorylist" className="block px-6 py-3 hover:bg-gray-700">
                        Category
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/orderlist" className="block px-6 py-3 hover:bg-gray-700">
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/userlist" className="block px-6 py-3 hover:bg-gray-700">
                        Users
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="/profile" className="block px-6 py-3 hover:bg-gray-700">
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={logoutHandler} className="w-full text-left px-6 py-3 hover:bg-gray-700">
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;