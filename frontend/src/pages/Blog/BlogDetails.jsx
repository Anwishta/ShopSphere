import { useGetBlogQuery, useToggleBlogLikeMutation, useGetCommentsQuery, useCreateCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation } from "../redux/api/blogApiSlice";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { format } from "date-fns";
import { useParams, Link } from "react-router-dom";
import { FaUser, FaCalendar, FaFolder, FaRegArrowAltCircleLeft, FaHeart, FaRegHeart, FaComment, FaRegComment, FaUserCircle, FaInfoCircle, FaSignInAlt, FaSave, FaEdit, FaTrash, FaComments } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import CreateBlogModal from "./CreateBlogModal";
import { toast } from "react-toastify";
import moment from "moment";
import Scrollbtn from "../../components/scrollbtn";
import { useDeleteBlogMutation } from "../redux/api/blogApiSlice";
import { useNavigate } from "react-router-dom";

const BlogDetails = () => {
    const { id } = useParams();
    const { data: blog, isLoading, error } = useGetBlogQuery(id);
    const { userInfo } = useSelector((state) => state.auth);
    const { isDarkMode } = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toggleLike] = useToggleBlogLikeMutation();
    const { data: comments, isLoading: commentsLoading } = useGetCommentsQuery(id);
    const [createComment] = useCreateCommentMutation();
    const [commentText, setCommentText] = useState('');
    const [updateComment] = useUpdateCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState('');
    const navigate = useNavigate();
    const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (isLoading) return <Loader />;
    if (error) return <div>Error: {error.message}</div>;

    const handleLikeClick = async () => {
        if (!userInfo) {
            toast.error("Please login to like this blog");
            return;
        }

        try {
            await toggleLike(id).unwrap();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update like");
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        if (!userInfo) {
            toast.error('Please login to comment');
            return;
        }

        try {
            await createComment({ blogId: id, content: commentText }).unwrap();
            setCommentText('');
            toast.success('Comment posted!');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to post comment');
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteBlog(id).unwrap();
            toast.success('Article deleted successfully');
            navigate('/blogs');
        } catch (err) {
            if (err.status === 403) {
                toast.error('You do not have permission to delete this article.');
            } else if (err.status === 404) {
                toast.error('Article not found.');
            } else {
                toast.error('Failed to delete article. Please try again.');
            }
        } finally {
            setShowDeleteModal(false);
        }
    };


    const handleEditClick = (comment) => {
        setEditingCommentId(comment._id);
        setEditText(comment.content);
    };

    const handleEditSubmit = async (commentId) => {
        if (!editText.trim()) return;

        try {
            await updateComment({ commentId, content: editText }).unwrap();
            setEditingCommentId(null);
            setEditText('');
            toast.success('Comment updated successfully');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update comment');
        }
    };

    const handleDeleteClick = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await deleteComment(commentId).unwrap();
                toast.success('Comment deleted successfully');
            } catch (err) {
                toast.error(err?.data?.message || 'Failed to delete comment');
            }
        }
    };

    return (
        <>
            <Scrollbtn />
            <div className="min-h-screen bg-gradient-to-b  from-gray-100 to-white dark:from-gray-900 dark:to-black">
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

                        {blog.image && (
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="mb-6 rounded-lg shadow-md"
                            />
                        )}

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
                            <button
                                onClick={handleLikeClick}
                                className={`group flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 
                                ${userInfo
                                        ? 'hover:scale-105 hover:shadow-lg dark:hover:shadow-pink-500/20'
                                        : 'cursor-not-allowed opacity-75'
                                    } 
                                ${blog.isLiked
                                        ? 'bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/50 dark:to-rose-900/50 shadow-md shadow-pink-200 dark:shadow-pink-800/20'
                                        : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-blue-200/50 dark:hover:shadow-pink-500/20'
                                    }
                                transform-gpu backface-hidden`}
                            >
                                <div className="relative">
                                    {blog.isLiked ? (
                                        <FaHeart
                                            className={`text-lg transform transition-all duration-300 
                                            text-pink-500 dark:text-pink-400
                                            group-hover:scale-110 group-hover:rotate-12`}
                                        />
                                    ) : (
                                        <FaRegHeart
                                            className={`text-lg transform transition-all duration-300 
                                            text-blue-500 dark:text-pink-400
                                            group-hover:scale-110 group-hover:-rotate-12`}
                                        />
                                    )}
                                    {userInfo && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full 
                                        bg-gradient-to-r from-pink-400 to-rose-400 
                                        animate-ping opacity-75"
                                        />
                                    )}
                                </div>
                                <span className={`text-sm font-medium tracking-wide transition-colors duration-300
                                ${blog.isLiked
                                        ? 'text-pink-700 dark:text-pink-300 group-hover:text-pink-800 dark:group-hover:text-pink-200'
                                        : 'text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-pink-300'
                                    }`}
                                >
                                    {blog.likeCount || 0}
                                    <span className="ml-1 font-normal">
                                        {blog.likeCount === 1 ? 'Like' : 'Likes'}
                                    </span>
                                </span>

                                {/* Decorative elements */}
                                <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300 pointer-events-none
                                ${blog.isLiked
                                        ? 'bg-gradient-to-r from-pink-200/20 to-rose-200/20 dark:from-pink-800/20 dark:to-rose-800/20'
                                        : 'bg-gradient-to-r from-blue-200/20 to-indigo-200/20 dark:from-gray-700/20 dark:to-gray-600/20'
                                    }`}
                                />
                            </button>
                        </div>
                        {userInfo?._id === blog.author._id && (
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    title="Delete article"
                                >
                                    <FaTrash className="w-5 h-5" />
                                </button>
                            </div>
                        )}
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



                    <div className="mt-16 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                            <FaComment className="text-blue-500 dark:text-pink-400" />
                            Discussion ({comments?.total || 0})
                        </h2>

                        {/* Comment Form */}
                        {userInfo ? (
                            <form onSubmit={handleCommentSubmit} className="mb-12 group">
                                <div className="flex gap-4 items-start relative">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                            <FaUserCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="relative">
                                            <textarea
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                placeholder="Join the discussion..."
                                                className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 dark:focus:border-pink-400 resize-none transition-all duration-300 text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 pr-20"
                                                rows="3"
                                                maxLength="1000"
                                            />
                                            <div className="absolute bottom-3 right-3 flex items-center gap-3">
                                                <span className={`text-sm ${commentText.length >= 1000 ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {1000 - commentText.length}
                                                </span>
                                                <button
                                                    type="submit"
                                                    disabled={!commentText.trim()}
                                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${commentText.trim()
                                                        ? 'bg-blue-500 hover:bg-blue-600 dark:bg-pink-500 dark:hover:bg-pink-600 text-white'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                                        }`}
                                                >
                                                    <FaComment className="shrink-0" />
                                                    <span className="hidden sm:inline">Post Comment</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-8 mb-12 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700">
                                <div className="mb-4 flex justify-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                        <FaUserCircle className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Want to join the conversation?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                                    Log in to share your thoughts and engage with the community.
                                </p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center px-6 py-2 bg-blue-500 dark:bg-pink-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-pink-600 transition-colors font-medium gap-2"
                                >
                                    <FaSignInAlt />
                                    Sign In to Comment
                                </Link>
                            </div>
                        )}

                        {/* Comments List */}
                        <div className="space-y-6">
                            {commentsLoading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex gap-4 animate-pulse">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                                            <div className="flex-1 space-y-3">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : comments?.comments?.length > 0 ? (
                                comments.comments.map(comment => (
                                    <div
                                        key={comment._id}
                                        className="group relative p-4 rounded-xl transition-all duration-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 border border-transparent hover:border-blue-100 dark:hover:border-pink-900"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                                    <FaUserCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-3 mb-2">
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {comment.author.username}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {moment(comment.createdAt).fromNow()}
                                                    </span>
                                                    {comment.updatedAt !== comment.createdAt && (
                                                        <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                                                            (edited)
                                                        </span>
                                                    )}
                                                </div>

                                                {editingCommentId === comment._id ? (
                                                    <div className="space-y-4">
                                                        <textarea
                                                            value={editText}
                                                            onChange={(e) => setEditText(e.target.value)}
                                                            className="w-full p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 
                                                            bg-white dark:bg-gray-800 
                                                            text-gray-800 dark:text-gray-200
                                                            focus:outline-none focus:border-blue-500 dark:focus:border-pink-400 
                                                            resize-none transition-all duration-300
                                                            font-normal text-base leading-relaxed"
                                                            rows="4"
                                                            autoFocus
                                                        />
                                                        <div className="flex justify-end gap-3">
                                                            <button
                                                                onClick={() => setEditingCommentId(null)}
                                                                className="px-4 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 
                                                                hover:text-gray-800 dark:hover:text-gray-100 
                                                                hover:bg-gray-100 dark:hover:bg-gray-700
                                                                font-medium transition-colors duration-200"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleEditSubmit(comment._id)}
                                                                className={`px-5 py-2.5 rounded-lg flex items-center gap-2.5 
                                                                font-medium transition-all duration-200 ${editText.trim()
                                                                        ? 'bg-blue-500 hover:bg-blue-600 dark:bg-pink-500 dark:hover:bg-pink-600 text-white shadow-sm hover:shadow-md'
                                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                                                    }`}
                                                                disabled={!editText.trim()}
                                                            >
                                                                <FaSave className="text-sm" />
                                                                <span>Save Changes</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="prose dark:prose-invert max-w-none">
                                                        {comment.content.split('\n').map((paragraph, i) => (
                                                            <p key={i} className="mb-3 last:mb-0 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                                                                {paragraph}
                                                            </p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Comment Actions */}
                                        {userInfo?._id === comment.author._id && !editingCommentId && (
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditClick(comment)}
                                                    className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-pink-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    title="Edit comment"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(comment._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    title="Delete comment"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border border-dashed border-gray-300 dark:border-gray-600">
                                    <FaComments className="mx-auto text-gray-400 dark:text-gray-500 mb-3 text-3xl" />
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                        No comments yet
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                                        Be the first to share your thoughts!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <CreateBlogModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className={`${isDarkMode ? 'dark' : ''} bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md w-full`}>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                                Are you sure you want to delete this article?
                            </h3>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:bg-red-300"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default BlogDetails; 