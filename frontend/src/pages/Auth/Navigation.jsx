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
import { FaHeart, FaBlog } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Navigation.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../redux/api/userApiSlice";
import { logout } from "../redux/features/auth/authSlice";
import FavoriteCount from "../Products/FavoriteCount";
import { toast } from "react-toastify";
import { useTheme } from '../../context/ThemeContext';
import { BsSun, BsMoon } from 'react-icons/bs';

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const { isDarkMode, toggleTheme } = useTheme();

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
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-black text-white transform ${showMobileMenu ? "translate-x-0" : "-translate-x-full"
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
                <div className="space-y-1">
                  <div className="flex items-center space-x-4 p-2 hover:bg-gray-800 rounded-lg">
                    <AiOutlineUserAdd size={26} />
                    <span className="text-lg">REGISTER</span>
                  </div>
                <div className="pl-10 space-y-1">
                <Link
                  to="/register"
                  className="block text-sm p-2 hover:bg-gray-800 rounded-lg"
                  onClick={() => setShowMobileMenu(false)}
                  >
                  Customer
                </Link>
                <Link
                  to="/distributor/register"
                  className="block text-sm p-2 hover:bg-gray-800 rounded-lg"
                  onClick={() => setShowMobileMenu(false)}
                   >
                  Distributor
                </Link>
                </div>
              </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
        <div className={`hidden lg:flex fixed inset-y-0 left-0 flex-col justify-between p-5 h-[100vh] overflow-visible transition-all duration-300 ease-in-out z-40
        ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`} 
        id="navigation-container">
        <div className="flex flex-col space-y-8">
          {/* Main navigation links */}
          <Link to="/" className="flex items-center hover:translate-x-2 transition-transform p-2">
            <AiOutlineHome className="nav-icon" />
            <span className="nav-item-name ml-4">HOME</span>
          </Link>
          <Link to="/shop" className="flex items-center hover:translate-x-2 transition-transform p-2">
            <AiOutlineShopping className="nav-icon" />
            <span className="nav-item-name ml-4">SHOP</span>
          </Link>
          <Link to="/cart" className="flex items-center hover:translate-x-2 transition-transform p-2">
            <AiOutlineShoppingCart className="nav-icon" />
            <span className="nav-item-name ml-4">CART</span>
          </Link>
          <Link to="/favorite" className="flex items-center hover:translate-x-2 transition-transform p-2">
            <FaHeart className="nav-icon" />
            <span className="nav-item-name ml-4">FAVORITE <FavoriteCount /></span>
          </Link>
          <Link to="/blogs" className="flex items-center hover:translate-x-2 transition-transform p-2">
            <FaBlog className="nav-icon" />
            <span className="nav-item-name ml-4">BLOGS</span>
          </Link>
          <button onClick={toggleTheme} className="flex items-center hover:translate-x-2 transition-transform p-2">
            {isDarkMode ? (
              <>
                <BsSun className="nav-icon" />
                <span className="nav-item-name ml-4">Light Mode</span>
              </>
            ) : (
              <>
                <BsMoon className="nav-icon" />
                <span className="nav-item-name ml-4">Dark Mode</span>
              </>
            )}
          </button>
        </div>

        <div className="auth-buttons">
          {userInfo ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center hover:translate-x-2 transition-transform p-2 w-full"
              >
                <span className="nav-icon">👤</span>
                <span className="nav-item-name ml-4">{userInfo.username}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  {userInfo.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logoutHandler();
                      setDropdownOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Link to="/login" className="flex items-center hover:translate-x-2 transition-transform p-2">
                <AiOutlineLogin className="nav-icon" />
                <span className="nav-item-name">LOGIN</span>
              </Link>
              <div className="space-y-1">
                <div className="flex items-center hover:translate-x-2 transition-transform p-2">
                  <AiOutlineUserAdd className="nav-icon" />
                    <span className="nav-item-name ml-4">REGISTER</span>
                </div>
              <div className="ml-10 space-y-1">
                <Link
                  to="/register"
                  className="block text-sm px-2 py-1 hover:text-rose-500 transition"
                  >
                  Customer
                </Link>
                <Link
                  to="/distributor/register"
                  className="block text-sm px-2 py-1 hover:text-rose-500 transition"
                  >
                  Distributor
                </Link>
              </div>
            </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;