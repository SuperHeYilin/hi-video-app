import React from 'react'
import { Form, Input , InputNumber } from 'antd'
const FormItem = Form.Item
const TextArea = Input.TextArea

const OrderRefundInfo = Form.create()(
  (props) => {
    const { form , item = {} , maxMoney } = props;
    const { getFieldDecorator } = form;
    const payTypeNames = ['微信','余额','提货卡']
    return (
      <Form layout="vertical">
        {getFieldDecorator('id', {
          initialValue: item.id,
        })(
          <Input type="hidden" />
        )}
        <FormItem label="退款渠道">
          {getFieldDecorator('payType', {
            initialValue: payTypeNames[item.payType*1],
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem label="退款金额(不包含已退金额)">
          {getFieldDecorator('money', {
            initialValue: item.payAmount,
            rules: [
              { required: true, message: '请填写退款金额' },
            ],
          })(
            <InputNumber max={maxMoney} min={0} style={{width:'100%'}} />
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

export default OrderRefundInfo