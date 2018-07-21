import React, { Component } from 'react'
import { Row , Col } from 'antd'
import { Ibox } from '../../../components/Ui'
import MenusTree from './Tree'
import MenusInfo from './Info'

import styles from './index.less'

class Menus extends Component {

	constructor(props){
		super(props)
		this.state = {}
	}

	onSelected = (key,item) => {
		this.setState({menuItem: item})
	}

	onRefresh = (menuItem , selectedKeys=[]) => {
		this.setState({refresh: new Date() , menuItem , selectedKeys})
	}

	render(){
		let { menuItem , refresh , selectedKeys } = this.state;

		return (
			<Ibox>
				<Row gutter={24} className={styles['menu']}>
					<Col lg={7} md={12} sm={24} xs={24} style={{marginTop:5}}>
						<MenusTree onSelected={this.onSelected} refresh={refresh} selectedKeys={selectedKeys} />
					</Col>
					<Col lg={17} md={12} sm={24} xs={24} style={{marginTop:5}}>
						<MenusInfo menuItem={menuItem} onRefresh={this.onRefresh} />
					</Col>
				</Row>
			</Ibox>
		)
	}
}

export default Menus