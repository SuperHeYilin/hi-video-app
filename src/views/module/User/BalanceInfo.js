import React from 'react'
import { Form, Input, Radio, InputNumber } from 'antd'

const FormItem = Form.Item
const RadioGroup = Radio.Group

const BalanceInfo = Form.create()(
  (props) => {
    const { form, item = {} } = props
    const { getFieldDecorator } = form
    return (
      <Form layout="vertical">
        {getFieldDecorator('userId', {
          initialValue: item.id,
        })(
          <Input type="hidden" />
        )}
        <FormItem label="用户名">
          {getFieldDecorator('name', {
            initialValue: item.name,
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem label="手机号码">
          {getFieldDecorator('phonenum', {
            initialValue: item.phonenum,
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem label="当前余额">
          {getFieldDecorator('balance',{
            initialValue: item.balance,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="变更原因">
          {getFieldDecorator('body',{
            initialValue: "后台变更",
            rules: [
            { required: true, message: '请填写变更原因' },
            ],
          })(<Input placeholder="后台变更" />)}
        </FormItem>
        <FormItem label="金额大小">
          {getFieldDecorator('money', {
            rules: [
            { required: true, message: '请输入金额大小' },
            ],
          })(<InputNumber max="100000" style={{lineHeight: "32px", height: "auto", width: "100%"}} size="large" placeholder="金额大小" />)}
        </FormItem>
        <FormItem label="变更方式" style={{lineHeight:"auto"}} >
          {getFieldDecorator('plusMinus', {
              initialValue: "1",
          })(
          <RadioGroup>
              <Radio value="1">增加</Radio>
              <Radio value="0">减少</Radio>
          </RadioGroup>
          )}
        </FormItem>
      </Form>
    )
  }
)

export default BalanceInfo