import React from 'react'
import { Ripple } from 'react-toolbox'

const SpanRipple = Ripple({spread: 2, centered: true})((props) => {
  const { children, ...otherPorps } = props
  return <div style={{position: 'relative'}} {...otherPorps}>{children}</div>
});


export {
  SpanRipple,
}