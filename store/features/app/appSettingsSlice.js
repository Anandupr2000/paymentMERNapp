import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    passcodeEnabled: false,
    offlinePayment: false,
    connectedToInternet: false,
    networkStatusBarVisibility: false,
    paymentBottomSheetRef: null
}

const appSettingsSlice = createSlice({
    name: "appSettings",
    initialState,
    reducers: {
        setPasscodeEnabledStatus: (state, action) => {
            state.passcodeEnabled = action.payload
        },
        setOfflinePaymentStatus: (state, action) => {
            state.offlinePayment = action.payload
        },
        setConnectedToInternet: (state, action) => {
            state.connectedToInternet = action.payload
        },
        setNetworkStatusBarVisibility: (state, action) => {
            // console.log("payload", action.payload);
            state.networkStatusBarVisibility = action.payload
        },
        // setPaymentBottomSheetRef: (state, action) => {
        //     console.log("setPaymentBottomSheetRef", action);
        //     state.paymentBottomSheetRef = action.payload
        // }
    }
});

export const { setPasscodeEnabledStatus, setOfflinePaymentStatus, setConnectedToInternet, setNetworkStatusBarVisibility } = appSettingsSlice.actions
export const isOfflinePayment = (state) => state.appSettings.offlinePayment
export const isPasscodeEnabled = (state) => state.appSettings.passcodeEnabled
export const isConnectedToInternet = (state) => state.appSettings.connectedToInternet
export const isNetworkStatusBarVisibile = (state) => state.appSettings.networkStatusBarVisibility

export default appSettingsSlice.reducer