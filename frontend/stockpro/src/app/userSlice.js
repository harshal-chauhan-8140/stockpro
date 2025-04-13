import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    status: false,
    userData: null,
    accessToken: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loading: (state, action) => {
            state.loading = !state.loading
        },
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        logout: (state, action) => {
            state.status = false;
            state.userData = null;
            state.accessToken = null;
            localStorage.removeItem("user");
        },
        updateAvailableBalance: (state, action) => {
            state.userData.availableBalance = action.payload.availableBalance;
        }
    }
})

export const { login, logout, loading, updateAvailableBalance } = userSlice.actions;

export default userSlice.reducer;