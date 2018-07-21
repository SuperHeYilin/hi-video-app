import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import {Layout, Icon, Switch } from 'antd'
import Menus from '../Menu/LeftMenu'
import { project as config } from '../../../constants'
import { doChangeTheme } from '../../../actions/control'

import styles from './index.less'

const { Sider } = Layout
class Siders extends Component {

  handelChangeTheme = () => {
    this.props.doChangeTheme(!this.props.darkTheme)
  }

  render() {
    const { siderCollapsed, darkTheme, gridState, pageLayout, history } = this.props

    if (pageLayout !== 3 || gridState === "xs") {
      return null
    }

    const targetSiderCollapsed = gridState === "sm" ? true : siderCollapsed

    return (
      <Sider
        // collapsible
        collapsed={targetSiderCollapsed}
        // onCollapse={this.onCollapse}
        width={224}
        className={classnames(styles.sider, {[styles.light]: !darkTheme})}
      >
        <div className={styles.logo}>
          <img alt="logo" src={require('../../../public/imgs/cbt-logo.png')} />
          {/* {!siderCollapsed ? <img alt={'logoTxt'} src={config.logoTxt} /> : ""} */}
        </div>
        <Menus history={history} />
        {!siderCollapsed ?
        <div className={styles.switchtheme}>
          <span><Icon type="bulb" />切换主题</span>
          <Switch onChange={this.handelChangeTheme} checked={darkTheme} checkedChildren="黑" unCheckedChildren="白" />
        </div> : ''}
      </Sider>
    )
  }
}

Siders.propTypes = {
  collapsed: PropTypes.bool,
  darkTheme: PropTypes.bool,
  selectedKeys: PropTypes.array, 
  isNavbar: PropTypes.bool,
  navOpenKeys: PropTypes.array,
  navHoverOpenKeys : PropTypes.array
}

function mapDispatchToProps(dispatch) {
  return {
    doChangeTheme: bindActionCreators(doChangeTheme, dispatch),
  }
}

function mapStateToProps(state) {
  const {control: {
    darkTheme,
    siderCollapsed,
    gridState,
    pageLayout,
  }} = state
  return { siderCollapsed, darkTheme, gridState, pageLayout}
}

export default connect(mapStateToProps, mapDispatchToProps)(Siders)