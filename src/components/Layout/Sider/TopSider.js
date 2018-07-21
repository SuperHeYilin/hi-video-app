import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { Affix } from 'antd'
import Menus from '../Menu/TopMenu'
import { project as config } from '../../../constants'
import { doChangeTheme } from '../../../actions/control'

import layStyles from '../Layout.less'
import styles from './index.less'
import menuStyles from '../Menu/index.less'

class Siders extends Component {

  handelChangeTheme = () => {
    this.props.doChangeTheme(!this.props.darkTheme)
  }

  handleChangeAffix = (affixed) => {
  }

  renderTopSider = () => {
    const { affixContent, fullScreen, history } = this.props
    if (affixContent) {
      return (
        <div className={classnames(styles.topSider, layStyles.topSider, {[layStyles.fixsider]: affixContent}, {[layStyles['topSider-resize']]: !fullScreen})}>
          <Menus id="side-menu" className={classnames("nav", menuStyles["nav-menu"])} history={history} />
        </div>
      )
    }

    return (
      <div className="navbar navbar-default" style={{height: 67}}>
        <Affix onChange={this.handleChangeAffix}>
          <div className={classnames(styles.topSider, layStyles.topSider, {[layStyles['topSider-resize']]: !fullScreen})}>
            <Menus id="side-menu" className={classnames("nav", menuStyles["nav-menu"])} history={history} />
          </div>
        </Affix>
      </div>
    )
  }

  render() {
    const { gridState, pageLayout } = this.props

    if (pageLayout !== 2 || gridState === "xs" || gridState === "sm") {
      return null
    }

    return this.renderTopSider()
  }
}

Siders.propTypes = {
  affixContent: PropTypes.bool,
  gridState: PropTypes.string,
}

function mapDispatchToProps(dispatch) {
  return {
    doChangeTheme: bindActionCreators(doChangeTheme, dispatch),
  }
}

function mapStateToProps(state) {
  const {control: {
    affixContent,
    gridState,
    pageLayout,
    fullScreen,
  }} = state
  return { affixContent, gridState, pageLayout, fullScreen }
}

export default connect(mapStateToProps, mapDispatchToProps)(Siders)