import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import HeartIcon from "../Products/HeartIcon";

import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useGetProductsQuery, useCreateProductMutation } from '../redux/api/productApiSlice';
import { useAddCartMutation } from '../redux/api/cartSlice';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';





export default function ShopPage() {

  const { isDarkMode } = useTheme();
  const { keyword } = useParams();
  const { data, isLoading: productsLoading, isError } = useGetProductsQuery({ keyword });
  const [products, setProducts] = useState([]);

  const [addCart, { isLoading: cartLoading }] = useAddCartMutation();
  const [addProduct, { isLoading: productLoading }] = useCreateProductMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [cart, setCartDetails] = useState({
    userId: '',
    productId: '',
    quantity: 1,
  });

  const [showAddModal, setShowAddModal] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      brand: '',
      description: '',
      price: '',
      quantity: '',
      category: '',
      image: null
    }
  });

  useEffect(() => {
    if (data && data.products) {
      setProducts(data.products);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error('Something went wrong! Please try again.');
    }
  }, [isError]);

  // Add useEffect to handle body scroll
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddModal]);

  const handleCart = async (product) => {
    if (!userInfo || !userInfo._id) {
      toast.error('Login to add product to cart!');
      return;
    }


    cart.userId = userInfo._id;
    cart.productId = product._id;


    if (cartLoading) return; // Prevent duplicate requests

    try {
      console.log(userInfo._id);
      const res = await addCart(cart).unwrap();
      if (res.message) {
        console.log(res.message);
        console.log(cart);
        toast.error(res.message);
        return;
      }
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add product to cart!');
    }
  };

  const handleAddProduct = async (formData) => {
    const finalFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image') {
        if (formData[key][0]) {
          finalFormData.append(key, formData[key][0]);
        }
      } else {
        finalFormData.append(key, formData[key]);
      }
    });

    try {
      console.log(finalFormData)
      const response = await addProduct(finalFormData);
      console.log(response)
      if (response?.data) {
        toast.success('Product added successfully!');
        setShowAddModal(false);
        reset();
        // Refresh products list
        if (data?.refetch) {
          data.refetch();
        }
      } else {
        toast.error('Failed to add product');
      }
    } catch (error) {
      toast.error('Error adding product');
    }
  };

  const ProductModal = () => {
    const [selectedFileName, setSelectedFileName] = useState('');

    // Add this function to handle file selection
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setSelectedFileName(file.name);
      } else {
        setSelectedFileName('');
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm
                      animate-[fadeIn_0.3s_ease-in-out]">
        <div className="w-full max-w-2xl mx-auto bg-black/60 rounded-lg border border-pink-500/40 p-4 sm:p-6 md:p-8 my-4 sm:my-8
                        animate-[slideIn_0.3s_ease-in-out] shadow-xl"
          style={{
            backdropFilter: "blur(300px)",
            WebkitBackdropFilter: "blur(300px)",
          }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 sm:mb-6 
                         animate-[fadeIn_0.5s_ease-in-out]">
            Add New Product
          </h2>
          <form onSubmit={handleSubmit(handleAddProduct)} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="form-control">
                <label className="label text-sm font-medium">
                  <span className="label-text text-white">Product Name</span>
                </label>
                <input
                  {...register('name', { required: 'Product name is required' })}
                  type="text"
                  placeholder="Enter product name"
                  className="input w-full p-2.5 bg-transparent border border-white/30 rounded 
                           transition-all duration-200 focus:border-pink-500 text-white placeholder-gray-400"
                />
              </div>

              <div className="form-control">
                <label className="label text-sm font-medium">
                  <span className="label-text text-white">Brand</span>
                </label>
                <input
                  {...register('brand', { required: 'Brand is required' })}
                  type="text"
                  placeholder="Enter brand name"
                  className="input w-full p-2.5 bg-transparent border border-white/30 rounded 
                           transition-all duration-200 focus:border-pink-500 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label text-sm font-medium">
                <span className="label-text text-white">Description</span>
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                placeholder="Enter product description"
                className="input w-full p-2.5 bg-transparent border border-white/30 rounded 
                           transition-all duration-200 focus:border-pink-500 text-white placeholder-gray-400 h-20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="form-control">
                <label className="label text-sm font-medium">
                  <span className="label-text text-white">Price</span>
                </label>
                <input
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  type="number"
                  placeholder="Enter price"
                  className="input w-full p-2.5 bg-transparent border border-white/30 rounded 
                           transition-all duration-200 focus:border-pink-500 text-white placeholder-gray-400"
                />
              </div>

              <div className="form-control">
                <label className="label text-sm font-medium">
                  <span className="label-text text-white">Quantity</span>
                </label>
                <input
                  {...register('quantity', {
                    required: 'Quantity is required',
                    min: { value: 0, message: 'Quantity must be positive' }
                  })}
                  type="number"
                  placeholder="Enter quantity"
                  className="input w-full p-2.5 bg-transparent border border-white/30 rounded 
                           transition-all duration-200 focus:border-pink-500 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              <div className="form-control">
                <label className="label text-sm font-medium">
                  <span className="label-text text-white">Category</span>
                </label>
                <input
                  {...register('category', { required: 'Category is required' })}
                  type="text"
                  placeholder="Enter category"
                  className="input w-full p-2.5 bg-transparent border border-white/30 rounded 
                           transition-all duration-200 focus:border-pink-500 text-white placeholder-gray-400
                           hover:border-pink-500/50"
                />
              </div>

              <div className="form-control">
                <label className="label text-sm font-medium">
                  <span className="label-text text-white">Product Image</span>
                </label>
                <div className="relative">
                  <input
                    {...register('image', { required: 'Product image is required' })}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="fileInput"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="fileInput"
                    className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 
                             text-white rounded cursor-pointer hover:from-pink-600 hover:to-pink-700
                             transition-all duration-300 ease-in-out transform hover:scale-[1.02]
                             shadow-md hover:shadow-pink-500/25"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {selectedFileName ? 'Change File' : 'Choose File'}
                  </label>
                  {selectedFileName && (
                    <div className="mt-2 text-sm text-white/80 break-all">
                      <span className="font-medium">Selected file:</span> {selectedFileName}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  reset();
                }}
                className="w-full sm:w-auto px-6 py-2.5 bg-gray-600 text-white rounded font-semibold
                         transition-all duration-300 ease-in-out hover:bg-gray-700 hover:shadow-lg
                         transform hover:scale-[1.02]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 
                         text-white rounded font-semibold transition-all duration-300 ease-in-out 
                         hover:from-pink-600 hover:to-pink-700 hover:shadow-lg transform hover:scale-[1.02]"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Add these keyframes to your global CSS or at the top of your component
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold tracking-wide mb-2 ${isDarkMode ? "text-white" : "text-black"}`}>
            Shop
          </h1>
          <p className={`text-lg py-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Explore our entire collection here!
          </p>
        </div>

        {userInfo?.isDistributor && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowAddModal(true)}
              className={`px-6 py-3 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform hover:scale-105
            ${isDarkMode ? "bg-pink-600 hover:bg-pink-700 text-white shadow-pink-500/50"
                  : "bg-pink-500 hover:bg-pink-600 text-black shadow-lg"}`}
            >
              Add New Product
            </button>
          </div>
        )}

        <Link
          to="/specialshop"
          className={`absolute top-10 right-40 font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105
        ${isDarkMode ? "bg-gradient-to-r from-gray-800 to-pink-600 text-white"
              : "bg-gradient-to-r from-white to-pink-500 text-black"}`}
        >
          Tap to explore exclusive products
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mx-16 my-16">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className={`shadow-md rounded-lg p-4 transform hover:scale-105 hover:shadow-lg transition duration-300 relative ${isDarkMode ? "bg-gray-800 text-white" : "bg-pink-500 text-black"}`}>
                <Link to={`/product/${product._id}`}>
                  <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                  <p className="text-lg font-semibold mb-4">${product.price}</p>
                  <div className={`w-full h-40 rounded-md flex items-center justify-center relative ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-500"}`}>
                    <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
                  </div>
                </Link>
                <HeartIcon product={product} />
                <button
                  onClick={() => handleCart(product)}
                  className={`w-full mt-4 font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${isDarkMode ? "bg-gray-200 hover:bg-gray-300 text-black" : "bg-white hover:bg-gray-100 text-pink-500"}`}
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <div className={`col-span-full text-center text-lg ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
              {productsLoading ? "Loading..." : "No products found."}
            </div>
          )}
        </div>

        {showAddModal && <ProductModal />}
      </div>
    </div>

  );
}
