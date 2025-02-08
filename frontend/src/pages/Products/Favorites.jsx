import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useCart } from "../../components/CartContext";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { useState, useMemo } from "react";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites?.favorites || []);
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Optimize sorting using useMemo to avoid unnecessary recalculations
  const filteredFavorites = useMemo(() => {
    return [...favorites].sort((a, b) => {
      if (sortBy === "cheapest") return a.price - b.price;
      if (sortBy === "expensive") return b.price - a.price;
      return 0; // No sorting
    });
  }, [favorites, sortBy]);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-wide mb-2">
            Your Favorites
          </h1>
          <p className="text-xl text-white py-4">
            {favorites.length === 0
              ? "No favorite products yet"
              : `${favorites.length} favorite products`}
          </p>
        </div>


        {/* Custom Sorting Dropdown */}
        <div className="text-center mb-8 relative inline-block">
          <label className="text-white font-semibold mr-4">Sort By: Price</label>
          <div
            className="px-4 py-2 rounded bg-gray-300 text-black font-semibold cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-400"
            onClick={() => setIsOpen(!isOpen)}

        <div className="text-right">
          <label
            htmlFor="sortBy"
            className="text-white font-semibold mr-4"
          >
            Sort By:
          </label>
          <select
            id="sortBy"
            className="px-4 py-2 rounded bg-gray-300 text-black font-semibold cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mx-16 my-16">
          {filteredFavorites.length > 0 ? (
            filteredFavorites.map((product) => (
              <div
                key={product.id}
                className="bg-pink-500 shadow-md rounded-lg p-4 transform hover:scale-105 hover:shadow-lg transition duration-300 relative"
              >
                <h2 className="text-xl font-bold text-white mb-2 pr-8">
                  {product.name}
                </h2>
                <p className="text-lg text-white font-semibold mb-4">
                  ${product.price}
                </p>

                {/* Image with aspect ratio fix */}
                <div className="w-full aspect-square bg-gray-200 rounded-md flex items-center justify-center text-gray-500 relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain w-full h-full"
                  />
                  <HeartIcon className="absolute top-2 right-2 cursor-pointer z-10" product={product} />
                </div>

                {/* Updated Add to Cart button styling */}
                <button
                  onClick={() => {
                    addToCart(product);
                    toast.success("Added to cart");
                  }}
                  className="w-full mt-4 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-transform transform hover:scale-105"
                >
                  Add to Cart
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center">
              <p className="text-white text-xl font-semibold mb-4">
                Your favorites list is empty 😔
              </p>
              <Link
                to="/shop"
                className="bg-pink-500 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-pink-600 cursor-pointer"
              >
                Go Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;