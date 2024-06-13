import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import combineReducer from "./combineReducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authReducer"],
  blacklist: ["commonReducer"],
};

const persistedReducer = persistReducer(persistConfig, combineReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
      serializableCheck: false,  // or specify ignored paths or actions as above
    }),
});

export const persistor = persistStore(store);

export default store;
