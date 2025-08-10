import {
  accessoryApi,
  authApi,
  blogApi,
  categoryApi,
  complaintApi,
  contractApi,
  dressApi,
  feedbackApi,
  milestoneApi,
  orderApi,
  requestApi,
  serviceApi,
} from "@/services/apis";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [accessoryApi.reducerPath]: accessoryApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [complaintApi.reducerPath]: complaintApi.reducer,
    [contractApi.reducerPath]: contractApi.reducer,
    [dressApi.reducerPath]: dressApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [milestoneApi.reducerPath]: milestoneApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [requestApi.reducerPath]: requestApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      accessoryApi.middleware,
      blogApi.middleware,
      categoryApi.middleware,
      complaintApi.middleware,
      contractApi.middleware,
      dressApi.middleware,
      feedbackApi.middleware,
      milestoneApi.middleware,
      orderApi.middleware,
      requestApi.middleware,
      serviceApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
