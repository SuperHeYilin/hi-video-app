import React, { Component } from 'react'
import { classnames } from '../../../utils'

import styles from './index.less'

class Ibox extends Component {
  render() {
    const { className, ...otherProps } = this.props

    return (
      <div className={classnames(styles.ibox, className)} {...otherProps}>
        {this.props.children}
      </div>
    )
  }
}

class IboxTitle extends Component {
  render() {
    const { className, ...otherProps } = this.props

    return (
      <div className={classnames(styles['ibox-title'], className)} {...otherProps}>
        {this.props.children}
      </div>
    )
  }
}

class IboxContent extends Component {
  render() {
    const { className, ...otherProps } = this.props

    return (
      <div className={classnames(styles['ibox-content'], className)} {...otherProps}>
        {this.props.children}
      </div>
    )
  }
}

Ibox.IboxTitle = IboxTitle
Ibox.IboxContent = IboxContent
export default Ibox