import React, { Component } from 'react'
import { Card, Row, Col, Steps, Tag, Button, message } from 'antd'
import GoodsTable from './Ordergoods'
import { api } from '../../../utils'

const Step = Steps.Step

class BasicProfile extends Component {
  constructor(props) {
    super(props)
    // const { match } = this.props
    // // 路由跳转 默认到的tab位置
    // const { tab = "0,1,2,3,4,5,6" } = match.params
    this.state = {
      data: {},
      tab: "0,1,2,3,4,5,6",
    }
  }

  componentDidMount() {
    const { id = 0 } = this.props
    this.fetch(id)
  }

  componentWillReceiveProps(nextProps) {
    const id = nextProps.id
    this.fetch(id)
  }

  // 处理state
  handleChangeCurrent = (key) => {
    if (key === "0") {
      return 0
    }
    if (key === "1") {
      return 1
    }
    if (key === "2" || key === "3" || key === "4") {
      return 2
    }
    if (key === "5") {
      return 3
    }
    return 0
  }

  handleSendOrder = () => {
    const id = this.props.match.params.id
    api
    .post("/module/order/send", {id})
    .then(result => {
      if (result) {
        message.success(`发送成功`)
      } else {
        message.warn("发送失败")
      }
      this.fetch()
    })
    .catch(api.err)
  }

  fetch = (id) => {
    api
    .get("/order/details", { id })
    .then((data) => {
      this.setState({
        data,
      })
    })
    .catch(api.err)
  }

  // 渲染状态步骤条
  renderSteps = () => {

  }

  renderSendBars = (isSend, state) => {
    if (state !== '2') {
      return null
    }
    return (
      <div>
        {isSend === "1" && <Tag color="#87d068">发送成功</Tag>}
        <Button type="primary" size="small" onClick={this.handleSendOrder}>{isSend !== '0' ? "重新发送" : "发送"}</Button>
      </div>
    )
  }

  render() {
    const { data = {}, tab } = this.state
    const { handleDetail } = this.props
    if (!data) {
      return null
    }
    const { state = "0" } = data
    const { clientUser = {}, userAddress = {}, store = {}, orderGoods = [], goods = [] } = data
    const stateDemo = ['待支付', '已支付', '已核验', '已取消', '退款申请', '已退款', '核验失败']
    const payType = ['微信支付', '余额支付', '提货卡支付', '支付宝支付']
    return (
      <div style={{ marginBottom: 24 }}>
        <Card title="订单状态" extra={<a onClick={() => handleDetail(0)}>返回</a>} >
          <div style={{ padding: 30, background: "white" }}>
            {
              state === "0" || state === "1" ?
                <Steps current={this.handleChangeCurrent(state)} status="finish">
                  <Step title="待支付" />
                  <Step title="已支付" />
                  <Step title="待核验" />
                </Steps> : state === "2" ?
                <Steps current={this.handleChangeCurrent(state)} status="finish">
                  <Step title="待支付" />
                  <Step title="已支付" />
                  <Step title="已核验" />
                </Steps>
                : state === "3" ?
                  <Steps current={this.handleChangeCurrent(state)} status="finish">
                    <Step title="待支付" />
                    <Step title="已取消" />
                  </Steps> : state === "4" || state === "5" ?
                    <Steps current={this.handleChangeCurrent(state)} status="finish">
                      <Step title="待支付" />
                      <Step title="已支付" />
                      <Step title="退款申请" />
                      <Step title="已退款" />
                    </Steps> : ""
            }
          </div>
        </Card>
        <Card style={{ marginTop: 24 }} title="订单详情" bordered={false} extra={this.renderSendBars(data.is_send, state)} >
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <p>订单单号：{data.no}</p>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>订单状态： {stateDemo[data.state * 1]}</p>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>门店名称： {store.name}</p>
            </Col>
            <div style={{ display: `${state === "0" || state === "3" ? "none" : "block"}`}}>
              <Col className="gutter-row" span={6}>
                <p>支付单号：{data.transaction_id}</p>
              </Col>
              <Col className="gutter-row" span={6}>
                <p>支付方式： {payType[data.pay_type]}</p>
              </Col>
              <Col className="gutter-row" span={6}>
                <p>支付时间： {data.pay_time}</p>
              </Col>
              <Col className="gutter-row" span={6}>
                <p>订单总金额： ￥{data.order_amount}</p>
              </Col>
              <Col className="gutter-row" span={6}>
                <p>实际支付： ￥{data.pay_amount || 0}</p>
              </Col>
              <Col className="gutter-row" span={6}>
                <p>订单折扣： ￥{data.pay_discount || 0}</p>
              </Col>
            </div>
            <div style={{ display: `${state === "5" ? "block" : "none"}`}}>
              <Col className="gutter-row" span={6}>
                <p>退款金额： ￥{data.refund_money || 0}</p>
              </Col>
            </div>
          </Row>
          <Row>
            <Col className="gutter-row" span={6}>
              <div>
                <span>是否发送到erp：</span>
                {
                  data.is_send === "0" || !data.is_send ?
                  <Tag color="#2db7f5">未发送</Tag> :
                  data.is_send === "1" ?
                  <Tag color="#87d068">已发送</Tag> :
                  data.is_send === "2" ?
                  <Tag color="#f50">发送失败</Tag> : <Tag color="#f50">未知</Tag>
                }
              </div>
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col className="gutter-row" span={24}>
              <p>推送信息提示： {data.send_msg || "尚无推送信息！"}</p>
            </Col>
          </Row>
        </Card>
        <Card title="收货人信息" style={{ marginTop: 24 }} bordered={false} >
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <p>收货人：{clientUser.realname}</p>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>手机号码： {clientUser.phonenum}</p>
            </Col>
            {/* <Col className="gutter-row" span={6}>
              <p>会员卡号： {clientUser.card_no}</p>
            </Col>
            <Col className="gutter-row" span={6}>
              <p>邮箱地址： {clientUser.email}</p>
            </Col> */}
            <Col className="gutter-row" span={12}>
              <p>收货地址： {userAddress.address}</p>
            </Col>
          </Row>
        </Card>
        <Card style={{ marginTop: 24 }} title="订单商品" bordered={false} >
          <GoodsTable dataOrderGoods={orderGoods} dataGoods={goods} fetch={this.fetch} />
        </Card>
      </div>
    )
  }
}

export default BasicProfile