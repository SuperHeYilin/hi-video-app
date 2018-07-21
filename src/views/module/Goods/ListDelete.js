import React, { Component } from 'react'
import { Icon, Button, message, Modal } from 'antd'
import { Table, Layer } from '../../../components/Ui'
import styles from './index.less'
import GoodsImage from './Info'
import { api, err as apierr } from '../../../utils'
import { api as a } from '../../../constants'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

class GoodsListDelete extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }
  handleStop = (e) => {
    e.preventDefault()
  }

  handleViewImg = img => {
    Layer.open({
      title: "查看图片",
      width: 600,
      content: <div style={{ width: "100%", textAlign: "center" }}><img style={{ width: "400px" }} src={img} alt="图片查看" /></div>,
      footer: null,
    })
  }
  // 撤销到仓库
  handleShowConfim = (v) => {
    const { onFilter } = this.props;
    const { id } = v
    confirm({
      title: '确定撤销此商品?',
      content: '撤销的商品将回到仓库中！',
      onOk() {
        api
          .put("/pt/goods/back", { id })
          .then((data) => {
            if (data) {
              message.success("撤销成功!")
              onFilter({ data: { time: new Date() } }) // 传入一个刷新标记刷新tablek
            }
          })
          .catch(apierr)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  // 标记删除商品
  handleDelete = (v) => {
    const { onFilter } = this.props;
    const { id } = v
    api
      .put("/pt/goods/del", { id })
      .then((data) => {
        if (data) {
          message.success("删除成功!")
          onFilter({  time: new Date()  })// 传入一个刷新标记刷新tablek
        }
      })
      .catch(apierr)
  }
  // 标记删除
  handleShowDelConfim = (n) => {
    const handleDelete = this.handleDelete
    confirm({
      title: '确认删除此商品?',
      content: '请谨慎操作！',
      onOk() {
        handleDelete(n)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  handleEdit = (n) => {
    const { onFilter } = this.props;
    let refForm;
    Layer.open({
      title: "编辑图片",
      content: <GoodsImage item={n} ref={(form) => { refForm = form }} />,
      onOk: (e) => {
        refForm.validateFields((error, values) => {
          if (error) {
            return;
          }
          api
            .post("/pt/goods", { ...values })
            .then((data) => {
              message.success("更新成功!")
              onFilter({ refresh: new Date() })//传入一个刷新标记刷新tablek
              Layer.close()
            })
            .catch(apierr)
        })
      },
    })
  }
  // 编辑商品 跳转页面
  handleEditGoods = (v) => {
    const { history } = this.props
    const { id = 0 } = v
    history.push(`/module/goods/add/${id}`)
  }
  render() {
    const { data, onSelected } = this.props;
    const fetchProps = {
      fetch: {
        url: '/pt/goods',
        data,
      },
      selection: {
        isOpen: false,
        onSelected,
      },
      columns: [
        {
          title: '识别码',
          render: (v, n) => {
            return (
              <div>
                <p>编码: <span style={{ fontSize: 18, fontWeight: "bold" }}>{v.GoodsID}</span></p>
                <p>主条码: <span style={{ fontSize: 18, fontWeight: "bold" }}>{v.BarcodeID}</span></p>
                <p>SKU: <span style={{ fontSize: 18, fontWeight: "bold" }}>{v.SKU}</span></p>
              </div>
            )
          },
        },
        {
          title: '封面图片',
          dataIndex: 'src',
          className: styles['td-center'],
          render: (v, n) => {
            if (v) {
              v = api.getImageUrl() + v
              return <img style={{ width: 60, height: 50 }} src={v} alt="封面图片" onClick={this.handleViewImg.bind(this, v)} />
            }
            return null
          }
        },
        {
          title: '商品名称',
          render: (v, n) => {
            return <a href={`${a.goodsViewURL + v.id}`} target="_blank" rel="noopener noreferrer" >{v.Name}</a>
          },
        },
        // { title: '中文缩写', dataIndex: 'ShortName' },
        // { title: '英文名', dataIndex: 'EName' },
        // { title: '英文缩写', dataIndex: 'EShortName' },
        // { title: '主条码', dataIndex: 'BarcodeID' },
        {
          title: '价格',
          render: (v, n) => {
            return (
              <div style={{ fontSize: 14 }}>
                <p>成本价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#f50" }}>{v.costPrice} ￥</span></p>
                <p>市场价：<span style={{ fontSize: 16, fontWeight: "bold" }}>{v.RefPrice} ￥</span></p>
                <p>活动价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#2db7f5" }}>{v.activity_price} ￥</span></p>
                <p>销售价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#87d068" }}>{v.promPrice} ￥</span></p>
                <p>会员价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#108ee9" }}>{v.vip_price} ￥</span></p>
              </div>
            )
          },
        },
        {
          title: '撤销',
          width: 80,
          render: (v, n) => {
            return (
              <div>
                {/* <Switch checkedChildren="上架" unCheckedChildren="下架" defaultChecked onChange={this.handleSwitchChange} /> */}
                <Button type="primary" onClick={() => this.handleShowConfim(n)} >撤销回仓库</Button>
              </div>
            )
          }
        },
        {
          title: '操作',
          width: 110,
          dataIndex: 'cz',
          render: (v, n) => {
            return (<div>
                      <div>
                        <Button size="small" onClick={() => this.handleEdit(n)} style={{ marginLeft: 12 }}>
                          <Icon type="edit" /> 图片
                        </Button>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <Button size="small" style={{ marginLeft: 12 }} onClick={() => this.handleEditGoods(n)}>
                          <Icon type="edit" /> 商品
                        </Button>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <Button size="small" style={{ marginLeft: 12 }} type="danger" onClick={() => this.handleShowDelConfim(n)}>
                          <Icon type="delete" /> 删除
                        </Button>
                      </div>
                    </div>);
          },
        },
      ],
    }
    return (
      <Table
        {...fetchProps}
        rowKey={record => record.id}
      />
    )
  }
}

GoodsListDelete.defaultProps = {
  data: {}
}

export default GoodsListDelete