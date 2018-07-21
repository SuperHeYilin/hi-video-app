import React, { Component } from 'react'
import lodash from 'lodash'
import { Checkbox, Menu, Icon, message } from 'antd'
import { Table } from '../../../components/Ui'
import { api } from '../../../utils'

class RoleUsers extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleSelect = ({ key }) => {
    this.setState({state: key})
  }

  render() {
    let { roleItem } = this.props
    let { state = '0' , roleId = roleItem.id} = this.state

    const menu = (
    <Menu onClick={this.handleSelect}>
        <Menu.Item key="0">全部</Menu.Item>
        <Menu.Item key="1">未选择</Menu.Item>
        <Menu.Item key="2">已选择</Menu.Item>
    </Menu>
    );

    const fetchProps = {
      fetch: {
        url: '/pt/users/roles',
        data: {
          roleId,
          state,
        },
      },
      showLoading: false,
      selection: {
        isOpen: false,
      },
      scroll: {x: false},
      columns: [
        {
          title: ['全部','未选','已选'][state],
          dataIndex: 'state',
          className: 'ant-table-selection-column ant-table-selection-column-custom', 
          render: (text, record) => {
            return <UserCheckbox roleId={roleId} record={record} />
          },
          filterIcon: <Icon type="filter" style={{color: state !== '0' ? 'blue' : 'black'}} />,
          filterDropdown: menu,
          width: 80,
        },
        { title: '用户名', dataIndex: 'username'},
        { title: '邮箱', dataIndex: 'email' },
        { title: '手机号', dataIndex: 'mobile', sorter: true},
        { title: '姓名', dataIndex: 'full_name' },
        // { title: '年龄', dataIndex: 'age', sorter : true },
        // { title: '性别', dataIndex: 'sex' },
        { title: '创建时间', dataIndex: 'create_time' },
      ],
    }
    return (
      <Table
          {...fetchProps}
      />
    )
  }
}

class UserCheckbox extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    const staticNextProps = lodash.cloneDeep(nextProps)

    if (!lodash.isEqual(staticNextProps, this.props)) {
      this.setState({
        checked: undefined,
        userRoleId: undefined,
      })
    }

    return true
  }

  handleCheckChange = (e) => {
    const { roleId, record } = this.props
    const { checked = !!record.pur_id, userRoleId } = this.state

    if (!checked) {
      api
      .post("/pt/users/roles", {roleId, userId: record.id})
      .then((data) => {
          message.success("绑定成功")
          this.setState({ checked: !checked, userRoleId: data.id})
      })
      .catch(api.err)
    } else {
      api
      .delete("/pt/users/roles/" + (userRoleId ? userRoleId : record.pur_id))
      .then((data)=>{
          message.success("解绑成功")
          this.setState({ checked: !checked })
      })
      .catch(api.err)
    }
  }

  render() {
    const {roleId, record } = this.props
    const {checked = !!record.pur_id } = this.state

    return (
      <Checkbox onChange={this.handleCheckChange} checked={checked} />
    )
  }
}

RoleUsers.defaultProps = {
  data: {},
}

export default RoleUsers