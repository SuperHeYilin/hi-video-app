import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { publicPath } from './constants'

import NotFound from './views/Error/NotAuth'
import Quartz from './views/platform/Quartz'
import Goods from './views/module/Goods'
import AddGoods from './views/module/Goods/AddGoods'
import GoodsClassification from './views/module/GoodsClassification'
import Store from './views/module/Store'
import StoreGoods from './views/module/Store/StoreGoods'
import Order from './views/module/Order'
import Dashboard from './views/module/Dashboard'
import OrderRefund from './views/module/OrderRefund'
import Orderdetails from './views/module/OrderDetails'
import OrderRefundDetails from './views/module/OrderRefundDetails'
import Marketing from './views/module/Marketing'
import { App, User, Roles, Menus, Authority, Login, RopWechatAccount, RopAlipayAccount, UserCenter } from './views'
import CheckOrder from './views/module/CheckOrder'
import WechatUser from './views/rop/WechatUser'
// 重复验证
import RepeatVideo from './views/module/RepeatVideo'
// 视频初始化导入
import InitVideo from './views/module/InitVideo'
// 基本配置
import HiConfig from './views/platform/HiConfig'
// 视频罗列
import VideoList from './views/module/VideoList'
import VideoDetail from './views/module/VideoDetail'

import VideoType from './views/module/VideoType'

const Routers = ({ history }) => {
	return (
		<BrowserRouter basename={publicPath} >
			<Switch>
        <Route path="/auth/login" component={Login} />
				<Route path="/" render={(props) => {
					return (
            <App {...props}>
              <Route path="/" exact component={Dashboard} />

              {/* platform平台核心功能模块 */}
              <Route path="/platform/user" component={User} />
              <Route path="/platform/roles" component={Roles} />
              <Route path="/platform/menus" component={Menus} />
              <Route path="/platform/authority" component={Authority} />
              <Route path="/platform/usercenter/:key?" component={UserCenter} />
              <Route path="/plantform/config" component={HiConfig} />

              {/* module模块功能 */}
              <Route path="/module/wechatuser" component={WechatUser} />
              <Route path="/module/quartz" component={Quartz} />
              <Route path="/module/goods" exact component={Goods} />
              <Route path="/module/goods/add/:id?" component={AddGoods} />
              <Route path="/module/goods/classification" component={GoodsClassification} />
              <Route path="/module/store" exact component={Store} />
              <Route path="/module/store/goods/:id?" component={StoreGoods} />
              <Route path="/module/order/:tab?" exact component={Order} />
              <Route path="/module/analyze" component={Dashboard} />
              <Route path="/module/refund/order" exact component={OrderRefund} />
              <Route path="/module/orderdetails/:id/:tab?" component={Orderdetails} />
              <Route path="/module/orderrefund/details/:id" component={OrderRefundDetails} />
              <Route path="/module/marketing" component={Marketing} />
              <Route path="/module/checkorder" component={CheckOrder} />
              {/* 视频罗列 */}
              <Route path="/module/video-list" component={VideoList} />
              {/* 视频详情 */}
              <Route path="/module/video/type" component={VideoType} />
              <Route path="/module/video/detail/:id" component={VideoDetail} />
              {/* 重复验证 */}
              <Route path="/repeat/video" component={RepeatVideo} />
              {/* 视频初始化导入 */}
              <Route path="/rop/alipayaccount" component={RopAlipayAccount} />
              <Route path="/init/video" component={InitVideo} />
              <Route path="*" component={NotFound} />
            </App>
					)
				}}
				/>
				<Route path="*" component={NotFound} />
			</Switch>
		</BrowserRouter>
	)
}

export default Routers