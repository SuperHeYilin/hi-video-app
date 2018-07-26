import React, { Component } from 'react'
import { Button, Card, message, Table } from 'antd'
import { api, err } from '../../../utils'
import { Layer } from '../../../components/Ui'

import ModelForm from './ModelForm'

export default class HiConfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
    }
  }
  componentDidMount = () => {
    this.fetch()
  }
  handleEdit = (record) => {
    let refForm;
    Layer.open({
      title: "配置编辑",
      width: 500,
      content: <ModelForm item={record} ref={(form) => {refForm = form}} />,
      onOk: (e) => {
        refForm.validateFields((error, values) => {
          if (error) {
            return;
          }
          api
            .put("/config", { hiConfig: values })
            .then((result) => {
              message.success("更新成功!")
              Layer.close()
              this.fetch()
            })
            .catch(err)
        })
      },
    })
  }
  handleAdd = () => {
    let refForm;
    Layer.open({
      title: "添加配置",
      width: 500,
      content: <ModelForm ref={(form) => { refForm = form }} />,
      onOk: (e) => {
        refForm.validateFields((error, values) => {
          if (error) {
            return;
          }
          api
            .post("/config", { hiConfig: values })
            .then((result) => {
              message.success("添加成功!")
              Layer.close()
              this.fetch()
            })
            .catch(err)
        })
      },
    })
  }
  fetch = () => {
    api.get("/config")
      .then((value) => {
        this.setState({
          data: value,
        })
      })
      .catch(err)
  }
  render() {
    const { data } = this.state
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    }, {
      title: '键',
      dataIndex: 'key_name',
      key: 'key_name',
    }, {
      title: '值',
      dataIndex: 'value',
      key: 'value',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button onClick={() => this.handleEdit(record)} >编辑</Button>
        </span>
      ),
    }];
    return (
      <div>
        <div style={{ textAlign: "right", background: "white", padding: 5, marginBottom: 24 }}>
          <Button type="primary" onClick={this.handleAdd} >添加</Button>
        </div>
        <Table columns={columns} dataSource={data} rowKey={record => record.id} />
      </div>
    )
  }
}
