import {
  accessoryApi,
  authApi,
  blogApi,
  categoryApi,
  complaintApi,
  contractApi,
  customOrderApi,
  customRequestApi,
  dressApi,
  feedbackApi,
  localeApi,
  membershipApi,
  milestoneApi,
  orderApi,
  requestApi,
  serviceApi,
  shopApi,
  singleApi,
  subscriptionApi,
  transactionApi,
  userApi,
  vonageApi,
  walletApi,
} from '@/services/apis';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [accessoryApi.reducerPath]: accessoryApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [complaintApi.reducerPath]: complaintApi.reducer,
    [contractApi.reducerPath]: contractApi.reducer,
    [customOrderApi.reducerPath]: customOrderApi.reducer,
    [customRequestApi.reducerPath]: customRequestApi.reducer,
    [dressApi.reducerPath]: dressApi.reducer,
    [feedbackApi.reducerPath]: feedbackApi.reducer,
    [milestoneApi.reducerPath]: milestoneApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [requestApi.reducerPath]: requestApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [shopApi.reducerPath]: shopApi.reducer,
    [singleApi.reducerPath]: singleApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [localeApi.reducerPath]: localeApi.reducer,
    [membershipApi.reducerPath]: membershipApi.reducer,
    [vonageApi.reducerPath]: vonageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      accessoryApi.middleware,
      blogApi.middleware,
      categoryApi.middleware,
      complaintApi.middleware,
      contractApi.middleware,
      customOrderApi.middleware,
      customRequestApi.middleware,
      dressApi.middleware,
      feedbackApi.middleware,
      milestoneApi.middleware,
      orderApi.middleware,
      requestApi.middleware,
      serviceApi.middleware,
      shopApi.middleware,
      singleApi.middleware,
      subscriptionApi.middleware,
      transactionApi.middleware,
      userApi.middleware,
      walletApi.middleware,
      localeApi.middleware,
      membershipApi.middleware,
      vonageApi.middleware,
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
