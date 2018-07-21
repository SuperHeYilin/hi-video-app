import React, { Component } from 'react'
import { Row , Col } from 'antd'
import { Ibox } from '../../../components/Ui'
import RoleTree from './Tree'
import RoleInfo from './Info'

import styles from './index.less'

class Roles extends Component {

    constructor(props){
        super(props)
        this.state = {}
    }

    onSelected = (key,item) => {
        this.setState({roleItem: item})
    }

    onRefresh = (roleItem , selectedKeys=[]) => {
        this.setState({refresh: new Date() , roleItem , selectedKeys})
    }

    render(){
        let { roleItem , refresh , selectedKeys } = this.state

        return (
            <Ibox>
                <Row gutter={24} className={styles['role']}>
                    <Col lg={7} md={12} sm={24} xs={24} style={{marginTop:5}}>
                        <RoleTree onSelected={this.onSelected} refresh={refresh} selectedKeys={selectedKeys} />
                    </Col>
                    <Col lg={17} md={12} sm={24} xs={24} style={{marginTop:5}}>
                        <RoleInfo roleItem={roleItem} onRefresh={this.onRefresh} />
                    </Col>
                </Row>
            </Ibox>
        )
    }
}

export default Roles