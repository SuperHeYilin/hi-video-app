import React,{ Component } from 'react'
import { Button, Modal, Form , Radio , Icon , Input} from 'antd';
const FormItem = Form.Item;

const UserForm = Form.create()(
  (props) => {
    const { form , item = {} } = props;
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
          <FormItem label="登陆密码">
            {getFieldDecorator('password',{
              initialValue: item.password,
              rules: [
                { required: true, message: '请填写密码' },
              ],
            })(<Input required />)}
          </FormItem>
          <FormItem label='用户名'>
            {getFieldDecorator('full_name', {
              initialValue: item.full_name,
            })(
              <Input />
            )}
          </FormItem>
        </Form>
    );
  }
);

export {
  UserForm
}