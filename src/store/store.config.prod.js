import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import storage from 'redux-persist/es/storage'
import { persistStore, persistCombineReducers, purgeStoredState } from 'redux-persist'// redux-state的持久化工具
import { routerMiddleware } from 'react-router-redux'
import { reducers, whitelist } from '../reducers'
// import promiseMiddleware from '../middlewares/promiseMiddleware'

const config = {
  key: 'root',
  storage,
  whitelist,
}

export function removeStoreCache(key) {
  return purgeStoredState({key, storage})
}


export default function configureStore(initialState, history) {
  const router = routerMiddleware(history)

  const enhancer = compose(
    applyMiddleware(thunk /** promiseMiddleware({promiseTypeSuffixes:['PENDING','SUCCESS','ERROR']}) **/, router),
  )

  const reducer = persistCombineReducers(config, reducers)

  const store = createStore(
    reducer,
    initialState,
    enhancer
  )

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default // eslint-disable-line global-require
      store.replaceReducer(nextReducer)
    })
  }

  const persistor = persistStore(store)

  return {store, persistor}
}