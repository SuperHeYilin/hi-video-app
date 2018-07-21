import React, { Component } from 'react'
import { Icon, Button, message, Switch, Tooltip } from 'antd'
import { Table, Layer } from '../../../components/Ui'
import styles from './index.less'
import GoodsImage from './Info'
import { api, err as apierr } from '../../../utils'
import { api as a } from '../../../constants'
import GoodsBarcode from './GoodsBarcode'

const ButtonGroup = Button.Group

class GoodsList extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }
  handleSwitchChange = (v, value) => {
    const { onFilter } = this.props;
    const { id } = v
    console.log(v)
    // 上架商品
    // if (value) {
    //   api
    //     .put("/pt/goods/putaway", { id })
    //     .then((data) => {
    //       if (data) {
    //         message.success("上架成功!")
    //         // onFilter({ data: {time: new Date()} })//传入一个刷新标记刷新tablek
    //       }
    //     })
    //     .catch(apierr)
    // } else {
    //   // 下架商品
    //   api
    //     .put("/pt/goods/soldout", { id })
    //     .then((data) => {
    //       if (data) {
    //         message.success("下架成功!")
    //         // onFilter({ data: {time: new Date()} })// 传入一个刷新标记刷新tablek
    //       }
    //     })
    //     .catch(apierr)
    // }
  }
  // 移除到回收站
  handleRecycle = (v) => {
    const { onFilter } = this.props;
    const { id } = v
    api
      .put("/pt/goods/recycled", { id })
      .then((data) => {
        if (data) {
          message.success("移除到回收站!")
          onFilter({time: new Date()}) // 传入一个刷新标记刷新tablek
        }
      })
      .catch(apierr)
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
  // 编辑图片
  handleEdit = (n) => {
    console.log(n)
    let { onFilter } = this.props;
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
    let barcodeSVG = this.barcodeSVG
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
                <p>编码: <span style={{ fontSize: 14, fontWeight: "bold" }}>{v.GoodsID}</span></p>
                {/* <Tooltip title={<GoodsBarcode barcode={v.BarcodeID} overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }} />}>
                  <p>主条码: <span style={{ fontSize: 18, fontWeight: "bold" }}>{v.BarcodeID}</span></p>
                </Tooltip> */}
                <p>SKU: <span style={{ fontSize: 14, fontWeight: "bold" }}>{v.SKU}</span></p>
                <GoodsBarcode barcode={v.BarcodeID} />
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
          },
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
          title: '上下架',
          width: 80,
          render: (v, n) => {
            return (
              <div>
                <SelfSwitch v={v} />
              </div>
            )
          }
        },
        {
          title: '操作',
          width: 110,
          dataIndex: 'cz',
          render: (v, n) => {
            return (
              <div>
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
                  <Button size="small" style={{ marginLeft: 12 }} type="danger" onClick={() => this.handleRecycle(n)}>
                    <Icon type="delete" /> 删除
                  </Button>
                </div>
              </div>
            )
          },
        },
      ],
    }
    return (
      <Table
        {...fetchProps}
      />
    )
  }
}

GoodsList.defaultProps = {
  data: {},
}

class SelfSwitch extends Component {
  state = {}

  handleSwitchChange = (v, value) => {
    const { id } = v
    // 上架商品
    if (!v.SKU && value) {
      Layer.confirm({
        title: '商品未填写SKU，是否确认上架?',
        onOk: () => {
          this.fetchPutaway(value, id)
        },
      })
    } else {
      this.fetchPutaway(value, id)
    }
  }

  fetchPutaway = (value, id) => {
    if (value) {
      api
      .put("/pt/goods/putaway", { id })
      .then((data) => {
        if (data) {
          message.success("上架成功!")
          this.setState({
            status: '1',
          })
          // onFilter({ data: {time: new Date()} })//传入一个刷新标记刷新tablek
        }
      })
      .catch(apierr)
    } else {
      // 下架商品
      api
      .put("/pt/goods/soldout", { id })
      .then((data) => {
        if (data) {
          message.success("下架成功!")
          this.setState({
            status: '0',
          })
          // onFilter({ data: {time: new Date()} })// 传入一个刷新标记刷新tablek
        }
      })
      .catch(apierr)
    }
  }

  render() {
    const { v } = this.props
    const { status = v.status } = this.state

    return <Switch checkedChildren="上架" unCheckedChildren="下架" checked={status === "1"} onChange={(value) => this.handleSwitchChange(v, value)} />
  }
}

export default GoodsList