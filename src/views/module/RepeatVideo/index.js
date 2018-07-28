import React, { Component } from 'react'
import { Card, Icon, Avatar, Table, Row, Col, Tooltip, Switch, Button, Modal, message } from 'antd'
import { api, err } from '../../../utils'

const { Meta } = Card

/**
 * 文件重复对比 删除
 */
export default class RepeatVideo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allRepeat: [], // 所有重复数据
      firstRepeat: [], // 首个重复数据
      deleteIds: [], // 删除的文件id集合
      deleteItem: [], // 删除名称集合
      visible: false,
    }
  }
  componentDidMount = () => {
    this.fetch()
  }
  // 字符串超长截取
  handleChangeString = (value) => {
    if (value) {
      if (value.length > 19) {
        let str = value.slice(0, 16)
        str += "..."
        return str
      } else {
        return value
      }
    }
  }
  // 打开所有文件
  handleOpenAll = () => {
    const { firstRepeat } = this.state
    // 路径数组
    const ids = []
    firstRepeat.forEach((v, k) => {
      ids.push(v.id)
    })
    api.post("/file/open", { ids: ids.join(",")})
      .catch(err)
  }
  // 打开单个文件
  handleOpen = (id) => {
    api.post("/file/open", { ids: id})
      .catch(err)
  }
  // 删除切换
  handleChooseDelete = (boolean, id) => {
    const { deleteIds } = this.state
    const tempIds = deleteIds
    // true 删除选定
    if (boolean) {
      tempIds.push(id)
    } else {
      const index = tempIds.indexOf(id)
      if (index > -1) {
        tempIds.splice(index, 1)
      }
    }
    this.setState({ deleteIds: tempIds })
  }
  // 模态框
  showModal = () => {
    const { deleteIds, firstRepeat } = this.state
    const deleteItem = []
    // console.log("删除id集合：", deleteIds)
    firstRepeat.forEach((v, k) => {
      if (deleteIds.indexOf(v.id) > -1) {
        deleteItem.push(v.file_name)
      }
    })
    this.setState({
      visible: true,
      deleteItem,
    });
  }
  // 确认删除
  handleOk = (e) => {
    const { deleteIds } = this.state
    api.delete("/file/delete", {ids: deleteIds.join(",")})
      .then((value) => {
        if (value) {
          message.info("删除成功!")
        }
        this.fetch()
        this.setState({
          visible: false,
        });
      })
      .catch(err)
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  fetch = () => {
    api.get("/video/repeat")
      .then((value) => {
        const { allRepeat, firstRepeat } = value
        this.setState({
          allRepeat,
          firstRepeat,
        })
      })
      .catch(err)
  }
  render() {
    const { allRepeat, firstRepeat, visible, deleteItem } = this.state
    const columns = [{
      title: '文件名',
      dataIndex: 'file_name',
      key: 'file_name',
      render: text => <a>{text}</a>,
    }, {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    }, {
      title: '文件大小',
      width: 120,
      dataIndex: 'size_mb',
      key: 'size_mb',
      render: text => <span>{text} mb</span>,
    }, {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a className="ant-dropdown-link">
            More actions <Icon type="down" />
          </a>
        </span>
      ),
    }]
    return (
      <div>
        <Modal
          title="删除列表"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {
            deleteItem.map((v, k) => {
              return (
                <p key={k}>{v}</p>
              )
            })
          }
        </Modal>
        <Card
          title="重复验证"
          extra={
            <div>
              <Button type="primary" onClick={this.handleOpenAll} >打开全部</Button>
              <Button style={{ marginLeft: 12 }} onClick={this.showModal} >删除指定</Button>
            </div>}
        >
          <Row gutter={36}>
            {
              firstRepeat.map((v, k) => {
                return (
                  <Col xs={{ span: 8 }} style={{ marginTop: 24 }} key={k}>
                    <Card
                      // style={{ width: 300 }}
                      cover={<img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />}
                      actions={[<Icon type="play-circle" onClick={() => this.handleOpen(v.id)} />,
                      <Icon type="edit" />,
                      <Icon type="ellipsis" />,
                      <Switch checkedChildren="删除" unCheckedChildren="保留" onChange={(boolean) => this.handleChooseDelete(boolean, v.id)} />]}

                    >
                      <Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={
                          <Tooltip placement="topLeft" title={
                            <div>
                              <p>{v.file_name}</p>
                              <p>{v.path}</p>
                            </div>}
                          >
                            <p>{this.handleChangeString(v.file_name)}</p>
                            <p>{this.handleChangeString(v.path)}</p>
                          </Tooltip>
                        }
                        description={v.size_b}
                      />
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        </Card>
        <Table columns={columns} dataSource={allRepeat} rowKey={record => record.id} />
      </div>
    )
  }
}
