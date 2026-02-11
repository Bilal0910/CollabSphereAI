import { combineReducers, configureStore, ReducersMapObject, Middleware } from '@reduxjs/toolkit'
import { slices } from './slice'
import middleware from '@/middleware'
import { apis } from './api'

export type RootState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    ...slices,
    ...apis.reduce((acc, api) => {
        acc[api.reducerPath] = api.reducer
        return acc
    }, {} as ReducersMapObject),
})

export function makeStore(preloadedState?: Partial<RootState>) {
    return configureStore({
        reducer: rootReducer,
        middleware: (gDM) => gDM().concat(...apis.map((a) => a.middleware as Middleware)),
        preloadedState,
        devTools: process.env.NODE_ENV !== 'production',
    })
}

export const store = makeStore()