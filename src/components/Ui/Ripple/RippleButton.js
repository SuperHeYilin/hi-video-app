import React from 'react'
import Ripple from './Ripple'

class RippleButton extends React.Component {
  constructor() {
    super();
    this.state = {
      cursorPos: {},
    }
  }

  handleClick(e) {
    // Get Cursor Position
    const cursorPos = {
      top: e.clientY,
      left: e.clientX,
      time: Date.now(),
    }
    this.setState({ cursorPos })
  }

  render () {
    return (
      <div style={{position: 'relative', overflow: 'hidden', display: "inline", textAlign: "center"}} onMouseUp={this.handleClick.bind(this)} onTouchEnd={this.handleClick.bind(this)} >
        { this.props.children }
        <Ripple cursorPos={this.state.cursorPos} />
      </div>
    )
  }
}

export {
  RippleButton,
}