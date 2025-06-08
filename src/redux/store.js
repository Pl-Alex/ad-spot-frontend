import { configureStore } from "@reduxjs/toolkit";
import { adsReducer } from "./slices/ads";
import { authReducer } from "./slices/auth";

const store = configureStore({
  reducer: {
    ads: adsReducer,
    auth: authReducer,
  },
});

export default store;
