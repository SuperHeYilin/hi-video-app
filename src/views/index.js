import ViewSpin from '../components/Layout/ViewSpin'
import { dynamic as Dynamic } from '../utils'

function dynamic(config) {
  return Dynamic({
    ...config,
    LoadingComponent: ViewSpin,
  })
}

/* --------------- 同步引入 --------------- */
export { default as App } from './App.js'
export { Login } from './Auth'

export const User = dynamic({
  component: () => import('./platform/User'),
})

export const UserCenter = dynamic({
  component: () => import('./platform/UserCenter'),
})

export const Roles = dynamic({
  component: () => import('./platform/Roles'),
})

export const Menus = dynamic({
  component: () => import('./platform/Menus'),
})

export const Authority = dynamic({
  component: () => import('./platform/Authority'),
})

export const RopWechatAccount = dynamic({
  component: () => import('./rop/Wechat'),
})

export const RopAlipayAccount = dynamic({
  component: () => import('./rop/Alipay'),
})