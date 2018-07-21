import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Menu, Icon } from 'antd'
import { RipplePanel as SpanRipple } from '../../Ui/RipplePanel'
import { classnames } from '../../../utils'
import { doChangeOpenKeys, doChangeHoverOpenKeys, doUpdateNavPath, doInitMenus } from '../../../actions/menus'

const SubMenu = Menu.SubMenu
const MenuItem = Menu.Item

class Menus extends Component {
  onUpdateNavPath = (e) => {
    const { doUpdateNavPath, history } = this.props
    // alert(JSON.stringify(e.key))

    const newPathname = e.item.props.pathname
    const oldPathname = history.location.pathname
    if (newPathname !== oldPathname) {
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
        newPKeys.push({name: item.menu_name, icon: item.menu_icon, id: item.id, url: item.menu_url})
        if (item.childs) {
          return (
            <SubMenu
            key={item.id}
            title={
              <SpanRipple>
                {newPKeys.length < 3 ? <Icon type={item.menu_icon} /> : ""}
                <span className={subClass || 'top-nav-text'}>{item.menu_name}</span>
              </SpanRipple>}
            >
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
                    <span className={newPKeys.length < 2 ? 'top-nav-text' : ''}>{item.menu_name}</span>
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
    const {selectedKeys, navHoverOpenKeys, darkTheme, menuItems, className, ...rest } = this.props
    if (menuItems.length < 1) {
      return null
    }

    const menuProps = {
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
      mode="horizontal"
      // inlineCollapsed={siderCollapsed && gridState !== "xs"}
      subMenuCloseDelay={0.06}
      subMenuOpenDelay={0}
      className={classnames(className)}
      {...rest}
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
  }} = state
  return { siderCollapsed, selectedKeys, navOpenKeys, navHoverOpenKeys, darkTheme, menuItems, navpath, gridState }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menus)
