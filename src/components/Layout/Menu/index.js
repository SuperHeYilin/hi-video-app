import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Menu, Icon } from 'antd'
import { SpanRipple } from './SpanRipple'
import { getHistoryByNodeEnv, classnames } from '../../../utils'
import { doChangeOpenKeys, doChangeHoverOpenKeys, doUpdateNavPath, doInitMenus } from '../../../actions/menus'
import { doPageUpdate } from '../../../actions/content'

import styles from './index.less'

const history = getHistoryByNodeEnv()
const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

class Menus extends Component {
  onUpdateNavPath = (e) => {
    const { doUpdateNavPath, doPageUpdate} = this.props
    // alert(JSON.stringify(e.key))
    
    const newPathname = e.item.props.pathname
    const oldPathname = history.getCurrentLocation().pathname
    if (newPathname !== oldPathname) {
      doPageUpdate(true)
      doUpdateNavPath(e.item.props.pkeys, e.key)
      setTimeout(() => {
        history.push(newPathname)
      }, 0)
    }
  }

  onOpenChange = (openKeys) => {
    const { doChangeOpenKeys } = this.props
    doChangeOpenKeys(openKeys)
  }

  onHoverOpenChange = (openKeys) => {
    const { doChangeHoverOpenKeys } = this.props
    doChangeHoverOpenKeys(openKeys)
  }

  renderMenuItems(menuItems, subClass, pkeys = []) {
    if (!menuItems || menuItems.length < 1) {
      return null
    } else {
      const menus = menuItems.map(item => {
        const newPKeys = pkeys.concat()
        newPKeys.push({name: item.menu_name, icon: item.menu_icon, id: item.id})
        if (item.childs) {
          return (
            <SubMenu key={item.id} title={<SpanRipple>{newPKeys.length < 3 ? <Icon type={item.menu_icon} /> : ""} <span className={subClass || 'nav-text'}>{item.menu_name}</span></SpanRipple>}>
              {this.renderMenuItems(item.childs, "nav-subtext", newPKeys)}
            </SubMenu>
          )
        }

        return (
          <MenuItem key={item.id} pathname={item.menu_url} pkeys={newPKeys}>
            <SpanRipple>
                {newPKeys.length < 3 ?
                  <span>
                    {item.menu_icon ? <Icon type={item.menu_icon} /> : ""}
                    <span className={newPKeys.length < 2 ? 'nav-text' : ''}>{item.menu_name}</span>
                  </span>
                :
                  item.menu_name
                }
            </SpanRipple>
          </MenuItem>
        )
      })

      return menus
    }
  }

  render() {
    const { siderCollapsed, selectedKeys, navOpenKeys, navHoverOpenKeys, darkTheme, menuItems, gridState, popoverMenu, className } = this.props
    if (menuItems.length < 1) {
      return null
    }

    let targetSiderCollapsed = gridState === "sm" ? true : siderCollapsed
    targetSiderCollapsed = popoverMenu ? false : siderCollapsed
    
    const menuProps = !targetSiderCollapsed ? {
      selectedKeys,
      openKeys: navOpenKeys,
      onOpenChange: this.onOpenChange,
    } : {
      onOpenChange: this.onHoverOpenChange,
      selectedKeys,
      openKeys: navHoverOpenKeys,
    }
    
    const menus = this.renderMenuItems(menuItems)
    return (
      <Menu
        {...menuProps}
        onClick={this.onUpdateNavPath}
        onSelect={(item, key, selectedKeys) => null}
        theme={darkTheme ? 'dark' : 'light'}
        mode="inline"
        inlineCollapsed={targetSiderCollapsed && gridState !== "xs"}
        className={classnames(styles.siderMenu, className)}
      >
        {menus}
      </Menu>
    )
  }
} 

Menus.defaultProps = {
  selectedKeys: [],
  navOpenKeys: [],
  navHoverOpenKeys: [],
  siderCollapsed: true,
}

Menus.propTypes = {
  siderCollapsed: PropTypes.bool,
  darkTheme: PropTypes.bool,
  selectedKeys: PropTypes.array,
  isNavbar: PropTypes.bool,
  menuItems: PropTypes.array,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
  changeHoverOpenKeys: PropTypes.func,
  updateNavPath: PropTypes.func
}

function mapDispatchToProps(dispatch) {
    return {
      doChangeOpenKeys: bindActionCreators(doChangeOpenKeys, dispatch),
      doChangeHoverOpenKeys: bindActionCreators(doChangeHoverOpenKeys, dispatch),
      doUpdateNavPath: bindActionCreators(doUpdateNavPath, dispatch),
      doInitMenus: bindActionCreators(doInitMenus, dispatch),
      doPageUpdate: bindActionCreators(doPageUpdate, dispatch),
    }
}

function mapStateToProps(state) {
  const {menus: {
    selectedKeys,
    navHoverOpenKeys,
    navOpenKeys,
    menuItems,
    navpath,
  }, control: {
    darkTheme,
    siderCollapsed,
    gridState,
    popoverMenu,
  }} = state
  return { siderCollapsed, selectedKeys, navOpenKeys, navHoverOpenKeys, darkTheme, menuItems, navpath, gridState, popoverMenu }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menus)
