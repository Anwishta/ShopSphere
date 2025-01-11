import { BASE_URL } from "../constants";
import { apiSlice } from "./apiSlice";


export const blogApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBlogs: builder.query({
            query: ({ page = 1, limit = 10 }) => ({
                url: `${BASE_URL}/api/blogs/get-blogs?page=${page}&limit=${limit}`,
                method: "GET",
            }),
            providesTags: ["Blog"],
        }),
        getBlogById: builder.query({
            query: (id) => ({
                url: `${BASE_URL}/api/blogs/${id}`,
                method: "GET",
            }),
        }),
        createBlog: builder.mutation({
            query: (data) => ({
                url: `${BASE_URL}/api/blogs/create`,
                method: "POST",
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ["Blog"],
        }),
    }),
});

export const { useGetBlogsQuery, useGetBlogByIdQuery, useCreateBlogMutation } = blogApiSlice; 
