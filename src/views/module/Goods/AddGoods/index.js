import React, { Component } from 'react'
import { Card, Button } from 'antd'
import GoodsForm from './GoodsForm'
import { api, err as apierr } from '../../../../utils'

export default class AddGoods extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {id: 0}, // 商品信息
      classType: [], // 商品类别
    }
  }
  componentDidMount = () => {
    const { match } = this.props
    const { id = "0" } = match.params
    if (id !== "0") {
      this.fetch(id)
    } else {
      this.fetchClass()
    }
  }
  fetch = (id) => {
    api
      .get("/pt/goods/id", {id})
      .then((data) => {
        this.setState({ data })
      })
      .catch(apierr)
    api
      .get("/module/classification/builder")
      .then((data) => {
        this.setState({ classType: data })
      })
      .catch(apierr)
  }
  fetchClass = () => {
    api
      .get("/module/classification/builder")
      .then((data) => {
        this.setState({ classType: data, data: {id: -1} })
      })
      .catch(apierr)
  }
  render() {
    const { data, classType } = this.state
    return (
      <div>
        {/* <Card title={
          <div>
          商品信息
          </div>
          }
        >
        </Card> */}
        <Button style={{ marginRight: 12 }} icon="rollback" onClick={() => {this.props.history.push("/module/goods")}}>
          返回
        </Button>
        <GoodsForm data={data} classType={classType} history={this.props.history} />
      </div>
    )
  }
}
