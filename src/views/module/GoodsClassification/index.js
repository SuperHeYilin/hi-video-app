import React, { Component } from 'react'
import { Card, Button, message } from 'antd'
import { Layer } from '../../../components/Ui'
import ClassificationForm from './ClassificationForm'
import ClassList from './List'
import { api } from '../../../utils'


/**
 * 商品分类
 */
export default class GoodsClassification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pid: 0, // 0代表没有父级id 则为父级
      type: "", // 当前层数 abc三层
    }
  }
  componentDidMount = () => {
    const { pid } = this.state
    this.fetch(pid)
  }
  handleChagnePid = (pid) => {
    this.fetch(pid)
  }
  // 返回上一级
  handleBack = () => {
    const { pid } = this.state
    if (pid === 0) {
      // message.info("该层为顶层!")
      return
    }
    this.fetchParent(pid)
  }
  // 模态框
  showModal = (pid) => {
    let refForm
    Layer.open({
      title: "新增分类",
      width: '500px',
      height: '400px',
      content: <ClassificationForm pid={pid} ref={(form) => {refForm = form}} />,
      onOk: (e) => {
        refForm.validateFields((error, values) => {
          if (error) {
            return;
          }
          api
            .post("/module/classification", { goodsClassification: values })
            .then((data) => {
              if (data) {
                message.success("新增成功", 1, () => {
                  this.fetch(pid)
                })
              }
              Layer.close()
            })
            .catch(api.err)
        })
      },
    })
  }
  fetch = (pid) => {
    api
      .get("/module/classification", { pid })
      .then((result) => {
        if (result.length === 0) {
          message.warn("子分类为空!")
          this.handleBack()
          return
        }
        const { pid = 0, type = "" } = result[0]
        this.setState({
          data: result,
          type,
          pid,
        })
      })
      .catch(api.err)
  }
  // 返回上一级数据
  fetchParent = (id) => {
    api
      .get("/module/classification/parent", { id })
      .then((result) => {
        // if (result.length === 0) {
        //   message.warn("子分类为空!")
        //   return
        // }
        const { pid = 0, type = "" } = result[0]
        this.setState({
          data: result,
          type,
          pid,
        })
      })
      .catch(api.err)
  }
  render() {
    const { pid, data, type } = this.state
    return (
      <div>
        <Card title="商品分类">
          <Button type="primary" icon="plus" onClick={() => this.showModal(pid)}>为该层添加分类</Button>
          {
            pid === 0 ?
            ""
            : <Button type="primary" icon="rollback" onClick={this.handleBack} style={{ marginLeft: 12 }} >返回上一级</Button>
          }
          <ClassList pid={pid} data={data} type={type} onChangePid={this.handleChagnePid} />
        </Card>
      </div>
    )
  }
}
