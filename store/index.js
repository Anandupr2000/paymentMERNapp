import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

import { applyMiddleware, combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './features/user/userSlice'
import appSettingReducer from './features/app/appSettingsSlice'
import thunkMiddleWare from 'redux-thunk';
// import { buildGetDefaultEnhancers } from '@reduxjs/toolkit/dist/getDefaultEnhancers';
// import { composeWithDevTools } from '@reduxjs/toolkit/dist/devtoolsExtension';


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // whiteList:['user']
}

let rootReducer = combineReducers({ user: userReducer, appSettings: appSettingReducer })

const persistedReducer = persistReducer(persistConfig, rootReducer)

// export const store = configureStore({
//     reducer: persistedReducer
//     // {
//     // user: userReducer,
//     // appSettings: appSettingReducer
//     // },
// })
// export const persistor = persistStore(store)

export default () => {
    // const composedEnchancer = applyMiddleware(thunkMiddleWare)
    let store = configureStore({
        reducer: persistedReducer,
        devTools: process.env.NODE_ENV != 'production',
        middleware:
            (getDefaultMiddleware) => {
                // const middlewares = 
                return getDefaultMiddleware({
                    serializableCheck: {
                        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                    },
                })
                // .concat(thunkMiddleWare)
                // return [...middlewares, thunkMiddleWare]
            },
    })
    let persistor = persistStore(store)
    return { store, persistor }
}
