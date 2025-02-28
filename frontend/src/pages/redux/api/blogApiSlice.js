import { BLOG_URL, COMMENT_URL } from "../constants";
import { apiSlice } from "./apiSlice";


export const blogApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBlogs: builder.query({
            query: ({ page = 1, limit = 10, sort = 'newest' }) => ({
                url: `${BLOG_URL}/get-blogs?page=${page}&limit=${limit}&sort=${sort}`,
                method: "GET",
            }),
            providesTags: ["Blog"],
        }),
        getBlog: builder.query({
            query: (id) => `${BLOG_URL}/${id}`,
            providesTags: (result, error, id) => [{ type: 'Blog', id }],
        }),
        createBlog: builder.mutation({
            query: (data) => ({ 
                url: `${BLOG_URL}/create`,
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Blog"],
        }),
        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `${BLOG_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Blog', id },
                { type: 'Blog', id: 'LIST' },
            ],
        }),
        toggleBlogLike: builder.mutation({
            query: (id) => ({
                url: `${BLOG_URL}/${id}/like`,
                method: 'POST',
            }),
            // Optimistically update the cache
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Update the blog details cache
                    dispatch(
                        blogApiSlice.util.updateQueryData('getBlog', id, (draft) => {
                            draft.isLiked = data.isLiked;
                            draft.likeCount = data.likes;
                        })
                    );
                } catch {
                    // If the mutation fails, the cache will be rolled back automatically
                }
            },
        }),
        getComments: builder.query({
            query: (blogId) => `${COMMENT_URL}/blog/${blogId}`,
            providesTags: ['Comments'],
        }),
        createComment: builder.mutation({
            query: ({ blogId, content }) => ({
                url: `${COMMENT_URL}/blog/${blogId}`,
                method: 'POST',
                body: { content },
            }),
            invalidatesTags: ['Comments'],
        }),
        updateComment: builder.mutation({
            query: ({ commentId, content }) => ({
                url: `${COMMENT_URL}/${commentId}`,
                method: 'PUT',
                body: { content },
            }),
            invalidatesTags: ['Comments'],
        }),
        deleteComment: builder.mutation({
            query: (commentId) => ({
                url: `${COMMENT_URL}/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Comments'],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetBlogQuery,
    useCreateBlogMutation,
    useDeleteBlogMutation,
    useToggleBlogLikeMutation,
    useGetCommentsQuery,
    useCreateCommentMutation,
    useUpdateCommentMutation,
    useDeleteCommentMutation
} = blogApiSlice; 