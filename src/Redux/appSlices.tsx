// src/services/apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const CONFIG_URL = 'https://dummyjson.com/products'
export const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: CONFIG_URL,
    
  }),
  endpoints: (builder) => ({    
  
    fetchCategoriesQuery: builder.query({
      query: () => `/categories`
    }),
  
    fetchProductsByCategory: builder.query({
      query: (category) => `/category/${category}`
    }),
  
  }),
});

export const {
  useFetchCategoriesQueryQuery,
  useFetchProductsByCategoryQuery,
 } = apiSlice;