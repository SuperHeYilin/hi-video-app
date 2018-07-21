import React, { Component } from 'react'
import { Button, Tag, Icon } from 'antd'
// import CountUp from 'react-countup'
import styles from './UserInfo.less'

// const defaultAvatar = require('../../../public/imgs/defaultAvatar.jpg')

// const countUpProps = {
//   start: 0,
//   duration: 2.75,
//   useEasing: true,
//   useGrouping: true,
//   separator: ',',
// }
const color = {
  green: '#64ea91',
  blue: '#8fc9fb',
  purple: '#d897eb',
  red: '#f69899',
  yellow: '#f8c82e',
  peach: '#f797d6',
  borderBase: '#e5e5e5',
  borderSplit: '#f4f4f4',
  grass: '#d6fbb5',
  sky: '#c1e0fc',
}

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // userData: {
      //   roles:{}
      // },
      // personData: {},
    }
  }
  render() {
    const { userData, avatar, onImgErr } = this.props
    // console.log("测试："+JSON.stringify(userData))
    return (
    <div className={styles.user}>
      <div className={styles.header}>
        <div className={styles.headerinner}>
          {/* <div className={styles.avatar} style={{ backgroundImage: `url(${avatar})` }} /> */}
          <div style={{ display: "none" }} >
          <img alt="背景图片" src={avatar} title="avatar" onError={onImgErr} />
          </div>
          <div className={styles.avatar} style={{ backgroundImage: `url(${avatar})` }} />
          <h4 className={styles.name}>{`${userData.realname || ''} ` }<Tag color="#87d068" style={{ marginLeft: 8 }}>{userData.roles.intro}</Tag></h4>
          <p>{userData.username}</p>
          <p>{userData.age}</p>
        </div>
      </div>
      <div className={styles.number}>
        <div className={styles.item}>
          <p>电话</p>
          <div style={{ color: color.green }}>
          <Icon type="tablet" />
          <span style={{ marginLeft: 8 }} >
            {userData.mobile}
          </span>
          {/* <CountUp
            end={3241}
            prefix="电话"
            {...countUpProps}
          /> */}
          </div>
        </div>
        <div className={styles.item}>
          <p>邮箱</p>
          <div style={{ color: color.blue }}>
          <Icon type="mail" />
          <span style={{ marginLeft: 8 }} >
            {userData.email}
          </span>
          {/* <CountUp
            end={sold}
            {...countUpProps}
          /> */}
          </div>
        </div>
        <div className={styles.item}>
          <p>最后登录</p>
          <div style={{ color: color.blue }}>
          <Icon type="clock-circle-o" />
          <span style={{ marginLeft: 8 }} >
            {userData.last_time}
          </span>
          {/* <CountUp
            end={sold}
            {...countUpProps}
          /> */}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <Button type="ghost" size="large" onClick={() => this.props.handleChangeTab("2")}>更多信息</Button>
      </div>
    </div>
    )
  }
}

// UserInfo.propTypes = {
//   avatar: PropTypes.string,
//   name: PropTypes.string,
//   email: PropTypes.string,
//   sales: PropTypes.number,
//   sold: PropTypes.number,
// }

export default UserInfo
