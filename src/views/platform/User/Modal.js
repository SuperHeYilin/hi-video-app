import React from 'react'
import { Select, Form, Radio, Input} from 'antd'

const FormItem = Form.Item
const { Option } = Select
const RadioGroup = Radio.Group

const UserForm = Form.create()(
  (props) => {
    const { form, item = {}, stores = [] } = props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="vertical">
        {getFieldDecorator('id', {
          initialValue: item.id,
        })(
          <Input type="hidden" />
        )}
        <FormItem label="用户名">
          {getFieldDecorator('username', {
            initialValue: item.username,
            rules: [
              { required: true, message: '请填写用户名' },
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="所在门店">
          {getFieldDecorator('store', {
            initialValue: item.store,
          })(
            <Select>
              {stores.map((store, index) => {
                return <Option key={store.id} value={store.id} >{store.name}</Option>
              })}
            </Select>
          )}
        </FormItem>
        <FormItem label="用户类型">
          {getFieldDecorator('user_type',{
            initialValue: item.user_type || '0',
          })(
            <RadioGroup>
              <Radio value="0">普通用户</Radio>
              <Radio value="1">非受限人员</Radio>
            </RadioGroup>
          )}
        </FormItem>
        {!item.id ?
          <FormItem label="登录密码">
            {getFieldDecorator('password',{
              rules: [
                { required: true, message: '请填写密码' },
              ],
            })(<Input type="password" required />)}
          </FormItem>
          :
          null
        }
        <FormItem label="姓名">
          {getFieldDecorator('full_name', {
            initialValue: item.full_name,
            rules: [
              { required: true, message: '请输入姓名' },
            ],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="手机号">
          {getFieldDecorator('mobile', {
            initialValue: item.mobile,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="openid">
          {getFieldDecorator('openid', {
            initialValue: item.openid,
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    )
  }
)

export {
  UserForm,
}