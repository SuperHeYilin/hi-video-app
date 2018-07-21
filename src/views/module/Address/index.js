import React, { Component } from 'react'
import { Ibox } from '../../../components/Ui'
import UserFilter from './Filter'
import UserList from './List'

class Address extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  onFilter = (filterData) => {
    this.setState({data: filterData})
  }

  // 获取列表选中项
  onSelected = (keys, rows) => {
    this.setState({keys, rows})
  }

  render() {
    const { data, keys, rows} = this.state

    return (
      <Ibox>
        <Ibox.IboxTitle>
          <UserFilter onFilter={this.onFilter} selected={{keys, rows}} />
        </Ibox.IboxTitle>
        <Ibox.IboxContent>
          <UserList data={data} onSelected={this.onSelected} />
        </Ibox.IboxContent>
      </Ibox>
    )
  }
}

export default Address