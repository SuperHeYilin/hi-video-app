import React, { Component } from 'react'
import { Layout } from 'antd'
import { project } from '../../../constants'

import styles from './index.less'

const { Footer } = Layout

class Footers extends Component {
	render() {
		return (
			<Footer className={styles.footer}>
				{project.footerText}
			</Footer>
		)
	}
}

export default Footers