import React from 'react';
import styles from './index.less'

class Ripple extends React.Component {
  constructor() {
    super()
    this.state = {
      animate: false,
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    const cursorPos = nextProps.cursorPos

    if (cursorPos.time !== this.props.cursorPos.time) {
      if (this.state.animate) {
        this.setState({ animate: false }, () => {
          this.reppling(cursorPos)
        })
      } else {
        this.reppling(cursorPos)
      }
    }
  }

  reppling(cursorPos) {
    const $ripple = this.refs.ripple
    const $button = $ripple.parentElement

    const buttonStyle = window.getComputedStyle($button)
    const buttonPos = $button.getBoundingClientRect()

    const buttonWidth = $button.offsetWidth
    const buttonHeight = $button.offsetHeight

    const rippleWidthShouldBe = Math.max(buttonHeight, buttonWidth)

    const centerize = rippleWidthShouldBe / 2

    this.setState({
      animate: true,
      width: rippleWidthShouldBe,
      height: rippleWidthShouldBe,
      top: cursorPos.top - buttonPos.top - centerize,
      left: cursorPos.left - buttonPos.left - centerize,
    })
  }

  render () {
    return (
      <div className={styles.Ripple + (this.state.animate ? " " + styles['is-reppling'] : "")} ref="ripple" style={{
        top: this.state.top + "px",
        left: this.state.left + "px",
        width: this.state.width + "px",
        height: this.state.height + "px",
      }}
      />
    )
  }
}

export default Ripple