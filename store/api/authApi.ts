import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.10.24:3003/api' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => {
        console.log('Login API call with credentials:', credentials);
        return {
          url: '/users/login',
          method: 'POST',
          body: credentials,
        };
      },
    }),
    getUserById: builder.query({
      query: (userId) => `/users/${userId}`,
    }),
    enable2FA: builder.mutation({
      query: (userId) => ({
        url: '/users/enable-2fa',
        method: 'POST',
        body: { userId },
      }),
    }),
    disable2FA: builder.mutation({
      query: (userId) => ({
        url: '/users/disable-2fa',
        method: 'POST',
        body: { userId },
      }),
    }),
    verify2FA: builder.mutation({
      query: (credentials) => ({
        url: '/users/verify-2fa',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useGetUserByIdQuery, useEnable2FAMutation, useDisable2FAMutation, useVerify2FAMutation } = authApi;
