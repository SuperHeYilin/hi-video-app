import React, { Component } from 'react'
import { Tabs, Button } from 'antd'
import { Ibox } from '../../../components/Ui'
import OrderDetails from '../OrderDetails'
import OrderTable from './OrderTable'
import OrderFilter from './Filter'
import { api, err as apierr, auth } from '../../../utils'

const TabPane = Tabs.TabPane

class Order extends Component {
  constructor(props) {
    super(props)
    const { match } = this.props
    // 路由跳转 默认到的tab位置
    const { tab = "0,1,2,3,4,5,6" } = match.params
    this.state = {
      data: {state : tab},
      TabKey: tab,
      orderID: 0,
    }
  }
  onFilter = (filterData, state) => {
    this.setState({
      data: filterData,
      TabKey: state,
    })
  }
  // 获取列表选中项
  onSelected = (keys, rows) => {
    this.setState({ keys, rows })
  }
  // tab切换
  handleTabChange = (value) => {
    // this.handleTabChange(value)
    // this.onFilter({state: value})
    this.setState({
      TabKey: value,
      data: { ...this.state.data, state: value },
    })
  }
  // 改变tab
  handleTabKey = (value) => {
    this.setState({
      TabKey: value,
    })
  }
  // 拼装链接
  handleAddUrl = () => {
    const { data } = this.state
    const { mobile, pay_type, state, create_time, create_time1 } = data
    let url = "?begin=0"
    if (mobile) {
      url += "&mobile=" + mobile
    }
    if (pay_type) {
      url += "&pay_type=" + pay_type
    }
    if (state) {
      url += "&state=" + state
    }
    if (create_time) {
      url += "&create_time=" + create_time
    }
    if (create_time1) {
      url += "&create_time1=" + create_time1
    }
    url += "&token=" + auth.getAuthToken()
    return url
  }
  // 导出订单
  handleExport = () => {
    window.open(api.getBaseUrl() + "module/order/export" + this.handleAddUrl())
  }
  // 访问详情
  handleDetail = (id) => {
    this.setState({
      orderID: id,
    })
  }
  render() {
    const { history } = this.props
    const { data, keys, rows, TabKey, orderID } = this.state
    const isShow = orderID === 0
    return (
      <Ibox>
        <div style={{ display: isShow ? "block" : "none" }}>
        <Ibox.IboxTitle>
          <OrderFilter data={data} onFilter={this.onFilter} selected={{ keys, rows }} handleTabKey={this.handleTabKey} />
        </Ibox.IboxTitle>
        <Ibox.IboxContent>
          <Tabs onChange={this.handleTabChange} type="card" activeKey={TabKey} tabBarExtraContent={<Button type="primary" onClick={this.handleExport}>导出订单</Button>}>
            <TabPane tab={<span>全部</span>} key="0,1,2,3,4,5,6">
              <OrderTable history={history} data={data} onSelected={this.onSelected} TabKey={TabKey} handleDetail={this.handleDetail} />
            </TabPane>
            <TabPane tab={<span>待支付</span>} key="0">
              <OrderTable history={history} data={data} onSelected={this.onSelected} TabKey={TabKey} handleDetail={this.handleDetail} />
            </TabPane>
            <TabPane tab={<span>已支付</span>} key="1">
              <OrderTable history={history} data={data} onSelected={this.onSelected} TabKey={TabKey} handleDetail={this.handleDetail} />
            </TabPane>
            <TabPane tab={<span>已核验</span>} key="2">
              <OrderTable history={history} data={data} onSelected={this.onSelected} TabKey={TabKey} handleDetail={this.handleDetail} />
            </TabPane>
            <TabPane tab={<span>已取消</span>} key="3">
              <OrderTable history={history} data={data} onSelected={this.onSelected} TabKey={TabKey} handleDetail={this.handleDetail} />
            </TabPane>
            <TabPane tab={<span>退款申请</span>} key="4">
              <OrderTable history={history} data={data} onSelected={this.onSelected} TabKey={TabKey} handleDetail={this.handleDetail} />
            </TabPane>
            <TabPane tab={<span>已退款</span>} key="5">
              <OrderTable history={history} data={data} onSelected={this.onSelected} TabKey={TabKey} handleDetail={this.handleDetail} />
            </TabPane>
            <TabPane tab={<span>核验失败</span>} key="6">
              <OrderTable history={history} data={data} onSelected={this.onSelected} TabKey={TabKey} handleDetail={this.handleDetail} />
            </TabPane>
          </Tabs>
        </Ibox.IboxContent>
        </div>
        {isShow || <OrderDetails id={orderID} handleDetail={this.handleDetail} />}
      </Ibox>
    )
  }
}

export default Order