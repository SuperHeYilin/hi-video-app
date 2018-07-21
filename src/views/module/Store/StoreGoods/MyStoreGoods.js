import React, { Component } from 'react'
import { Icon, Button, message, Tag } from 'antd'
import UpdateForm from './UpdateForm'
import { Table, Layer } from '../../../../components/Ui'
import styles from '../../Goods/index.less'
import GoodsImage from '../../Goods/Info'
import { api, err as apierr } from '../../../../utils'
import { api as a } from '../../../../constants'
import { isatty } from 'tty';

const ButtonGroup = Button.Group

class MyStoreGoodsList extends Component {
  constructor(props) {
    super(props)

    this.state = {

    }
  }
  // 更新商品
  handleUpdateStoreGoods = (v) => {
    const { storeId, onFilter, isAdmin } = this.props
    let refForm;
    Layer.open({
      title: `${isAdmin ? "编辑商品" : "查看商品"}`,
      width: 500,
      content: <UpdateForm item={v} ref={(form) => {refForm = form}} isAdmin={isAdmin} />,
      onOk: (e) => {
        // 如果为管理员 可以更新
        if (isAdmin) {
          refForm.validateFields((error, values) => {
            if (error) {
              return;
            }
            api
              .put("/module/store/goods", { id: storeId, storeGoods: values })
              .then((result) => {
                if (result) {
                  message.success("更新成功!")
                  onFilter({ data: {time: new Date()} })
                }
                Layer.close()
              })
              .catch(apierr)
          })
        }
        Layer.close()
      },
    })
  }

  handleSwitchChange = (v, value) => {
    const { onFilter } = this.props;
    const { id } = v
    // 上架商品
    if (value) {
      api
        .put("/pt/goods/putaway", { id })
        .then((data) => {
          if (data) {
            message.success("上架成功!")
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
            // onFilter({ data: {time: new Date()} })// 传入一个刷新标记刷新tablek
          }
        })
        .catch(apierr)
    }
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
        url: '/module/store/goods/my',
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
          },
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
          title: '价格/货号',
          render: (v, n) => {
            return (
              <div style={{ fontSize: 14 }}>
                <p style={{ display: `${isAdmin ? "block" : "none"}`}}>成本价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#f50" }}>{v.costPrice} ￥</span></p>
                <p>市场价：<span style={{ fontSize: 16, fontWeight: "bold" }}>{v.RefPrice} ￥</span></p>
                <p>活动价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#2db7f5" }}>{v.sActivityPrice} ￥</span></p>
                <p>销售价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#87d068" }}>{v.sPromPrice} ￥</span></p>
                <p>会员价：<span style={{ fontSize: 16, fontWeight: "bold", color: "#108ee9" }}>{v.sVipPrice} ￥</span></p>
              </div>
            )
          },
        },
        {
          title: '数量',
          render: (v, n) => {
            return (
              <div>
                <div>
                  <p>数量：{v.count}</p>
                  <p>单位：{v.sUnitName}</p>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div style={{ marginTop: 12 }}>
                    {v.status === "1" ? <Tag color="#87d068">上架中</Tag> :
                    <Tag color="#f50">已下架</Tag>
                    }
                  </div>
                </div>
              </div>
            )
          }
        },
        {
          title: '操作',
          width: 120,
          dataIndex: 'cz',
          render: (v, n) => {
            return (<div>
                      {
                        isAdmin ?
                        <div style={{ display: `${n.status === "1" ? 'block' : 'none'}`}}>
                          <Button size="small" style={{ marginTop: 12 }} type="primary" onClick={() => this.handleUpdateStoreGoods(n)}>
                            <Icon type="plus" /> 编辑
                          </Button>
                        </div> :
                        <div style={{ marginTop: 12 }}>
                        <Button size="small" onClick={() => this.handleUpdateStoreGoods(n)}>
                          <Icon type="eye" /> 查看
                        </Button>
                        </div>
                      }
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

MyStoreGoodsList.defaultProps = {
  data: {}
}

export default MyStoreGoodsList