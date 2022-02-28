import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
// import logger from 'redux-logger'
import accountReducer from './account'
import counterReducer from './counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    account: accountReducer,
  },
  // middleware: [logger],
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
