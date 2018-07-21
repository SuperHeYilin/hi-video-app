import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  Select,
  Button,
  Input,
  DatePicker,
}
from 'antd'
import { api } from '../../../utils'

const FormItem = Form.Item
const { Option } = Select
const RangePicker = DatePicker.RangePicker

class TableList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expandForm: false,
      store: [],
    }
  }

  componentWillMount() {
    this.requestStore()
  }

   // 获取所有的门店
  requestStore = () => {
    api
    .get("/pt/store/name")
    .then((result) => {
      this.setState({store: result})
    })
    .catch(api.err)
  }

  // 重置
  handleFormReset = (e) => {
    const { onSearch } = this.props
    onSearch({ state: "0,1,2,3,4,5,6" }, "0,1,2,3,4,5,6")
    this.props.form.resetFields()
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    })
  }

  handleSearch = (e) => {
    const { onSearch } = this.props

    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let t = {...values, 'create_time': ["", ""]}// 创建t对象接管values对时间选择组件值进行处理
        if (values.create_time) {
          const rangeValue = values['create_time']
            t = {
            ...values,
            'create_time': [rangeValue[0].format('YYYY-MM-DD 00:00:00'), rangeValue[1].format('YYYY-MM-DD 23:59:59')],
          }
        }
          onSearch({
            mobile: t.mobile,
            state: t.state,
            store: t.store,
            create_time: t.create_time[0],
            create_time1: t.create_time[1],
            pay_type: t.pay_type,
            erp: t.erp,
          }, t.state)
        // 直接请求封装请求参数
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { data = {} } = this.props
    const { mobile = "", erp = "all" } = data
    const { store } = this.state
    const rangeConfig = {
      rules: [{ type: 'array', message: 'Please select time!' }],
    }
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 24, lg: 24, xl: 24 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单查询：">
              {getFieldDecorator('mobile', {
                initialValue: mobile, // 设置默认值
              })(
                <Input placeholder="请输入订单号/手机号" style={{ width: 200 }} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('state', {
                  initialValue: "0,1,2,3,4,5,6", // 设置默认值
                })(
                <Select style={{ width: 140}}>
                  <Option value="0,1,2,3,4,5,6">全部</Option>
                  <Option value="0">待支付</Option>
                  <Option value="1">已支付</Option>
                  <Option value="2">已核验</Option>
                  <Option value="3">已取消</Option>
                  <Option value="4">退款申请</Option>
                  <Option value="5">已退款</Option>
                  <Option value="6">核验失败</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 24, lg: 24, xl: 24 }} style={{margin: 8}}>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              <FormItem>
                {getFieldDecorator('create_time', rangeConfig)(
                  <RangePicker style={{ width: 200 }} placeholder="起止日期" />
                )}
              </FormItem>
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <FormItem label="支付方式">
              {getFieldDecorator('pay_type', {
                  initialValue: "all", // 设置默认值
                })(
                <Select style={{ width: 140 }}>
                <Option value="all">全部</Option>
                  <Option value="0">微信支付</Option>
                  <Option value="1">余额支付</Option>
                  <Option value="2">提货卡支付</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="ERP状态">
              {getFieldDecorator('erp', {
                  initialValue: erp, // 设置默认值
                })(
                <Select style={{ width: 140 }}>
                  <Option value="all">全部</Option>
                  <Option value="0">未发送</Option>
                  <Option value="1">已发送</Option>
                  <Option value="2">发送失败</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24} >
            <div style={{ marginTop: 3 }}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 12 }} onClick={this.handleFormReset}>重置</Button>
            </div>
          </Col>
        </Row>
      </Form>
    )
  }
}
const TableListForm = Form.create()(TableList)

export default TableListForm