
import { FaChevronRight } from "react-icons/fa";
import { ProductCard } from "../../components/card1";
import { ProductCard2 } from "../../components/card2";
import { ProductCard3 } from "../../components/card3";
import { ProductWrapper } from "../../components/product-wrapper";
import { Banners } from "./banners";
import { useQuery } from '@tanstack/react-query';
import { Category } from "./category";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const fetchData = async () => {
    const response = await fetch("/data.json");
    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }
    return response.json();
};


export default function Offer() {
    const { isDarkMode } = useTheme();

    const { data, error, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: fetchData,
    });
    const [allProducts, setAllproducts] = useState([])
    const [header, setHeader] = useState();
    const [show, setShow] = useState(true);

    const handleView = () => {
        setAllproducts(data);
        setShow(false);

    }

    const categorySearch = (category) => {
        // Check if category and data exist before proceeding
        if (!category) return;
        console.log("category")
        const filteredCategory = data.filter((item) =>
            item.category.toLowerCase() === category.toLowerCase()
        );
        setAllproducts(filteredCategory);
    };

    console.log(allProducts)

    return (
        <div className={`lg:ml-[75px] md:ml-10  px-3 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
            <Banners />
            <div className="flex mt-5 flex-col gap-2">
                <h1 className={`text-xl font-semibold md:hidden ${isDarkMode ? "text-gray-300" : "text-black"}`}>
                    Shops By Category
                </h1>
                <Category onclick={categorySearch} />
            </div>

            {allProducts?.length >= 1 ? (
                <ProductWrapper
                    view={allProducts}
                    header={header}
                    onclick={handleView}
                    scrollable={false}
                    className="mt-10"
                >
                    {allProducts.map((item, index) => (
                        <ProductCard
                            key={index}
                            scrollable={false}
                            itemName={item.name}
                            discount={item.offer}
                            imageUrl={item.image}
                        />
                    ))}
                </ProductWrapper>
            ) : (
                <div className="flex flex-col gap-5 mb-10">
                    <ProductWrapper view={false} scrollable={true} header="Seasoned Specials" className="">
                        <div className="flex items-center flex-col flex-grow flex-shrink-0 md:basis-[15%] basis-[40%]">
                            <h3 className="text-center text-sm font-medium">
                                Premium product Incredible discount above 50% off
                            </h3>
                            <p className="mt-5 flex items-center gap-2">
                                <span>Shop Now</span>
                                <span className="flex">
                                    <FaChevronRight />
                                    <FaChevronRight />
                                </span>
                            </p>
                        </div>
                        {data?.map((item, index) => <ProductCard3 key={index} />)}
                    </ProductWrapper>

                    <ProductWrapper onclick={handleView} scrollable={true} className="mt-10">
                        {data?.map((item, index) => (
                            <ProductCard
                                key={index}
                                scrollable={true}
                                itemName={item.name}
                                discount={item.offer}
                                imageUrl={item.image}
                            />
                        ))}
                    </ProductWrapper>

                    <ProductWrapper scrollable={true} header="All Time Best Deal">
                        {data?.map((item, index) => (
                            <ProductCard2
                                key={index}
                                scrollable={true}
                                itemName={item.name}
                                discount={item.offers}
                                price={item.price}
                            />
                        ))}
                    </ProductWrapper>
                </div>
            )}
        </div>

    )
}