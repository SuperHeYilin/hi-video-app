import React, { Component } from 'react'
import { Table } from '../../../components/Ui'

class OrderTable extends Component {
  render() {
    const { data, onSelected, history, TabKey, handleDetail } = this.props
    // console.info(data)
    const fetchProps = {
      fetch: {
        url: '/module/order',
        data: Object.assign({orderColunm: 'create_time', orderMode: 'desc'}, data),
      },
      selection: {
        isOpen: true,
        onSelected, // 获取选中某一行
      },
      columns: [
        // { title: '用户id', width: 80, dataIndex: 'user', key: 'user'},
        { title: '门店', dataIndex: 'name', key: 'name'},
        { title: '订单号', dataIndex: 'no', key: 'no', sorter: true},
        { title: '手机号', dataIndex: 'phonenum', key: 'phonenum' },
        { title: '总数量', dataIndex: 'goods_num', key: 'goods_num' },
        { title: '订单金额', dataIndex: 'order_amount', key: 'order_amount'},
        { title: '实付金额', dataIndex: 'pay_amount', key: 'pay_amount' },
        { title: '退款金额', dataIndex: 'refund_money', key: 'refund_money' },
        {
          title: '付款方式',
          dataIndex: 'pay_type',
          key: 'pay_type',
          render: (state) => {
            // 0:微信支付 1:余额支付 2:提货卡支付
            return ['微信支付', '余额支付', '提货卡支付'][state]
          },
        },
        {
          title: '订单状态',
          dataIndex: 'state',
          key: 'state',
          render: (state) => {
            // 0:待支付 1:已支付 2:已核验 3:已取消 4:退款申请 5:已退款 6:核验失败
            return ['待支付', '已支付', '已核验', '已取消', '退款申请', '已退款', '核验失败'][state]
          },
        },
        {
          title: '发送到ERP',
          dataIndex: 'is_send',
          key: 'is_send',
          render: (isSend) => {
            return ['未发送', '已发送', '发送失败'][isSend || 0]
          },
        },
        { title: '创建时间', dataIndex: 'create_time', key: 'create_time', sorter: true },
        { title: '支付时间', dataIndex: 'pay_time', key: 'pay_time', sorter: true },
        {
          title: '操作',
          dataIndex: "cz",
          render: (n, row) => {
            return (
              <div>
                {/* <a onClick={() => {history.push("/module/orderdetails/" + row.id + "/" + TabKey)}}>详情</a> */}
                <a onClick={() => handleDetail(row.id)}>详情</a>
              </div>
            )
          },
        },
      ],
    }
    return (
      <Table {...fetchProps} />
    )
  } 
}

OrderTable.defaultProps = {
  data: {},
}

export default OrderTable