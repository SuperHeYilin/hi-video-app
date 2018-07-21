import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Layout, BackTop } from 'antd'
import { Switch } from 'react-router-dom'
import TransitionGroup from "react-transition-group/TransitionGroup"
import AnimatedSwitch from "../Animated/AnimatedSwitch"
import Bread from '../Bread'
import { doCollapseControlPanel, doCollapse, doGridResize } from '../../../actions/control'
import { doInitMenus } from '../../../actions/menus'
import { classnames } from '../../../utils'

import layStyles from '../Layout.less'

const { Content } = Layout

class Contents extends Component {
  constructor(props) {
    super(props)
    this.handleDoCollapse = this.handleDoCollapse.bind(this)
    this.handleDoControlCollapse = this.handleDoControlCollapse.bind(this)
  }

  /**
   * 容器中初始化菜单数据
   */
  componentWillMount() {
    const { menuItems, location } = this.props
    const path = location.pathname // 得到当前的路由状态
    if (!menuItems || menuItems.length < 1) {
      this.props.doInitMenus(path)
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

  renderBackTop = () => {
    const { backTop } = this.props

    const backUp = (
      <div>
        <BackTop visibilityHeight={100} target={() => document.getElementsByClassName(layStyles.main)[0]}><div className={layStyles['ant-back-top-inner']}>UP</div></BackTop>
        <BackTop visibilityHeight={100} target={() => document.getElementsByClassName(layStyles.layout)[0]}><div className={layStyles['ant-back-top-inner']}>UP</div></BackTop>
      </div>
    )

    return backTop ? backUp : null
  }

  render() {
    const { affixContent, children, pageAnimation, pageLayout, fullScreen, history, location } = this.props
    const affixClass = ["", layStyles['affix-head'], layStyles['affix-head-nav'], layStyles['affix-head-leftsider'], layStyles['affix-head-popover']][pageLayout]
    const minHeight = ["", layStyles['min-height-head'], layStyles['min-height-head-nav'], layStyles['min-height-leftsider'], layStyles['min-height-popover']][pageLayout]

    return (
      <Content className={classnames(layStyles.main, minHeight, {[affixClass]: affixContent}, {[layStyles['main-resize']]: !fullScreen && pageLayout !== 3})}>
        {this.renderBackTop()}
        <div className={layStyles.container}>
          <div className={layStyles.content}>
            <Bread visibilityHeight={100} location={location} history={history} />
            {pageAnimation ?
              <TransitionGroup component="main" >
                <AnimatedSwitch
                  key={location.key}
                  location={location}
                >
                  {children}
                </AnimatedSwitch>
              </TransitionGroup>
            :
            <Switch>
              {children}
            </Switch>
            }
          </div>
        </div>
      </Content>
    )
  }
}

function mapStateToProps(state) {
  const {
    control: {
      affixContent,
      backTop,
      pageAnimation,
      pageLayout,
      fullScreen,
    },
  } = state
  return { affixContent, backTop, pageAnimation, pageLayout, fullScreen }
}

function mapDispatchToProps(dispatch) {
  return {
    doCollapse: bindActionCreators(doCollapse, dispatch),
    doCollapseControlPanel: bindActionCreators(doCollapseControlPanel, dispatch),
    doGridResize: bindActionCreators(doGridResize, dispatch),
    doInitMenus: bindActionCreators(doInitMenus, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contents)