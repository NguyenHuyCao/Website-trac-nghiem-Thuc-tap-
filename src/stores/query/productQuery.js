import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://laptech4k.onrender.com/api/v1/",
  }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ category, brand, usecase }) => {
        // Xây dựng URL với query params
        let queryStr = "";
        if (category) queryStr += `category=${category}&`;
        if (brand) queryStr += `brand=${brand}`;
        if (usecase) queryStr += `usecase=${usecase}`;
        return `products?${queryStr}`;
      },
    }),
    getBrandByName: builder.query({
      query: ({ category }) => {
        let queryStr = "";
        if (category) queryStr += `category=${category}&`;
        // return products?${queryStr};
        return `products/category/brands?${queryStr}`;
      },
    }),
  }),
});

export const { useGetProductsQuery, useGetBrandByNameQuery } = productApi;