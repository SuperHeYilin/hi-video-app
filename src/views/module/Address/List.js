import React, { Component } from 'react'
import { Table } from '../../../components/Ui'

class AddressList extends Component {
  render() {
    const { data, onSelected } = this.props
    const fetchProps = {
      fetch: {
        url: '/module/client/users/address',
        data,
      },
      selection: {
        isOpen: true,
        onSelected,
      },
      columns: [
        { title: '用户名', dataIndex: 'realname'},
        { title: '收货人姓名', dataIndex: 'consignee_name'},
        { title: '手机', dataIndex: 'consignee_mobile'},
        { title: '座机', dataIndex: 'consignee_phone'},
        { title: '邮箱', dataIndex: 'name'},
        { title: '省份', dataIndex: 'province' },
        { title: '城市', dataIndex: 'city' },
        { title: '区/县', dataIndex: 'area' },
        { title: '详细地址', dataIndex: 'address' },
        { title: '创建方式',
          dataIndex: 'create_type',
          render: (type) => {
            return ["用户自建", "系统生成"][type * 1]
          },
        },
        { title: '创建时间', dataIndex: 'create_time', sorter: true },
        { title: '已否绑定',
          dataIndex: 'nickname',
          render: (type, row) => {
            return ["已绑定用户", "未绑定"][row.user ? 0 : 1]
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

AddressList.defaultProps = {
  data: {},
}

export default AddressList