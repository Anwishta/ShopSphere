import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { useGetProductByIdQuery } from '../redux/api/productApiSlice';
import { useAddCartMutation } from '../redux/api/cartSlice';
import { toast } from 'react-toastify';
import HeartIcon from './HeartIcon';
import Loader from '../../components/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const { isDarkMode } = useTheme();
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const [addCart] = useAddCartMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = async () => {
    if (!userInfo) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addCart({
        userId: userInfo._id,
        productId: product._id,
        quantity,
      }).unwrap();
      toast.success('Product added to cart');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add to cart');
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Product Section */}
        <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col">
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product?.additionalImages?.[selectedImage] || product?.image}
                  alt={product?.name}
                  className="w-full h-full object-center object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <HeartIcon product={product} />
                </div>
              </div>
            </div>

            {/* Image selector */}
            {product?.additionalImages?.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[product.image, ...product.additionalImages].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                      selectedImage === idx ? 'ring-2 ring-pink-500' : 'ring-1 ring-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-center object-cover hover:opacity-75"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight">{product?.name}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl">
                ${product?.price}
                <span className="ml-2 text-sm text-gray-500">USD</span>
              </p>
            </div>

            {/* Stock Status */}
            <div className="mt-6">
              <div className="flex items-center">
                <div className={`rounded-full h-3 w-3 ${product?.quantity > 0 ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <p className="ml-2 text-sm">
                  {product?.quantity > 0 ? `In Stock (${product?.quantity} available)` : 'Out of Stock'}
                </p>
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-6">
              <h3 className="text-lg font-medium">Description</h3>
              <div className={`mt-2 prose prose-sm ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                <p>{product?.description}</p>
              </div>
            </div>

            {/* Specifications */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium">Specifications</h3>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className={isDarkMode ? "text-gray-300" : "text-gray-500"}>Brand</p>
                  <p className="font-medium">{product?.brand}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className={isDarkMode ? "text-gray-300" : "text-gray-500"}>Category</p>
                  <p className="font-medium">{product?.category?.name || 'None'}</p>
                </div>
                {Object.entries(product?.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <p className={isDarkMode ? "text-gray-300" : "text-gray-500"}>{key}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <div className="mt-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product?.quantity}
                  className={`flex-1 w-full rounded-md py-3 px-8 text-base font-medium text-white 
                    ${product?.quantity === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-pink-600 hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      : "bg-pink-500 hover:bg-pink-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    } transition-colors duration-200`}
                >
                  {product?.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16 lg:mt-24">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          {product?.reviews?.length === 0 ? (
            <p className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {product?.reviews?.map((review) => (
                <div
                  key={review._id}
                  className={`p-6 rounded-lg transform hover:scale-[1.02] transition-all duration-200 ${
                    isDarkMode ? "bg-gray-800" : "bg-white shadow-lg"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-5 h-5 ${
                            index < review.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
