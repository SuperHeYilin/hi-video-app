import React, { Component } from 'react'
import { Form, Row, Col, InputNumber, Input, Icon } from 'antd';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const FormItem = Form.Item
const AddInfoForm = Form.create()(
  (props) => {
    const { form, item = {} } = props
    const { getFieldDecorator } = form
    return (
      <Form>
      {getFieldDecorator('id', {
        initialValue: item.sid,
      })(
        <Input type="hidden" />
      )}
      {getFieldDecorator('sotre_id', {
        initialValue: item.sotre_id,
      })(
        <Input type="hidden" />
      )}
      {getFieldDecorator('g_id', {
        initialValue: item.id,
      })(
        <Input type="hidden" />
      )}
      <FormItem {...formItemLayout} label="销售价">
        {getFieldDecorator('promPrice', {
          initialValue: item.promPrice,
          rules: [
            { required: true, message: '请填写销售价' },
          ],
        })(
          <InputNumber style={{ width: 120 }} />
        )}
        <span style={{ color: "#87d068", fontWeight: "bold"}}> 元</span>
      </FormItem>
      <FormItem {...formItemLayout} label="活动价">
        {getFieldDecorator('activity_price', {
          initialValue: item.activity_price,
          // rules: [
          //   { required: true, message: '请填写销售价' },
          // ],
        })(
          <InputNumber style={{ width: 120 }} />
        )}
        <span style={{ color: "#87d068", fontWeight: "bold"}}> 元</span>
      </FormItem>
      <FormItem {...formItemLayout} label="会员价">
        {getFieldDecorator('vip_price', {
          initialValue: item.vip_price,
          rules: [
            { required: true, message: '请填写会员价' },
          ],
        })(<InputNumber style={{ width: 120 }} />)}
        <span style={{ color: "#87d068", fontWeight: "bold"}}> 元</span>
      </FormItem>
      <FormItem {...formItemLayout} label="数量">
        {getFieldDecorator('count', {
          initialValue: item.count,
          rules: [
            { required: true, message: '请填写数量' },
          ],
        })(
          <InputNumber style={{ width: 120 }} />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="销售计量单位">
        {getFieldDecorator('UnitName', {
          initialValue: item.sUnitName,
          rules: [
            { required: true, message: '请填写销售单位' },
          ],
        })(
          <Input />
        )}
      </FormItem>
    </Form>
    )
  }
)
export default AddInfoForm