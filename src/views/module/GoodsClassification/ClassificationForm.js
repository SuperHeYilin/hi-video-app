import React, { Component } from 'react'
import { Form, Input, InputNumber } from 'antd'

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
}

class Classifacation extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  // 清空
  handleReset = () => {
    this.props.form.resetFields();
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { data = {}, pid } = this.props
    return (
      <div>
        <Form>
          {getFieldDecorator('id', {
            initialValue: data.id,
          })(
            <Input hidden />
          )}
          {getFieldDecorator('pid', {
            initialValue: pid,
          })(
            <Input hidden />
          )}
          {getFieldDecorator('type', {
            initialValue: data.type,
          })(
            <Input hidden />
          )}
          <FormItem
            {...formItemLayout}
            label="分类名称"
          >
            {getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{
                type: 'string', message: '请输入合法文本',
              }, {
                required: true, message: '请输入商品名称',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="菜单排序"
            extra="数字大小用于前端菜单显示顺序，小的靠前！"
          >
            {getFieldDecorator('sort', {
              initialValue: data.sort,
              rules: [{
                required: true, message: '请输入排序数字!',
              }],
            })(
              <InputNumber />
            )}
          </FormItem>
        </Form>
      </div>
    )
  }
}

const ClassifacationForm = Form.create()(Classifacation)
export default ClassifacationForm
