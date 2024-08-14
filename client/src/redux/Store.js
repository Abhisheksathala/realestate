import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userSlice from './User/UserSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Combine reducers
const rootReducer = combineReducers({ user: userSlice })

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  version: 1
}

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
})

// Persistor
export const persistor = persistStore(store)
