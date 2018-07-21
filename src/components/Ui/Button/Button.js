import React from 'react'
import classnames from 'classnames'
import { Button as AnButton } from 'antd'
import { RippleButton as RippleBtn } from '../Ripple'

import styles from './index.less'

const RippleButton = (props) => {
  const { className, ...otherPorps } = props
  return <RippleBtn style={{width: '100%'}}><AnButton className={classnames(styles['ant-btn-ripple'], className)} {...otherPorps} >{props.children}</AnButton></RippleBtn>
}

const Button = RippleButton
Button.Group = AnButton.Group

Button.propTypes = {
}

Button.defaultProps = {
}

export default Button