import { createStore, applyMiddleware, compose } from 'redux'// 引入redux createStore、中间件及compose 
import thunk from 'redux-thunk'// redux-thunk 支持 dispatch function，并且可以异步调用它
import storage from 'redux-persist/es/storage'
import { createLogger } from 'redux-logger'// 利用redux-logger打印日志
import { routerMiddleware } from 'react-router-redux'
import { persistStore, persistCombineReducers, purgeStoredState } from 'redux-persist'// redux-state的持久化工具
import { reducers, whitelist } from '../reducers'
import DevTools from './DevTools'
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
  const logger = createLogger()
  const router = routerMiddleware(history)

  const enhancer = compose(
    applyMiddleware(thunk /** promiseMiddleware({promiseTypeSuffixes:['PENDING','SUCCESS','ERROR']}) **/, logger, router),
    DevTools.instrument(),
    window.devToolsExtension ? window.devToolsExtension() : f => f
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