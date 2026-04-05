import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const initialState = {
    user: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API}/api/login`, { 
                email, 
                password 
            });
            
            const { token } = response.data;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            
            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Decode token and return user data
            const decoded = jwtDecode(token);
            return {
                userId: decoded.userId,
                name: decoded.name,
                email: decoded.email
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || 'Login failed');
        }
    }
);

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    const decoded = jwtDecode(token);
    return decoded;
});

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No token found');
    }
    await axios.delete(`${import.meta.env.VITE_API}/api/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
});

export const signup = createAsyncThunk('auth/signup', async ({ name, email, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API}/api/signup`, { name, email, password });
        return { message: response.data.message };
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data.error : 'Signup failed. Please try again.');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            state.user = null;
            state.userToken = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload;
                state.error = null;
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload;
            })
            .addCase(checkAuth.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.user = null;
            })
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(signup.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(deleteAccount.fulfilled, (state) => {
                state.user = null;
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
            })
            .addCase(deleteAccount.rejected, (state, { payload }) => {
                state.error = payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;





