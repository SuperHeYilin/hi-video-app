import React from 'react'
import { Spin, Icon } from 'antd'
import styles from './index.less'

const AntIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />

const ViewSpin = (props) => {
  return (
    <Spin indicator={AntIcon} wrapperClassName={styles.viewspin}>
      <div className={styles.container} />
    </Spin>
  )
}

export default ViewSpin