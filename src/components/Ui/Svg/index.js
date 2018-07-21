import React from 'react'
import { SvgIcon } from './SvgIcon'

const Svg = ({ type, className = '', size = 'md', ...restProps }) => (
  <svg
    className={`{type.default.id} ${className}`}
    {...restProps}
  >
    {/* <use xlinkHref={type} />*/} {/* svg-sprite-loader@0.3.x */}
    {<use xlinkHref={`#${type.default.id}`} />}  {/* svg-sprite-loader@latest */}
  </svg>
)


export default Svg
export {
  Svg,
  SvgIcon,
}
