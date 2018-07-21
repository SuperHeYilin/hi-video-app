import React from 'react'
import { RippleButton as RippleBtn } from '../Ripple'

const RipplePanel = (props) => {
  const {children, ...otherPorps } = props
  return <RippleBtn {...otherPorps}>{children}</RippleBtn>
}

const RipplePanelSpan = (props) => {
  const {children, ...otherPorps } = props
  return <RippleBtn {...otherPorps}>{children}</RippleBtn>
}

RipplePanel.Span = RipplePanelSpan
export {
  RipplePanel,
}