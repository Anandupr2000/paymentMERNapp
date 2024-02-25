import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // "_id": "6529be9e239997e717c80518",
    // "name": "user",
    // "email": "user@gmail.com",
    // "phn": "9089781232",
    // "pwd": "$2b$10$mD2cdi30y6bfOT0QydIfd.tNvjM13k2dS86xRD3EyAzYrR5RCWuUC",
    // "balance": 11,
    // 'isLoggedIn': true,
    // 'pincode': 1234,
    // 'isVerified': false
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserPasscode: (state, action) => {
            state.pincode = action.payload;
        },
        setUserVerified: (state, action) => {
            state.isVerified = action.payload;
        },
        setUserValid: (state, action) => {
            state.isValid = action.payload;
        },
        setUser: (state, action) => {
            // Modify existing state properties instead of assigning a new object
            Object.assign(state, action.payload);
        },
        clearUser: (state) => {
            // Clear existing state properties
            Object.keys(state).forEach(key => delete state[key]);
        }
    }
});

export const { setUserPasscode, setUserVerified, setUserValid, setUser, clearUser } = userSlice.actions
export const selectUser = (state) => state.user;
export const selectUserPasscode = (state) => state.user.pincode;
export const selectUserPhn = (state) => state.user.phn;
export const isUserValid = (state) => state.user.isValid;
export default userSlice.reducer
