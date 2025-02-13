import { useGetBlogQuery } from "../redux/api/blogApiSlice";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { format } from "date-fns";
import { useParams, Link } from "react-router-dom";
import { FaUser, FaCalendar, FaFolder, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import CreateBlogModal from "./CreateBlogModal";

const BlogDetails = () => {
    const { id } = useParams();
    const { data: blog, isLoading, error } = useGetBlogQuery(id);
    const { userInfo } = useSelector((state) => state.auth);
    const { isDarkMode } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    if (isLoading) return <Loader />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <Link
                    to="/blogs"
                    className="group mb-6 sm:mb-8 inline-flex items-center text-blue-600 dark:text-pink-400 hover:text-blue-700 dark:hover:text-pink-300 transition-all duration-300"
                >
                    <FaRegArrowAltCircleLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                    <span className="font-medium">All Blog Posts</span>
                </Link>

                <article className="relative rounded-2xl shadow-xl dark:shadow-gray-800/30 p-6 sm:p-10 bg-white dark:bg-gray-800 transition-all duration-500 hover:shadow-2xl hover:dark:shadow-gray-800/50">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 opacity-30 -z-10" />
                    
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-8 pb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent leading-[1.3] sm:leading-[1.2] break-words whitespace-pre-wrap">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap gap-4 mb-8">
                        <div className="flex items-center bg-blue-50 dark:bg-gray-700 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105">
                            <FaUser className="mr-2 text-blue-500 dark:text-pink-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {blog.author?.username}
                            </span>
                        </div>
                        <div className="flex items-center bg-blue-50 dark:bg-gray-700 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105">
                            <FaCalendar className="mr-2 text-blue-500 dark:text-pink-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
                            </span>
                        </div>
                        {blog.category && (
                            <div className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-pink-500 dark:to-purple-500 px-4 py-2 rounded-full transition-all duration-300 hover:scale-105">
                                <FaFolder className="mr-2 text-white" />
                                <span className="text-sm font-medium text-white">
                                    {blog.category.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {blog.excerpt && (
                        <div className="mb-8 px-4 py-3 bg-blue-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500 dark:border-pink-400">
                            <p className="text-lg italic text-gray-700 dark:text-gray-300">
                                {blog.excerpt}
                            </p>
                        </div>
                    )}

                    <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                        {blog.content.split('\n').map((paragraph, index) => (
                            <p 
                                key={index} 
                                className="mb-6 leading-relaxed transition-all duration-300 hover:pl-4 hover:border-l-4 hover:border-blue-200 dark:hover:border-pink-200"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </article>

                <div className="mt-12 text-center">
                    {userInfo ? (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-pink-500 dark:to-purple-500 
                            text-white rounded-xl hover:scale-105 transition-all duration-300
                            hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.4)] dark:hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.4)]
                            font-semibold text-lg"
                        >
                            <span className="relative z-10">Create Your Own Masterpiece</span>
                            <div className="absolute inset-0 rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-500" />
                        </button>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                                Ready to share your story? Join our creative community! ✍️
                            </p>
                            <Link
                                to="/register"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-pink-500 dark:to-purple-500 
                                text-white rounded-xl transform hover:scale-105 transition-all duration-300
                                hover:ring-4 hover:ring-blue-200 dark:hover:ring-pink-200/30 font-semibold text-lg"
                            >
                                Start Your Blogging Journey
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <CreateBlogModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default BlogDetails; 