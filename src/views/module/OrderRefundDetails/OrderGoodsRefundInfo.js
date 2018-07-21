import React from 'react'
import { Form, Input , InputNumber, Alert } from 'antd'
const FormItem = Form.Item
const TextArea = Input.TextArea

const OrderGoodsRefundInfo = Form.create()(
  (props) => {
    const { form , item = {} , maxNum , payType } = props
    let { refund_num , goods_name , price } = item
    refund_num = refund_num || maxNum
    const { getFieldDecorator , getFieldValue } = form
    const payTypeNames = ['微信','余额','提货卡']
    let refundMoney = getFieldValue('refundNum') !== undefined ? getFieldValue('refundNum')*price : refund_num*price
    return (
      <Form layout="vertical">
        <Alert message="退款的订单金额*（用户实际支付金额/订单总金额），即按订单优惠比例退款" type="warning" closable showIcon />
        {getFieldDecorator('goodsId', {
          initialValue: item.id,
        })(
          <Input type="hidden" />
        )}
        {getFieldDecorator('orderId', {
          initialValue: item.orderid,
        })(
          <Input type="hidden" />
        )}
        <FormItem label="退款渠道">
          {getFieldDecorator('payType', {
            initialValue: payTypeNames[payType*1],
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem label="商品名称">
          {getFieldDecorator('goods_name', {
            initialValue: goods_name,
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem label="退款金额">
          {getFieldDecorator('money', {
            initialValue: refundMoney,
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem label="退款数量">
          {getFieldDecorator('refundNum', {
            initialValue: refund_num,
            rules: [
              { required: true, message: '请输入需退款的商品数量' },
            ],
          })(
            <InputNumber max={maxNum} min={1} style={{width:'100%'}} />
          )}
        </FormItem>
        <FormItem label="退款原因">
          {getFieldDecorator('desc', {
            initialValue: item.desc,
          })(
            <TextArea />
          )}
        </FormItem>
      </Form>
    )
  }
)

export default OrderGoodsRefundInfo