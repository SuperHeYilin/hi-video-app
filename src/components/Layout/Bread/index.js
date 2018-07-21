import React, { Component } from 'react'
import { Breadcrumb, Icon } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import styles from './index.less'

class Breads extends Component {

  renderPathBreads = () => {
    const { navpath, location } = this.props
    const arraypath = navpath.keyPath
    if (arraypath.length > 0 && !location.pathname.startsWith(arraypath[arraypath.length - 1].url)) {
      return null
    }
    const breads = arraypath.map((item, key) => {
      const content = (
        <span>{item.icon ? <Icon type={item.icon} style={{ marginRight: 4 }} /> : ''}{item.name}</span>
      )
      return (
        <Breadcrumb.Item key={key}>
          {content}
        </Breadcrumb.Item>
      )
    })
    return breads
  }

  render () {
    return (
      <div className={styles.bread}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/"><Icon type="home" /></Link>
          </Breadcrumb.Item>
          {this.renderPathBreads()}
        </Breadcrumb>
      </div>
    )
  }
}

Breads.defaultProps = {
  navpath: {
    keyPath: [],
  },
}

function mapStateToProps(state) {
  const {menus: {
    navpath,
  }} = state
  return { navpath }
}

export default connect(mapStateToProps)(Breads)