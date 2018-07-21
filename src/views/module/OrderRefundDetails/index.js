import React, { Component } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    message,
} from 'antd'
import OrderRefundInfo from './OrderRefundInfo'
import GoodsTable from './Ordergoods'
import { Layer } from '../../../components/Ui'
import { api } from '../../../utils'

class BasicProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
    }
  }

	componentDidMount(){
    this.fetch()
  }

  handleOrderRefund = () => {
    let { data } = this.state
    let refundMoney = data.refund_money || 0
    refundMoney = (data.pay_amount - refundMoney).toFixed(2)
    let refForm

    Layer.open({
        title : "订单退款-整单",
        width : 400,
        content : <OrderRefundInfo item={{id:data.id,payAmount:refundMoney,payType:data.pay_type}} maxMoney={refundMoney} ref={(form) => { refForm = form}} />,
        onOk : (e)=>{
            refForm.validateFields((error, values) => {
                if (error) {
                    return;
                }

                api
                .put("/module/order/refund",{...values})
                .then((result)=>{
                    message.success("退款成功!")
                    Layer.close()
                    this.fetch()
                })
                .catch(api.err)
            })
        },
    })
  }

    handleRefresh = () => {
        this.fetch()
    }

    fetch =() =>{        
        let id = this.props.match.params.id;            
        api.get("/order/details",{id:id})
        .then((data) => {
            this.setState({
                data: data,
            })
        })
    }

    renderExtraBtn = () => {
        let { data } = this.state

        return <span>
            <a href="javascript:history.go(-1);">返回</a>
            <Button type="danger" size="small" style={{marginLeft:20}} onClick={this.handleOrderRefund} disabled={data.state === '5'} >{data.state === '5' ? "已退款" : "整单退款"}</Button>
        </span>
    }
	
    render(){
        let { data = {} } =this.state
        if(!data.id){
            return null
        }
        const state = ['待支付','已支付','已核验','已取消','退款申请','已退款','核验失败'];
        const payType = ['微信支付','余额支付','提货卡支付'];
        return(
            <div>
              <Card title="订单详情" bordered={false} extra={this.renderExtraBtn()} >
                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                        <p>订单单号：{data.no}</p>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <p>订单状态： {state[data.state*1]}</p>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <p>门店名称： {data.name}</p>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <p>支付方式： {payType[data.pay_type*1]}</p>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <p>结账时间： {data.pay_time}</p>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <p>订单总金额： ￥{data.order_amount}</p>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <p>实际支付： ￥{data.pay_amount}</p>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <p>订单折扣： ￥{data.pay_discount}</p>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <p>退款金额： ￥{data.refund_money}</p>
                    </Col>
                </Row>
             </Card>          
             <Card title="订单商品" bordered={false} >
                <GoodsTable data={data} refresh={this.handleRefresh} />              
             </Card>
            </div>
        )
    }
}

export default BasicProfile