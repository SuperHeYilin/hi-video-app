import React, { Component } from 'react'
import {
  Row,
  Col,
  Card,
  Input,
  message,
  Modal,
  Select,
} from 'antd'
import Orderform from './OrderForm'
import { Button } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'

const Search = Input.Search
const ButtonGroup = Button.Group
const confirm = Modal.confirm
const Option = Select.Option
class OrderFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFilter: false,
    }
  }

  // 条形码 名称查询
  onSearch = (value) => {
    const { onFilter, data } = this.props
    onFilter({ ...data, mobile: value }, "0,1,2,3,4,5,6")
  }
  // erp状态查询
  onState = (value) => {
    const { onFilter, data } = this.props
    onFilter({ ...data, erp: value }, "0,1,2,3,4,5,6")
  }

  handleDelete = () => {
    let { selected: { keys }, onFilter } = this.props
    // 弹出一个模态框            
    confirm({
      title: '确定要删除选中项吗?',
      onOk() {
        api
          .put("/module/order/delete", { ids: keys.join(",") })
          .then((data) => {
            message.success("删除成功!")
            onFilter({ refresh: keys })//传入一个刷新标记刷新table
          })
          .catch(apierr)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  handleShowFilter = () => {
    let isFilter = !this.state.isFilter
    this.setState({ isFilter })
  }

  render() {
    const { onFilter, data } = this.props
    let { selected: { keys } } = this.props
    const { isFilter } = this.state
    if (!keys) keys = []
    return (
      <div>
        <Row gutter={24}>
          <Col lg={6} md={12} sm={16} xs={18}>
            <ButtonGroup>
              <Button type="ghost" disabled={keys.length < 1} icon="delete" onClick={this.handleDelete}>{keys.length > 1 ? "批量删除" : "删除订单"}</Button>
            </ButtonGroup>
          </Col>
          <Col lg={{ offset: 8, span: 10 }} md={12} sm={8} xs={0} style={{ textAlign: 'right' }}>
            <span style={{ display: `${isFilter ? "none" : "inline"}` }}>
              <Select style={{ width: '30%', marginRight: 8 }} onChange={this.onState} placeholder="ERP状态" >
                <Option value="all">全部</Option>
                <Option value="0">未发送</Option>
                <Option value="1">已发送</Option>
                <Option value="2">发送失败</Option>
              </Select>
              <Search
                placeholder="订单编号/手机号"
                style={{ width: 200 }}
                onSearch={this.onSearch}
              />
            </span>
            <ButtonGroup style={{ marginLeft: "5px" }}>
              <Button type="dashed" icon="down" onClick={this.handleShowFilter}>筛选</Button>
            </ButtonGroup>
          </Col>
          <Col lg={0} md={0} sm={0} xs={6} style={{ textAlign: 'right' }}>
            <ButtonGroup>
              <Button type="dashed" icon="filter" onClick={this.handleShowFilter} />
            </ButtonGroup>
          </Col>
        </Row>
        <Card style={{ marginTop: '10px', display: isFilter ? "block" : "none" }} >
          <Orderform onSearch={onFilter} data={data} />
        </Card>
      </div>
    )
  }
}

export default OrderFilter