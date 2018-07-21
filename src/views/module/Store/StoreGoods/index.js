import React, { Component } from 'react'
import { Tabs, Card, Input, message, Button } from 'antd'
import { Ibox, Layer } from '../../../../components/Ui'
import StoreGoodsList from './StoreGoodsList'
import MyStoreGoods from './MyStoreGoods'
import { api, err as apierr } from '../../../../utils'

const TabPane = Tabs.TabPane
const Search = Input.Search

class StoreGoods extends Component {
  constructor(props) {
    super(props)
    this.state = {
      storeId: 0, // 店铺id
      storeDate: {}, // 店铺信息
      data: { id: 0 },
      isAdmin: false, // 是否为管理员
    }
  }
  componentDidMount = () => {
    const { match, history } = this.props
    // 路由参数 门店id
    const { id = 0 } = match.params
    // 如果为0 表示主菜单直接跳转 后台判断当前登录用户 分配店铺
    if (id === 0) {
      api
      .get("/module/store/goods/current")
      .then((result) => {
        if (result === 0) {
          // 如果为0 表示为系统用户 调到店铺列表
            message.error("当前为系统管理员，请先选择店铺!", 1, () => {
            history.push("/module/store")
          })
        } else if (result === -1) {
          message.error("门店尚未绑定或者没有权限", 1, () => {
            history.push("/module/analyze")
          })
        } else {
          // 普通用户 返回店铺id
          this.fetch(result)
          this.setState({ storeId: result })
        }
      })
      .catch(apierr)
    } else {
      api
      .get("/module/store/goods/current")
      .then((result) => {
        if (result === 0) {
          // 如果为0 表示为系统用户 改变权限状态
           this.setState({ isAdmin: true })
        } else if (result === -1) {
          message.error("门店尚未绑定或者没有权限", 1, () => {
            history.push("/module/analyze")
          })
        } else {
          // 普通用户 权限为false
          this.setState({ isAdmin: false })
        }
      })
      this.fetch(id)
    }
  }

  onFilter = (filterData) => {
    this.setState({ data: { ...this.state.data, ...filterData } })
  }

  // 获取列表选中项
  onSelected = (keys, rows) => {
    this.setState({ keys, rows })
  }

  // 搜索
  onSearch = (value) => {
    // this.onFilter({ name: encodeURI(value) });
    this.onFilter({ name: value });
  }

  handleImportWarehouse = () => {
    const { match } = this.props
    // 路由参数 门店id
    const { id = 0 } = match.params
    Layer.confirm({
      title: '确定导入全部吗?',
      content: "这将导入所有本店未同步仓库的上架商品",
      onOk: () => {
        api
        .post("/module/store/goods/sync", {storeId: id})
        .then((result) => {
          message.success(`已成功导入${result}条`)
          this.onFilter({time: new Date()})
        })
        .catch(apierr)
      },
    })
  }

  fetch = (id) => {
    api
    .get("/pt/store/id", {id})
    .then((result) => {
      this.setState({ storeDate: result, storeId: id, data: { id } })
    })
    .catch(apierr)
  }
  handleTabChange = (key) => {
    this.setState({ data: { ...this.state.data, status: key } })
  }
  render() {
    const { data, keys, rows, storeId, storeDate, isAdmin } = this.state;
    return (
      <Ibox>
        <Ibox.IboxTitle>
          {/* <GoodsFilter onFilter={this.onFilter} selected={{ keys, rows }} history={this.props.history} /> */}
          <Card
            title={<span>{storeDate.name}</span>}
            extra={<Button size="small" onClick={this.handleImportWarehouse}>快速导入</Button>}
          >
            <div>
              <p ><span style={{ fontSize: 16, fontWeight: "bold" }}>{storeDate.text}</span></p>
              <p>
                地址：<span style={{ fontSize: 16, fontWeight: "bold", marginRight: 24 }}>{storeDate.address}</span>
                电话：<span style={{ fontSize: 16, fontWeight: "bold" }}>{storeDate.phone}</span>
              </p>
            </div>
          </Card>
        </Ibox.IboxTitle>
        <Ibox.IboxContent>
          <Tabs
            tabBarExtraContent={
              <Search
                placeholder="商品编号/名称/条码"
                style={{ width: 200 }}
                onSearch={this.onSearch}
              />
            }
            onChange={this.handleTabChange}
            type="card"
          >
            <TabPane tab={<span>本店已添加商品</span>} key="my">
              <MyStoreGoods data={data} storeId={storeId} onFilter={this.onFilter} onSelected={this.onSelected} history={this.props.history} isAdmin={isAdmin} />
            </TabPane>
            <TabPane tab={<span>仓库中上架商品</span>} key="all">
              <StoreGoodsList data={data} storeId={storeId} onFilter={this.onFilter} onSelected={this.onSelected} history={this.props.history} isAdmin={isAdmin} />
            </TabPane>
          </Tabs>
        </Ibox.IboxContent>
      </Ibox>
    )
  }
}

export default StoreGoods