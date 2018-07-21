import React, { Component } from 'react'
import { Tabs } from 'antd'
import { Ibox } from '../../../components/Ui'
import Password from './UserPwd'
import UserInfo from './UserInfo'
import UserDetailInfo from './UserDetailInfo'
import { imgURL } from '../../../constants'
import { api, err } from '../../../utils'

const TabPane = Tabs.TabPane

const defaultAvatar = require('../../../public/imgs/defaultAvatar.jpg')

class UserCenter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imgAvatar: defaultAvatar,
      userData: {
        roles: {},
        person: {},
      },
    }
  }

  componentDidMount() {
    this.fetch()
  }
  // 获取列表选中项
  // onSelected = (keys, rows) => {
  //   this.setState({keys, rows})
  // }

  // 图片无法显示时 调用默认
  onImgErr = () => {
    this.setState({
      imgAvatar: defaultAvatar,
    })
  }

  // onFilter = (filterData) => {
  //   this.setState({data: filterData})
  // }

  handleUpdate = () => {
    this.fetch()
  }
  // tab事件
  handleTabChange = (key) => {
    const { history } = this.props
    history.push("/platform/usercenter/" + key)
  }

  fetch = () => {
    api.get("/pt/users/info")
    .then((data) => {
      const avatar = data.avatar_url ? `${imgURL}${data.avatar_url}` : defaultAvatar
      this.setState({
        imgAvatar: avatar,
        userData: data,
        // personData: data.person,
      })
    })
    .catch(err)
  }

  render() {
    const { match } = this.props
    const tabValue = match.params.tab || '1'
    const { userData, imgAvatar } = this.state

    return (
      <Ibox>
        <Ibox.IboxTitle>
          <Tabs activeKey={tabValue} onChange={this.handleTabChange} >
            <TabPane tab="基本信息" key="1">
              <Ibox.IboxContent>
                <UserInfo userData={userData} handleChangeTab={this.handleTabChange} avatar={imgAvatar} onImgErr={this.onImgErr} />
              </Ibox.IboxContent>
            </TabPane>
            <TabPane tab="详细信息" key="2">
              <UserDetailInfo userData={userData} history={this.props.history} handleUpdate={this.handleUpdate} avatar={imgAvatar} onImgErr={this.onImgErr} />
            </TabPane>
            <TabPane tab="修改密码" key="3">
              <Password history={this.props.history} />
            </TabPane>
          </Tabs>
        </Ibox.IboxTitle>
      </Ibox>
    )
  }
}

export default UserCenter

