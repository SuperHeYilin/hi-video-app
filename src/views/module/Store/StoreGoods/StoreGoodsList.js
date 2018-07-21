import React, { Component } from 'react'
import { Icon, Button, message, Tag } from 'antd'
import AddInfoForm from './AddInfoForm'
import { Table, Layer } from '../../../../components/Ui'
import styles from '../../Goods/index.less'
import GoodsImage from '../../Goods/Info'
import { api, err as apierr } from '../../../../utils'
import { api as a } from '../../../../constants'

const ButtonGroup = Button.Group

class StoreGoodsList extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }
  // 添加商品
  handleAddStoreGoods = (v) => {
    const { storeId, onFilter } = this.props
    let refForm;
    Layer.open({
      title: "添加商品",
      width: 500,
      content: <AddInfoForm item={v} ref={(form) => {refForm = form}} />,
      onOk: (e) => {
        refForm.validateFields((error, values) => {
          if (error) {
            return;
          }
          api
            .post("/module/store/goods", { id: storeId, storeGoods: {...values, store_id: storeId} })
            .then((result) => {
              if (result) {
                message.success("添加成功!")
                onFilter({ data: {time: new Date()} })
              }
              Layer.close()
            })
            .catch(apierr)
        })
      },
    })
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
    const { data, onSelected, isAdmin } = this.props;
    const fetchProps = {
      fetch: {
        url: '/module/store/goods/all',
        data,
      },
      selection: {
        isOpen: false,
        onSelected,
      },
      columns: [
        { title: '识别码',
        render: (v, n) => {
          return (
            <div>
              <p>编码: <span style={{ fontSize: 18, fontWeight: "bold" }}>{v.GoodsID}</span></p>
              <p>主条码: <span style={{ fontSize: 18, fontWeight: "bold" }}>{v.BarcodeID}</span></p>
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
            return <a href={`${a.goodsViewURL + v.id}`} target="_blank" >{v.Name}</a>
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
                <p style={{ display: `${isAdmin ? "block" : "none"}`}}>成本价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#f50" }}>{v.costPrice} ￥</span></p>
                <p>市场价：<span style={{ fontSize: 16, fontWeight: "bold" }}>{v.RefPrice} ￥</span></p>
                <p>活动价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#2db7f5" }}>{v.activity_price} ￥</span></p>
                <p>销售价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#87d068" }}>{v.promPrice} ￥</span></p>
                <p>会员价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#108ee9" }}>{v.vip_price} ￥</span></p>
              </div>
            )
          }
        },
        {
          title: '状态',
          width: 80,
          render: (v, n) => {
            return (
              <div>
                <div>
                {v.sid ? <Tag color="#87d068">已添加</Tag> : <Tag color="#2db7f5">未添加</Tag>}
                </div>
                {/* <div style={{ marginTop: 12 }}>
                  {v.status === "1" ? <Tag color="#87d068">上架中</Tag> :
                   <Tag color="#f50">已下架</Tag>
                  }
                </div> */}
              </div>
            )
          },
        },
        {
          title: '操作',
          width: 120,
          render: (v, n) => {
            return (<div>
              {/* <div style={{ marginBottom: `${v.sid ? '0px' : '12px'}` }}>
                <Button size="small" onClick={() => this.handleEdit(n)}>
                  <Icon type="eye" /> 查看
                </Button>
              </div> */}
              <div style={{ display: `${v.sid ? 'none' : 'block'}`}}>
                <Button size="small" type="primary" onClick={() => this.handleAddStoreGoods(n)}>
                  <Icon type="plus" /> 添加
                </Button>
              </div>
            </div>);
          }
        },
      ]
    }
    return (
      <Table
        {...fetchProps}
      />
    )
  }
}

StoreGoodsList.defaultProps = {
  data: {}
}

export default StoreGoodsList