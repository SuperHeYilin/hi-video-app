import React,{ Component } from 'react'
import { Form , Row , Col , Select , Input,Icon } from 'antd';
import { Layer,Button,PicturesWall} from '../../../components/Ui' 
import { api, err as apierr } from '../../../utils'
const FormItem = Form.Item
const Option = Select.Option
const QuartzForm = Form.create()(
  (props) => {
    const { form , item = {} } = props;
    const { setFieldsValue,getFieldDecorator } = form;
    const fileprops = {
		};	
    return (
        <Form layout="vertical" >
        		<Row gutter={24}>
                <Col lg={24} md={24} sm={24} xs={24} >
                    <FormItem label="触发器分组">
                        {getFieldDecorator('group', {
                        initialValue: item.TRIGGER_GROUP,
                        rules: [
                            { required: true, message: '请输入触发器分组' },
                        ],
                        })(
                        <Input placeholder="触发器分组"  />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col lg={24} md={24} sm={24} xs={24} >
                    <FormItem label="触发器名称">
                        {getFieldDecorator('triggerName', {
                        initialValue: item.TRIGGER_NAME,
                        rules: [
                            { required: true, message: '请输入触发器名称' },
                        ],
                        })(
                        <Input placeholder="触发器名称"  />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col lg={24} md={24} sm={24} xs={24} >
                    <FormItem label="作业类名称">
                        {getFieldDecorator('job_class_name', {
                        initialValue: item.JOB_CLASS_NAME||'cn.diffpi.core.quartz.model.TestJob',
                        rules: [
                            { required: true, message: '请输入作业类名称' },
                        ],
                        })(
                        <Input placeholder="作业类名称"  />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col lg={24} md={24} sm={24} xs={24} >
                    <FormItem label="时间规则">
                        {getFieldDecorator('cronExpression', {
                        initialValue: item.CRON_EXPRESSION||'0 7/5 09-23 * * ?',
                        rules: [
                            { required: true, message: '请输入Cron 表达式' },
                        ],
                        })(
                        <Input placeholder="Cron 表达式"  />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col lg={24} md={24} sm={24} xs={24} >
                    <FormItem label="作业描述">
                        {getFieldDecorator('description', {
                        initialValue: item.DESCRIPTION,
                        rules: [
                            { required: true, message: '请输入作业描述' },
                        ],
                        })(
                        <Input placeholder="作业描述" type="textarea" rows={4} />
                        )}
                    </FormItem>
                </Col>
            </Row>
        </Form>
    );
  }
);

export {
  QuartzForm
}