import React, {Component} from 'react'
import { Col,Row,Card, Badge, Table, Divider,message,Modal,InputNumber} from 'antd';
import { Button,DescriptionList} from '../../../components/Ui'
import {api, err as apierr} from '../../../utils'
import styles from './View.less'

const { Description } = DescriptionList;

class CheckOrderView extends Component {
	constructor(props) {
        super(props)
        this.state = {
            visible: false,
            btnLoading:false
        }
    }
	componentDidMount() {
		
  }
	componentDidUpdate(){
	
	}
	
	showModal = () => {
    this.setState({
      visible: true,
    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
      btnLoading:false,
      numberValue:null
    });
  }
	
	onInputChange=(e)=>{
		this.setState({
      numberValue: e,
    });
		
	}
	
	onOkRefund = ()=>{
		let { data,onSearch } = this.props
		let {row,numberValue} = this.state
		if(!numberValue){
			message.error("请输入数量", 1)
			return 
		}
		this.setState({btnLoading: true});
		 api.put("/ticket/order/refund/tk",{orderId:data.id,childId:row.id,count:numberValue})
        .then((result) => {
	        if(result){
	        		message.success("操作成功!", 1,()=>{
	        			this.hideModal()
	        			onSearch()
	        		})
	        }else{
	        	 message.error("操作失败,请联系管理员！", 2)
	        	 this.setState({btnLoading: false});
	        }
        })
        .catch((err) => {
        	this.setState({btnLoading: false});
	        api.err(err)
        })
	}
	
	onRefund=(row)=>{
		this.setState({
      row: row,
    });
    this.showModal()
	}
	
	onOkTicket=()=>{
		 let { data,onFilter,clearInput } = this.props
		 api.put("/ticket/order/refund",{orderId:data.id})
        .then((result) => {
	        if(result){
	        		message.success("操作成功!", 1,()=>{
	        			clearInput()
	        			onFilter()
	        		})
	        }else{
	        	 message.info("未查询到订单!", 2)
	        }
        })
        .catch((err) => {
	        api.err(err)
        })
		 
	}
	
	render() {
		const goodsColumns = [
	      {
		    title: '商品图片',
		    dataIndex: 'src',
		    key: 'src',
		    render: (text, row, index) => {
		      return <img src={"/diffpi/upload/"+text} width="80" height="80"/>
		    },
		  },
		  {
		    title: '商品名称',
		    dataIndex: 'goods_name',
		    align: 'right',
		    key: 'goods_name',
		  },
		  {
		    title: '规格',
		    dataIndex: 'spec',
		    align: 'right',
		    key: 'spec',
		  },
		  {
		    title: '原价',
		    dataIndex: 'normal_price',
		    key: 'normal_price',
		    align: 'right',
		  },{
		    title: '会员价',
		    dataIndex: 'price',
		    key: 'price',
		    align: 'right'
		  },{
		    title: '数量',
		    dataIndex: 'num',
		    key: 'num',
		    align: 'right',
		  },
		];
	    let { data } = this.props
	    if(!data)return null
	    let {user} = data
	    return (
	        <Card bordered={false}>
	          <DescriptionList size="large" title="订单信息" style={{ marginBottom: 32 }}>
	            <Description term="门店名称">{data.name}</Description>
	            <Description term="订单号">{data.no}</Description>
	            <Description term="手机号">{data.phonenum}</Description>
	            <Description term="数量">{data.goods_num}</Description>
	            <Description term="订单金额">{data.order_amount}</Description>
	            <Description term="实付金额">{data.pay_amount}</Description>
	            <Description term="退款金额">{data.refund_money}</Description>
	            <Description term="付款方式">{['微信支付', '余额支付', '提货卡支付'][data.pay_type]}</Description>
	            <Description term="订单状态">{['待支付', '已支付', '已核验', '已取消', '退款申请', '已退款', '核验失败'][data.state]}</Description>
	            <Description term="创建时间">{data.create_time}</Description>
	            <Description term="支付时间">{data.pay_time}</Description>
	          </DescriptionList>
	          <Divider style={{ marginBottom: 32 }} />
	          <div className={styles.title}>商品列表</div>
	          <Table
	            style={{ marginBottom: 24 }}
	            dataSource={data.goods}
	            pagination={false}
	            columns={goodsColumns}
	            rowKey="id"
	          />
	          <div className={styles.title}></div>
	        </Card>
	    );
  }
}
export default CheckOrderView
