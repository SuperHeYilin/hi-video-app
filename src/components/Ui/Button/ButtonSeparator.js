import React, { Component } from 'react'
import { classnames } from '../../../utils'

import styles from './index.less'

class ButtonSeparator extends Component {
    render() {
        return (
            <div className={classnames(styles['ibox-title'], this.props.className)} {...this.props} />
        )
    }
}