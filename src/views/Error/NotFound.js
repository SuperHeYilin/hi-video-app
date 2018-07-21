import React, {Component} from 'react'
import { Button} from 'antd'
import { Svg } from '../../components/Ui'
import styles from './index.less'

export default class NotFund extends Component {
	render() {
		const { history } = this.props

		return (
			<div className={styles.ErrorNormal}>
				<div className={styles.ErrorImg}>
					<Svg type={require("../../public/svg/notfund.svg")} />
				</div>
				<div className={styles.ErrorContainer}>
					<h1 className={styles.ErrorTitle}>404</h1>
					<p className={styles.ErrorDesc}>抱歉，您访问的页面不存在</p>
					<Button type="primary" onClick={() => history.push("/")} style={{ marginTop: 5 }}>返回首页</Button>
				</div>
			</div>
		)
	}
}