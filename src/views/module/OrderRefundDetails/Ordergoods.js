import React, { Component } from 'react'
import {
    Table,
    Button,
    message,
}
from 'antd'
import OrderGoodsRefundInfo from './OrderGoodsRefundInfo'
import { Layer } from '../../../components/Ui'
import { api } from '../../../utils'

class GoodsTable extends Component{
    hanldeRefundOrderGoods = (data,payType) => {
        let refForm

        Layer.open({
            title : "订单退款-商品",
            width : 400,
            content : <OrderGoodsRefundInfo item={data} payType={payType} maxNum={data.num} ref={(form) => { refForm = form}} />,
            onOk : (e)=>{
                refForm.validateFields((error, values) => {
                    if (error) {
                        return;
                    }

                    api
                    .put("/module/order/refund/goods",{...values})
                    .then((result)=>{
                        message.success("退款成功!")
                        Layer.close()
                        this.props.refresh()
                    })
                    .catch(api.err)
                })
            },
        })
    }

    render(){
        let { data={} } =this.props
        
        const columns=[
            // { title: '商品编码', width: 80, dataIndex: 'goods_id', key: 'goods_id'},
            { title: '商品名称', width: 150, dataIndex: 'goods_name', key: 'goods_name', render: (name,row)=>{
                if(row.type*1 === 1){
                    return name+"购物袋"
                }
                return name
            }},
            { title: '商品规格', dataIndex: 'spec', key: 'spec', width: 80 },
            { title: '商品数量', dataIndex: 'num', key: 'num', width: 150 , render: (num,row)=>{
                return num+row.refund_num
            }},
            { title: '退款数量', dataIndex: 'refund_num', key: 'refund_num', width: 150 },
            { title: '原价', dataIndex: 'normal_price', key: 'normal_price', width: 150 },
            { title: '折扣金额', dataIndex: 'discount', key: 'discount', width: 150 },
            { title: '实际售价', dataIndex: 'price', key: 'price', width: 150 },
            { title: '操作', dataIndex: 'id', width: 150, render:(id,row)=>{
                const isRefund = data.state === '5' || row.num === 0
                return <Button type="danger" size="small" onClick={()=>{this.hanldeRefundOrderGoods(row,data.pay_type)}} disabled={isRefund} >{isRefund ? "已退款" : "退款"}</Button>
            }},
        ]
        
        return(
            <Table columns={columns} dataSource={data.orderGoods} pagination={false} />
        )
    }    
}

GoodsTable.defaultProps = {
    data:{}
}

export default GoodsTable