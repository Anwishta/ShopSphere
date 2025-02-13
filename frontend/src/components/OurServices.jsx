import React from "react";
import { Truck, Clock, ShieldCheck, ShoppingBag } from "lucide-react";
import { useTheme } from "../context/ThemeContext"; // Import the theme context

const services = [
  {
    icon: <Truck className="w-10 h-10 text-blue-500" />,
    title: "Free Shipping",
    description: "Enjoy free shipping on all orders with no minimum spend.",
  },
  {
    icon: <Clock className="w-10 h-10 text-green-500" />,
    title: "Fast Delivery",
    description: "Get your orders delivered in record time with our express service.",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 text-yellow-500" />,
    title: "Secure Payments",
    description: "We ensure secure payment methods for a safe transaction experience.",
  },
  {
    icon: <ShoppingBag className="w-10 h-10 text-red-500" />,
    title: "Quality Products",
    description: "Shop with confidence knowing our products are top-notch.",
  },
];

const OurServices = () => {
  const { isDarkMode } = useTheme(); // Get the current theme state

  return (
      <section
        className={`py-12 ${
        isDarkMode ? "bg-gray-850 text-gray-100" : "bg-gray-100 text-gray-800"
        }`}
      >
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Services</h2>
        <p className="mb-12">
          Explore the range of services we offer, including free shipping, fast delivery,
          and many more customer-focused benefits.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-md p-6 transition-shadow ${
                isDarkMode
                  ? "bg-gray-700 hover:shadow-gray-600"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
