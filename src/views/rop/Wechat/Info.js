import React,{ Component } from 'react'
import { Tabs , Form , Row , Col , Select , Input } from 'antd';

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option

const WechatAccountForm = Form.create()(
  (props) => {
    const { form , item = {} } = props
    const { getFieldDecorator } = form
    return (
        <Form layout="vertical">
          {getFieldDecorator('id', {
            initialValue: item.id,
          })(
            <Input type="hidden"/>
          )}
          <Tabs defaultActiveKey="1" size="small">
            <TabPane tab="公众号信息" key="1">
                <Row gutter={12}>
                    <Col lg={12} md={24} sm={24} xs={24} >
                        <FormItem label="微信名称">
                            {getFieldDecorator('wechat_name', {
                            initialValue: item.wechat_name,
                            rules: [
                                { required: true, message: '请填写微信名称' },
                            ],
                            })(
                            <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} md={24} sm={24} xs={24} >
                        <FormItem label="微信号">
                            {getFieldDecorator('wechat_number', {
                            initialValue: item.wechat_number,
                            rules: [
                                { required: true, message: '请填写微信号' },
                            ],
                            })(
                            <Input />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col lg={12} md={24} sm={24} xs={24} >
                        <FormItem label="app_id">
                            {getFieldDecorator('app_id', {
                            initialValue: item.app_id,
                            rules: [
                                { required: true, message: '请填写微信APPID' },
                            ],
                            })(
                            <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} md={24} sm={24} xs={24} >
                        <FormItem label="app_secret">
                            {getFieldDecorator('app_secret', {
                            initialValue: item.app_secret,
                            rules: [
                                { required: true, message: '请填写微信开发者秘钥' },
                            ],
                            })(
                            <Input />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col lg={12} md={24} sm={24} xs={24} >
                        <FormItem label="token">
                            {getFieldDecorator('token', {
                            initialValue: item.token,
                            rules: [
                                { required: true, message: '请填写微信token' },
                            ],
                            })(
                            <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} md={24} sm={24} xs={24} >
                        <FormItem label="账号类型" hasFeedback>
                            {getFieldDecorator('type', {
                            initialValue: item.type,
                            rules: [
                                { required: true, message: '请选择账号类型'},
                            ],
                            })(
                            <Select
                                placeholder="选择账号类型"
                            >
                                <Option value="0">服务号</Option>
                                <Option value="1">订阅号</Option>
                                <Option value="2">企业号</Option>
                            </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col lg={24}>
                        <FormItem label="encodingAesKey">
                            {getFieldDecorator('encodingAesKey', {
                            initialValue: item.encodingAesKey,
                            rules: [
                                { required: true, message: '请填写微信encodingAesKey' },
                            ],
                            })(
                            <Input />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </TabPane>
            <TabPane tab="商户信息" key="2">
                <Row gutter={12}>
                    <Col lg={12} md={24} sm={24} xs={24} >
                        <FormItem label="商户key">
                            {getFieldDecorator('partner_key', {
                            initialValue: item.partner_key,
                            rules: [
                                { required: true, message: '请填写商户key' },
                            ],
                            })(
                            <Input />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} md={24} sm={24} xs={24} >
                        <FormItem label="商户号">
                            {getFieldDecorator('mch_id', {
                            initialValue: item.mch_id,
                            rules: [
                                { required: true, message: '请填写商户号' },
                            ],
                            })(
                            <Input />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col lg={24} md={24} sm={24} xs={24} >
                        <FormItem label="支付通知回调">
                            {getFieldDecorator('pay_notify_url', {
                            initialValue: item.pay_notify_url,
                            rules: [
                                { required: true, message: '请填写回调路径', type: 'url' },
                            ],
                            })(
                            <Input />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </TabPane>
          </Tabs>
          
        </Form>
    );
  }
);

export {
  WechatAccountForm
}