import React, { Component } from 'react'
import { classnames } from '../../../utils'

import './index.less'

class Toolbar extends Component {
    static defaultProps = {
        gutter: 0,
        align: "middle",
    }

    render() {
        return (
            <div className={classnames("toolbar-nav", this.props.className)} {...this.props}>
                {this.props.children}
            </div>
        )
    }
}

class ToolbarGroup extends Component {
}

export default Toolbar