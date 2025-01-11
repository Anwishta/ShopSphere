import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetBlogsQuery, useCreateBlogMutation } from "../redux/api/blogApiSlice";
import Loader from "../../components/Loader";
import { format } from "date-fns";
import { useSelector } from "react-redux";

const BlogList = () => {
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userInfo } = useSelector((state) => state?.auth);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        author: userInfo?._id
    });

    const { data, isLoading, error } = useGetBlogsQuery({ page, limit: 6 });
    const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const blogData = {
                ...formData,
                ...(formData.category && formData.category.trim() !== '' && {
                    category: formData.category
                })
            };
            
            console.log('Submitting blog data:', blogData);
            await createBlog(blogData).unwrap();
            setIsModalOpen(false);
            setFormData({
                title: '',
                content: '',
                excerpt: '',
                author: userInfo?._id
            });
        } catch (err) {
            console.error('Failed to create blog:', err);
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="bg-black min-h-screen text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-center">Latest Blog Posts</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-pink-500 rounded hover:bg-pink-600"
                    >
                        Create Blog
                    </button>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4">Create New Blog</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full p-2 rounded bg-gray-800"
                                        required
                                    />
                                    <textarea
                                        placeholder="Content"
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        className="w-full p-2 rounded bg-gray-800 h-32"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Excerpt (optional)"
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                                        className="w-full p-2 rounded bg-gray-800"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full p-2 rounded bg-gray-800"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 bg-gray-700 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-pink-500 rounded"
                                        disabled={isCreating}
                                    >
                                        {isCreating ? 'Creating...' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {!data?.blogs?.length ? (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-400">No blogs have been created yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data?.blogs?.map((blog) => (
                            <Link
                                key={blog._id}
                                to={`/blog/${blog._id}`}
                                className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-200"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-2 text-pink-500">
                                        {blog.title}
                                    </h2>
                                    <p className="text-gray-400 text-sm mb-4">
                                        {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
                                    </p>
                                    <p className="text-gray-300 mb-4">{blog.excerpt}</p>
                                    <div className="flex items-center text-sm text-gray-400">
                                        <span>Read more →</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {data?.totalPages > 1 && (
                    <div className="flex justify-center mt-8 gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-pink-500 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={page === data?.totalPages}
                            className="px-4 py-2 bg-pink-500 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList; 