import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { auth, queryArray } from '../utils'

/**
 * 权限路由需要判断身份权限的路由
 */
class AuthRoute extends Component {
  render() {
    const { component: DefComponent, menuItems, isValiLogin = true, authority, noMatch: NoMatchComponent, ...rest } = this.props
    return (
      <Route {...rest} render={props => {
        const pathname = props.location.pathname
        const isLogin = auth.isAuthenticated()
        // 如果是开发环境则关闭授权验证
        // if(!valiNodeEnv("production")) {
        //   return <Component {...props} />
        // }

        // 自定义准入权限/权限判断
        if (authority) {
          if (authority(pathname, isLogin, menuItems)) {
            return <DefComponent {...props} />
          }
          return NoMatchComponent ? <NoMatchComponent /> : <Redirect to={{pathname: '/notauth'}} />
        }

        // 判断是否需要验证登录
        if (!isValiLogin) {
          return <DefComponent {...props} />
        }

        // 判断是否登录
        if (!auth.isAuthenticated()) {
          return (
            <Redirect
            to={{
              pathname: '/auth/login',
              state: { ...props.location },
            }}
            />
          )
        }

        // 判断菜单是否加载出来(临时解决方案，防止刷新出现为授权问题)
        if (!menuItems.length) {
          return <DefComponent {...props} />
        }
        // 判断该用户是否有访问菜单的权限
        const result = queryArray(menuItems, pathname, "menu_url", "childs", true, [], true)
        if (!result.length) {
          return (
            <Redirect
            to={{
              pathname: '/notauth',
            }}
            />
          )
        }

        return (
          <DefComponent {...props} />
        )
        }}
      />
    )
  }
}

AuthRoute.propTypes = {
  //component: PropTypes.element, // 正常渲染的元素
  //noMatch: PropTypes.element, // 权限异常渲染的元素
  menuItems: PropTypes.array, // 权限菜单
  isAuthLogin: PropTypes.bool, // 是否需要登录
  animation: PropTypes.bool, // 该路由是否有动画
}

AuthRoute.defaultProps = {
  animation: true,
}

function mapStateToProps(state) {
  const {
    menus: {
      menuItems,
    },
  } = state
  return { menuItems }
}

export default connect(mapStateToProps, null)(AuthRoute)