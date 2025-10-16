import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.10.26:3003/api' }),
 tagTypes: ['Alerts', 'Speed', 'Ignition', 'GPS', 'Tickets'],
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
    getGpsBySerial: builder.query({
      query: (serial) => `/customers/gps/${serial}`,
       providesTags: ['GPS'],
    }),
    getVehicleSpeed: builder.query({
      query: (serial) => `/customers/speed/${serial}`,
      providesTags: ['Speed'],
    }),
    getVehicleIgnition: builder.query({
      query: (serial) => `/customers/ignition/${serial}`,
      providesTags: ['Ignition'],
    }),
    getCustomerVehicles: builder.query({
      query: (userId) => `/customers/vehicles/${userId}`,
    }),
    getAlertsBySerial: builder.query({
      query: (serial) => `/customers/alerts/serial/${serial}`,
      providesTags: (result, error, serial) => [{ type: 'Alerts', id: serial }],
    }),
    createTicket: builder.mutation({
  query: ({ userId, customerId, ticket }) => ({
    url: `/tickets/user/${userId}/${customerId}`,
    method: 'POST',
    body: ticket,
  }),
  
}),
getUserTickets: builder.query({
  query: ({ userId, customerId }) => `/tickets/user/${userId}/customer/${customerId}`,
  providesTags: ['Tickets'],
}),

deleteTicket: builder.mutation({
  query: ({ userId, ticketId }) => ({
    url: `/tickets/user/${userId}/ticket/${ticketId}`,
    method: 'DELETE',
  }),
}),

  }),
});

export const { useLoginMutation, useGetUserByIdQuery, useEnable2FAMutation, 
  useDisable2FAMutation, useVerify2FAMutation, useForgotPasswordMutation, useResetPasswordMutation, 
  useGetCustomerByUserIdQuery, useGetCustomerVehiclesQuery, useGetVehicleSpeedQuery, 
  useGetVehicleIgnitionQuery, useGetGpsBySerialQuery, useGetAlertsBySerialQuery,
useCreateTicketMutation, useGetUserTicketsQuery, useDeleteTicketMutation } = authApi;
