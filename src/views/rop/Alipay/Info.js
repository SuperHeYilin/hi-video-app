import React from 'react'
import { Form , Row , Col , Select , Input } from 'antd';

const FormItem = Form.Item
const Option = Select.Option

const AlipayAccountForm = Form.create()(
  (props) => {
    const { form , item = {} } = props;
    const { getFieldDecorator } = form;
    return (
        <Form layout="vertical" >
          {getFieldDecorator('id', {
            initialValue: item.id,
          })(
            <Input type="hidden"/>
          )}
            <Row gutter={12}>
                <Col lg={12} md={24} sm={24} xs={24} >
                    <FormItem label="应用名称">
                        {getFieldDecorator('alipay_name', {
                        initialValue: item.alipay_name,
                        rules: [
                            { required: true, message: '请填写应用名称' },
                        ],
                        })(
                        <Input placeholder="应用名称" />
                        )}
                    </FormItem>
                </Col>
                <Col lg={12} md={24} sm={24} xs={24} >
                    <FormItem label="应用环境">
                        {getFieldDecorator('runtime', {
                        initialValue: item.runtime,
                        rules: [
                            { required: true, message: '请选择应用环境' },
                        ],
                        })(
                        <Select
                            placeholder="选择应用环境"
                        >
                            <Option value="0">正式</Option>
                            <Option value="1">沙箱</Option>
                        </Select>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col lg={12} md={24} sm={24} xs={24} >
                    <FormItem label="app_id(应用id)">
                        {getFieldDecorator('app_id', {
                        initialValue: item.app_id,
                        rules: [
                            { required: true, message: '请填写应用id' },
                        ],
                        })(
                        <Input placeholder="应用id" />
                        )}
                    </FormItem>
                </Col>
                <Col lg={12} md={24} sm={24} xs={24} >
                    <FormItem label="seller_id(商户id)">
                        {getFieldDecorator('seller_id', {
                        initialValue: item.seller_id,
                        rules: [
                            { required: true, message: '请填写商户id' },
                        ],
                        })(
                        <Input placeholder="商户pid" />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col lg={24} md={24} sm={24} xs={24} >
                    <FormItem label="ali_public_key(支付宝公钥)">
                        {getFieldDecorator('ali_public_key', {
                        initialValue: item.ali_public_key,
                        rules: [
                            { required: true, message: '请填写支付宝公钥' },
                        ],
                        })(
                        <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} placeholder="支付宝公钥(ali_public_key)" />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col lg={12} md={24} sm={24} xs={24} >
                    <FormItem label="app_private_key(应用私钥)">
                        {getFieldDecorator('app_private_key', {
                        initialValue: item.app_private_key,
                        rules: [
                            { required: true, message: '请填写应用私钥' },
                        ],
                        })(
                        <Input type="textarea" autosize={{ minRows: 4, maxRows: 6 }} placeholder="应用私钥(private_key)" />
                        )}
                    </FormItem>
                </Col>
                <Col lg={12} md={24} sm={24} xs={24} >
                    <FormItem label="app_public_key(应用公钥)">
                        {getFieldDecorator('app_public_key', {
                        initialValue: item.app_public_key,
                        rules: [
                            { required: true, message: '请填写应用公钥' },
                        ],
                        })(
                        <Input type="textarea" autosize={{ minRows: 4, maxRows: 6 }} placeholder="应用公钥(public_key)" />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col lg={12} md={24} sm={24} xs={24} >
                    <FormItem label="format">
                        {getFieldDecorator('format', {
                        initialValue: "json",
                        })(
                        <Input readOnly disabled={true} />
                        )}
                    </FormItem>
                </Col>
                <Col lg={12} md={24} sm={24} xs={24} >
                    <FormItem label="charset">
                        {getFieldDecorator('charset', {
                        initialValue: "utf-8",
                        })(
                        <Input readOnly disabled={true} />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col lg={24}>
                    <FormItem label="return_url">
                        {getFieldDecorator('return_url', {
                        initialValue: item.return_url,
                        // rules: [
                        //     { required: true, message: '请填写支付跳转路径', type: 'url' },
                        // ],
                        })(
                        <Input placeholder="支付跳转路径" />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={12}>
                <Col lg={24}>
                    <FormItem label="notify_url">
                        {getFieldDecorator('notify_url', {
                        initialValue: item.notify_url,
                        rules: [
                            { required: true, message: '请填写支付回调路径', type: 'url' },
                        ],
                        })(
                        <Input placeholder="支付回调路径" />
                        )}
                    </FormItem>
                </Col>
            </Row>
        </Form>
    );
  }
);

export {
  AlipayAccountForm
}