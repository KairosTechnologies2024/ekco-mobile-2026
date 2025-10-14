import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.10.41:3003/api' }),
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
    forgotPassword: builder.mutation({
      query: (email) => {
        console.log('Forgot password API call with email:', email);
        return {
          url: '/users/forgot-password',
          method: 'POST',
          body: { email },
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ newPassword, token }) => {
        console.log('Reset password API call with token and newPassword');
        return {
          url: '/users/reset-password',
          method: 'POST',
          body: { newPassword, token },
        };
      },
    }),
    getCustomerByUserId: builder.query({
      query: (userId) => `/customers/customer/${userId}`,
    }),
    getVehicleSpeed: builder.query({
      query: (serial) => `/customers/speed/${serial}`,
    }),
    getCustomerVehicles: builder.query({
      query: (userId) => `/customers/vehicles/${userId}`,
    }),
  }),
});

export const { useLoginMutation, useGetUserByIdQuery, useEnable2FAMutation, useDisable2FAMutation, useVerify2FAMutation, useForgotPasswordMutation, useResetPasswordMutation, useGetCustomerByUserIdQuery, useGetCustomerVehiclesQuery, useGetVehicleSpeedQuery } = authApi;
