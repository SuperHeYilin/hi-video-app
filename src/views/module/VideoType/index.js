import React, { Component } from 'react'
import { Card, Col, Button } from 'antd'
import { api, err as apierr } from '../../../utils'

import styles from './index.less'

const data = []
for (let i = 0; i < 100; i++) {
  data[i] = {
    id: i,
    name: "企划" + i,
    isActive: false,
  }
}

export default class Type extends Component {
  constructor(props) {
    super(props)
    this.state = {
       data: [],
    }
  }
  componentDidMount = () => {
    this.fetch()
  }
  fetch = () => {
    api
      .get("/video-type")
      .then((result) => {
        this.setState({ data: result })
      })
      .catch(apierr)
  }
  handleChoose = (id) => {
    const newData = [...this.state.data];
    const target = newData.filter(item => item.id === id)[0];
    if (target) {
      target.isActive = !target.isActive
      this.setState({ data: newData })
    }
  }
  // 搜索
  handleSearch = () => {
    const { data } = this.state
    const target = data.filter(item => item.isActive === true)

    console.log(target)
  }
  render() {
    const { data } = this.state
    return (
      <div className={styles.type}>
        <Card
          title="主题"
          hoverable
          extra={<Button onClick={this.handleSearch} >搜索</Button>}
        >
          {data.map((v, k) => {
            return (
              <Col xs={12} sm={8} md={6} lg={4} xl={4} key={k}>
                <div style={{ padding: 1}}>
                  <div className={styles.card} style={{ background: `${v.isActive ? "#CC0000" : "white"}`, color: `${v.isActive ? "#fff" : "black"}` }} onClick={() => this.handleChoose(v.id)} >
                    {v.name}
                  </div>
                </div>
              </Col>
            )
          })}
        </Card>
      </div>
    )
  }
}
