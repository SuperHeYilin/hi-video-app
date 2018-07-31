import React, { Component } from 'react'
import { Card, Button, Table, Divider, message, Popconfirm } from 'antd'
import { Layer } from '../../../components/Ui'
import TypeForm from './TypeForm'
import { api, err as apierr } from '../../../utils'

export default class TypeManage extends Component {
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

  confirm = (id) => {
    this.handleDelete(id)
  }
  cancel = (e) => {
  }
  handleAdd = () => {
    let refForm;
    Layer.open({
      title: "视频类型-新增",
      content: <TypeForm ref={(form) => { refForm = form }} />,
      onOk: (e) => {
        refForm.validateFields((error, values) => {
          if (error) {
            return;
          }
          api
            .post("/video-type", { hiVideoType: values })
            .then((result) => {
              if (result) {
                message.success("添加成功!")
                this.fetch()
              }
              Layer.close()
            })
            .catch(apierr)
        })
      },
    })
  }
  handleUpdate = (record) => {
    let refForm;
    Layer.open({
      title: "视频类型-更新",
      content: <TypeForm item={record} ref={(form) => { refForm = form }} />,
      onOk: (e) => {
        refForm.validateFields((error, values) => {
          if (error) {
            return;
          }
          api
            .put("/video-type", { hiVideoType: values })
            .then((result) => {
              if (result) {
                message.success("更新成功!")
                Layer.close()
                this.fetch()
              }
            })
            .catch(apierr)
        })
      },
    })
  }
  handleDelete = (id) => {
    api
      .delete("/video-type", { id })
      .then((result) => {
        if (result) {
          message.success("删除成功!")
          Layer.close()
          this.fetch()
        }
      })
      .catch(apierr)
  }

  render() {
    const { data } = this.state
    const columns = [{
      title: '缩写',
      dataIndex: 'key_name',
      key: 'key_name',
      render: text => <span style={{ fontWeight: "bold" }}>{text}</span>,
    }, {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleUpdate(record)} >更新</a>
          <Divider type="vertical" />
          <Popconfirm title="确认删除?" onConfirm={() => this.confirm(record.id)} onCancel={this.cancel} okText="是" cancelText="否">
            <a>删除</a>
          </Popconfirm>
        </span>
      ),
    }];
    return (
      <div>
        <Card title="类型管理" extra={<Button type="primary" onClick={this.handleAdd} >添加</Button>}>
          <Table columns={columns} dataSource={data} />
        </Card>
      </div>
    )
  }
}
