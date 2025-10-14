import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  twofa_secret: string;
  user_type: string;
}

interface Customer {
  user: {
    address1: string | null;
    address2: string | null;
    address_line_1: string;
    address_line_2: string;
    city: string;
    client_password: string;
    email: string;
    first_name: string;
    id: string;
    id_num: string | null;
    id_number: string;
    initiator_name: string;
    insurance_name: string | null;
    insurance_number: string | null;
    is_active: boolean;
    last_name: string;
    next_of_keen_name: string | null;
    next_of_keen_number: string | null;
    next_of_kin: string;
    next_of_kin_name: string | null;
    next_of_kin_number: string;
    passport_number: string;
    phone_number: string;
    policy_number: string;
    postal_code: string;
    profile_picture: string;
    province: string;
    user_id: string;
    user_type: string;
  };
}

interface UserState {
  user: User | null;
  customer: Customer | null;
  userId: string | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  customer: null,
  userId: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string; userId?: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.userId = action.payload.userId || null;
      state.isAuthenticated = true;
    },
    setCustomer: (state, action: PayloadAction<Customer>) => {
      state.customer = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.customer = null;
      state.token = null;
      state.refreshToken = null;
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setCustomer, logout } = userSlice.actions;
export default userSlice.reducer;
