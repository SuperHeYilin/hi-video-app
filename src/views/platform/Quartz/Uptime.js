import React,{ Component } from 'react'
import { Form , Row , Col , Select , Input,Icon } from 'antd';
import { Layer,Button,PicturesWall} from '../../../components/Ui' 
import { api, err as apierr } from '../../../utils'
const FormItem = Form.Item
const QuartzUptimeForm = Form.create()(
  (props) => {
    const { form , item = {} } = props;
    const { setFieldsValue,getFieldDecorator } = form;
    return (
        <Form layout="vertical" >
          {getFieldDecorator('triggerName', {
            initialValue: item.TRIGGER_NAME,
          })(
            <Input type="hidden"/>
          )}
          {getFieldDecorator('group', {
            initialValue: item.TRIGGER_GROUP,
          })(
            <Input type="hidden"/>
          )}
            <Row gutter={24}>
                <Col lg={24} md={24} sm={24} xs={24} >
                    <FormItem label="Cron 表达式">
                        {getFieldDecorator('cronExpression', {
                        initialValue: item.CRON_EXPRESSION,
                        rules: [
                            { required: true, message: '请输入正确的Cron表达式' },
                        ],
                        })(
                        <Input placeholder="Cron 表达式"  />
                        )}
                    </FormItem>
                </Col>
            </Row>
        </Form>
    );
  }
);

export {
  QuartzUptimeForm
}