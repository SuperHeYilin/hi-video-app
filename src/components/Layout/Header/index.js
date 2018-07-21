import React, { Component } from 'react'
import screenfull from 'screenfull'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Layout, Menu, Icon, Popover, Modal, Badge, Tooltip } from 'antd'
import Menus from '../Menu/LeftMenu'
import HeadMenu from '../Menu/HeadMenu'
import { RipplePanel } from '../../Ui'
import { doCollapseControlPanel, doCollapse, doGridResize } from '../../../actions/control'
import { imgURL } from '../../../constants'
import { getGridState, auth, api, classnames } from '../../../utils'

import styles from './index.less'
import layStyles from '../../Layout/Layout.less'
import menusStyles from '../Menu/index.less'
import logowPng from '../../../public/imgs/cbt-logo-text.jpg'

const { Header } = Layout
const SubMenu = Menu.SubMenu

class Headers extends Component {
  constructor(props) {
    super(props)
    this.handleDoCollapse = this.handleDoCollapse.bind(this)
    this.handleDoControlCollapse = this.handleDoControlCollapse.bind(this)
    this.handleMenuSelect = this.handleMenuSelect.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize)
  }

  onWindowResize = () => {
    const { doGridResize, gridState} = this.props
    const newGridState = getGridState()

    if (newGridState !== gridState) {
      doGridResize(newGridState)
    }
  }

  handleScreenFull = () => {
    if (screenfull.enabled) {
      screenfull.request()
    }
  }

  handleDoCollapse(e) {
    e.preventDefault()
    const { doCollapse, siderCollapsed } = this.props

    doCollapse(!siderCollapsed)
  }

  handleDoControlCollapse(e) {
    const { doCollapseControlPanel, controlCollapsed } = this.props

    doCollapseControlPanel(!controlCollapsed)
  }

  handleMenuSelect(e) {
    const { history } = this.props
    const { key } = e

    if (key === "userInfo") {
      history.push('/platform/usercenter')
    } else if (key === "recover") {
      history.push('/platform/usercenter/3')
    } else if (key === "logout") {
      Modal.confirm({
        content: '确定退出吗?',
        onOk() {
          api
          .put('/sessions', {token: auth.getAuthToken()})
          .then(() => {
            auth.logout()
            history.push('/auth/login')
          })
          .catch((err) => {
            auth.logout()
            history.push('/auth/login')
            api.err(err)
          })
        },
        onCancel() {
        },
      })
    }
  }

  renderHeadBar = () => {
    const { gridState, pageLayout, siderCollapsed, history } = this.props

    let siderBar = null

    if (pageLayout === 4 || gridState === "xs" || gridState === "sm") {
      siderBar = (
        <div className={styles.leftWarpper}>
          <Popover placement="bottomLeft" overlayClassName={styles.popovermenu} content={<Menus className={menusStyles.popoverMenu} history={history} />}>
            <div className={styles.button}>
              <RipplePanel><Icon type="bars" /></RipplePanel>
            </div>
          </Popover>
        </div>
      )
    } else if (pageLayout === 3) {
      siderBar = (
        <div className={styles.leftWarpper}>
          <div className={styles.button} onClick={this.handleDoCollapse}>
            <RipplePanel><Icon type={siderCollapsed ? 'menu-unfold' : 'menu-fold'} /></RipplePanel>
          </div>
        </div>
      )
    } else if (pageLayout === 2) {
      siderBar = (
        <div className={styles.leftWarpper}>
          <img alt="logo" src={logowPng} />
          {/* {!siderCollapsed ? <img alt={'logoTxt'} src={config.logoTxt} /> : ""} */}
        </div>
      )
    } else if (pageLayout === 1) {
      siderBar = (
        <div className={styles.leftWarpper}>
          <img alt="logo" src={logowPng} />
          {/* {!siderCollapsed ? <img alt={'logoTxt'} src={config.logoTxt} /> : ""} */}
          <HeadMenu className={menusStyles["head-menu"]} history={history} />
        </div>
      )
    }

    return siderBar
  }

  render() {
    const { affixContent, pageLayout, fullScreen } = this.props
    const userInfo = auth.getUserInfo() || {}
    const { person = {} } = userInfo
    return (
      <Header className={classnames(styles.header, {[layStyles['header-resize']]: !fullScreen && pageLayout !== 3}, {[layStyles.fixheader]: affixContent && pageLayout !== 3})}>
        {this.renderHeadBar()}
        <div className={styles.rightWarpper} >
          <div className={styles.button} onClick={this.handleScreenFull}>
            <Tooltip title="全屏">
              <RipplePanel>
                <Icon type="arrows-alt" />
              </RipplePanel>
            </Tooltip>
          </div>
          <Menu
          selectedKeys={[]}
          className={styles['user-menu']}
          onSelect={this.handleMenuSelect}
          mode="horizontal"
          >
            <SubMenu
            title={
              <div className={styles.button}>
                <RipplePanel>
                  {person.avatar ? <img className={styles.avatar} alt={userInfo.username} src={imgURL + person.avatar} /> : <Icon type="user" />}
                </RipplePanel>
              </div>
            }
            >
              <Menu.Item key="viewInfo">
                {userInfo.full_name || userInfo.username}
              </Menu.Item>
              <Menu.Item key="userInfo"><Icon type="user" />个人信息</Menu.Item>
              <Menu.Item key="recover"><Icon type="reload" />修改密码</Menu.Item>
              <Menu.Item key="logout"><Icon type="poweroff" />退出</Menu.Item>
            </SubMenu>
          </Menu>
          <div className={styles.button} onClick={this.handleDoControlCollapse}>
            <RipplePanel><Icon type="appstore" /></RipplePanel>
          </div>
        </div>
      </Header>
    )
  }
}

function mapStateToProps(state) {
  const {control: { controlCollapsed, siderCollapsed, gridState, affixContent, pageLayout, fullScreen }} = state
  return { siderCollapsed, controlCollapsed, gridState, affixContent, pageLayout, fullScreen }
}

function mapDispatchToProps(dispatch) {
  return {
    doCollapse: bindActionCreators(doCollapse, dispatch),
    doCollapseControlPanel: bindActionCreators(doCollapseControlPanel, dispatch),
    doGridResize: bindActionCreators(doGridResize, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Headers)