import React, { Component } from 'react'
import { Row, Col, Card, Icon, Avatar, Progress, Button, Radio, Table } from 'antd'
import { api, err as apierr } from '../../../utils'

const { Meta } = Card
const RadioGroup = Radio.Group

export default class VideoPK extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {},
       model: "all", // 随机模式
       id: 0, // 雷主id
       winHope: 0, // 胜率期望
       range: [], // 排名
    }
  }
  componentDidMount = () => {
    this.fetch()
  }
  // 模式选择
  handleModelChage = (e) => {
    this.setState({ model: e.target.value })
  }
  // 选择优胜者 切换下一轮
  handleChooseWin = (value) => {
    const { data } = this.state
    const { a = {}, b = {} } = data
    api
      .post("/video/change-score", { aId: a.id, bId: b.id, score: value })
      .catch(apierr)
    this.fetch()
  }
  fetch = () => {
    const { id, model } = this.state
    api
      .get("/video/rand", { type: model, id })
      .then((result) => {
        this.setState({ data: result, id: result.a.id, winHope: result.winHope, range: result.range })
      })
      .catch(apierr)
  }
  render() {
    const { model, data, winHope, range } = this.state
    const { a = {}, b = {} } = data
    const columns = [{
      title: '等级分',
      dataIndex: 'score',
      key: 'score',
    }, {
      title: '名称',
      dataIndex: 'file_name',
      key: 'file_name',
    }, {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    }]
    return (
      <div>
        <Card
          title="积分对比"
          extra={
            <RadioGroup onChange={this.handleModelChage} value={model}>
              <Radio value="all">随机模式</Radio>
              <Radio value="one">优胜模式</Radio>
            </RadioGroup>
          }
        >
          <Row gutter={24}>
            <Col xs={{ span: 5 }} lg={{ span: 8 }}>
              <Card
                // style={{ width: 300 }}
                cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
              >
                <Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={a.file_name}
                  description={
                    <div>
                      <p>{a.score} 分</p>
                      <p>{a.path}</p>
                    </div>
                  }
                />
              </Card>
            </Col>
            <Col xs={{ span: 5 }} lg={{ span: 8 }}>
              <Progress percent={winHope} size="large" style={{ marginTop: 24 }} />
              <div style={{ marginTop: 50, textAlign: "center" }}>
                <Button type="primary" shape="circle" icon="left" size="large" onClick={() => this.handleChooseWin(1.0)} />
                <Button type="primary" shape="circle" icon="pause" size="large" style={{ marginLeft: 24 }} onClick={() => this.handleChooseWin(0.5)} />
                <Button type="primary" shape="circle" icon="right" size="large" style={{ marginLeft: 24 }} onClick={() => this.handleChooseWin(0.0)} />
              </div>
            </Col>
            <Col xs={{ span: 5 }} lg={{ span: 8 }}>
              <Card
                // style={{ width: 300 }}
                cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                actions={[<Icon type="setting" />, <Icon type="edit" />, <Icon type="ellipsis" />]}
              >
                <Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={b.file_name}
                  description={
                    <div>
                      <p>{b.score} 分</p>
                      <p>{b.path}</p>
                    </div>
                  }
                />
              </Card>
            </Col>
          </Row>
        </Card>
        <Card title="排名">
          <Table dataSource={range} columns={columns} rowKey={record => record.id} />
        </Card>
      </div>
    )
  }
}
