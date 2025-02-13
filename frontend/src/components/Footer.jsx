import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn,faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


const validateEmail = (email) => {
  if (!email) {
    toast.error("please enter a valid email address");
    return false;
  }

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  toast.error('Please enter a valid email address');
  return false;
  }
  return true;
};

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate the email before submitting the form
    if (!validateEmail(email)) {
      setIsSubmitting(false);
      return ;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className={`${
      isDarkMode 
        ? 'bg-gradient-to-t from-gray-900 to-gray-800' 
        : 'bg-gradient-to-t from-gray-100 to-white'
    } ${
      isDarkMode ? 'text-gray-200' : 'text-gray-700'
    }`}>
      <div className="container mx-auto px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className={`text-lg font-bold ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`}>ShopSphere</h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
              Elevating your shopping experience with curated fashion that speaks your style.
            </p>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-rose-500 transition-colors duration-200`}>
              <Link to='/termsAndConditions'>Terms and Conditions</Link>
            </div>
            <div className="flex space-x-5 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebookF} className={`${isDarkMode ? 'text-rose-400' : 'text-rose-500'} text-xl hover:text-rose-600 transition-all duration-300 hover:scale-110`} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FontAwesomeIcon icon={faXTwitter} className={`${isDarkMode ? 'text-rose-400' : 'text-rose-500'} text-xl hover:text-rose-600 transition-all duration-300 hover:scale-110`} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} className={`${isDarkMode ? 'text-rose-400' : 'text-rose-500'} text-xl hover:text-rose-600 transition-all duration-300 hover:scale-110`} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedinIn} className={`${isDarkMode ? 'text-rose-400' : 'text-rose-500'} text-xl hover:text-rose-600 transition-all duration-300 hover:scale-110`} />
              </a>
            </div>
          </div>

          <div className="space-y-3 col-span-2 flex justify-center gap-8">
            <div className="grid grid-cols-2 gap-8">
              <ul className="space-y-3">
                <li>
                  <a href="/help" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-rose-500 transition-colors duration-200`}>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/returns" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-rose-500 transition-colors duration-200`}>
                    Returns & Refunds
                  </a>
                </li>
                <li>
                  <a href="/shipping" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-rose-500 transition-colors duration-200`}>
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="/contact" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-rose-500 transition-colors duration-200`}>
                    Contact Us
                  </a>
                </li>
              </ul>

              <ul className="space-y-3">
                <li>
                  <Link to="/shop" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-rose-500 transition-colors duration-200`}>
                    Shop All Products
                  </Link>
                </li>
                <li>
                  <Link to="/offers" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-rose-500 transition-colors duration-200`}>
                    Offers
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-rose-500 transition-colors duration-200`}>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} hover:text-rose-500 transition-colors duration-200`}>
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className={`text-lg font-bold ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`}>Stay Updated!</h4>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Subscribe for exclusive deals and updates!</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 rounded-lg border border-transparent focus:border-rose-500 outline-none transition-all duration-300 ${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${
                  isDarkMode 
                    ? 'bg-rose-500 hover:bg-rose-600' 
                    : 'bg-rose-600 hover:bg-rose-700'
                } text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className={`text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'} mt-4`}>
          © {new Date().getFullYear()} ShopSphere, All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;