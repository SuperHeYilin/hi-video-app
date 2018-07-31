import React from 'react'
import { Select, Form, Radio, Input} from 'antd'

const FormItem = Form.Item

const TypeForm = Form.create()(
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
        <FormItem label="缩写">
          {getFieldDecorator('key_name', {
            initialValue: item.key_name,
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="类型名称">
          {getFieldDecorator('name', {
            initialValue: item.name,
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    )
  }
)

export default TypeForm