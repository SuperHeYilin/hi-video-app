import React from 'react'// 引入React
import { render } from 'react-dom'// 引入render方法
import { Provider } from 'react-redux'// 利用Provider可以使我们的 store 能为下面的组件所用
import { PersistGate } from 'redux-persist/lib/integration/react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'

import Routers from './routes'// 引入路由配置
import configureStore from './store/store.config.js'// 引入增强后的store
import DevTools from './store/DevTools'// 引入redux开发工具

import './index.css'

const { store, persistor } = configureStore(undefined, undefined)
const root = document.getElementById('root')

render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={getMuiTheme({})}>
      <LocaleProvider locale={zhCN}>
        <PersistGate persistor={persistor}>
          <Routers />
          {/* true || process.env.NODE_ENV === 'production' ? null : <DevTools /> */}
        </PersistGate>
      </LocaleProvider>
    </MuiThemeProvider>
  </Provider>,
  root
)