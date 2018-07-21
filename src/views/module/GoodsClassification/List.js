import React, { Component } from 'react'
import { Table, Button, Modal, message } from 'antd'
import { Layer } from '../../../components/Ui'
import ClassificationForm from './ClassificationForm'
import { api } from '../../../utils'

const confirm = Modal.confirm

export default class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
       data: [], // 分类列表
    }
  }
  // 查看下一级
  onFindNext = (record) => {
    const { id } = record
    this.props.onChangePid(id)
  }
  // 添加下一级
  onAddNext = (record) => {
    // 当前分类id 作为子分类的pid
    const { id } = record
    const { pid, onChangePid } = this.props
    let refForm
    Layer.open({
      title: "新增子分类",
      width: '500px',
      height: '400px',
      content: <ClassificationForm pid={record.pid} ref={(form) => {refForm = form}} />,
      onOk: (e) => {
        refForm.validateFields((error, values) => {
          if (error) {
            return;
          }
          api
            .post("/module/classification", { goodsClassification: {...values, pid: id } })
            .then((data) => {
              if (data) {
                message.success("添加子集成功", 1, () => {
                  onChangePid(pid)
                })
              }
              Layer.close()
            })
            .catch(api.err)
        })
      },
    })
  }
  // 更新
  handleUpdate = (record) => {
    const { pid, onChangePid } = this.props
    let refForm
    Layer.open({
      title: "新增分类",
      width: '500px',
      height: '400px',
      content: <ClassificationForm data={record} pid={record.pid} ref={(form) => {refForm = form}} />,
      onOk: (e) => {
        refForm.validateFields((error, values) => {
          if (error) {
            return;
          }
          api
            .put("/module/classification", { goodsClassification: values })
            .then((data) => {
              if (data) {
                message.success("更新成功", 1, () => {
                  onChangePid(pid)
                })
              }
              Layer.close()
            })
            .catch(api.err)
        })
      },
    })
  }
  // 删除确认
  showDeleteConfirm = (record) => {
    const { id } = record
    const { pid, onChangePid } = this.props
    confirm({
      title: '确认删除该分类?',
      content: '请谨慎删除该分类!',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        api
          .put("/module/classification/delete", { id })
          .then((data) => {
            if (data) {
              message.success("删除成功", 1, () => {
                onChangePid(pid)
              })
            }
          })
          .catch(api.err)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  render() {
    const { data, type } = this.props
    const columns = [{
      title: <span>分类名称(<span style={{ color: "red", fontWeight: "bold"}}>{` ${type === "a" ? '一级' : type === "b" ? '二级' : type === "c" ? '三级' : ''} `}</span>)目录</span>,
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => this.onFindNext(record)}>{text}</a>
      ),
    }, {
      title: '排序等级',
      dataIndex: 'sort',
      key: 'sort',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          {
            type === "c" ?
            "" :
            <Button onClick={() => this.onFindNext(record)} style={{ marginRight: 12 }}>查看下一级</Button>
          }
          {
            type === "c" ?
            "" :
            <Button onClick={() => this.onAddNext(record)} style={{ marginRight: 12 }}>添加下一级</Button>
          }
          <Button style={{ marginRight: 12 }} onClick={() => this.handleUpdate(record)}>编辑</Button>
          <Button type="danger" onClick={() => this.showDeleteConfirm(record)}>删除</Button>
        </span>
      ),
    }]
    return (
      <div>
        <Table columns={columns} dataSource={data} rowKey={record => record.id} />
      </div>
    )
  }
}
