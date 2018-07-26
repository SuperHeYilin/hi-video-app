import React, { Component } from 'react'
import { Form, Input} from 'antd';

const FormItem = Form.Item;

const ModelForm = Form.create()(
  (props) => {
    const { form, item = {} } = props;
    const { getFieldDecorator } = form;
    return (
        <Form layout="vertical">
          {getFieldDecorator('id', {
            initialValue: item.id,
          })(
            <Input type="hidden" />
          )}
          <FormItem label="配置名称">
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                { required: true, message: '请填写配置名称' },
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="键">
            {getFieldDecorator("key_name", {
              initialValue: item.key_name,
              rules: [
                { required: true, message: '请填写值' },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="值">
            {getFieldDecorator('value', {
              initialValue: item.value,
              rules: [
                { required: true, message: '请填写值' },
              ],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
    );
  }
);

export default ModelForm