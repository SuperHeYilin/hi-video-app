import React, { Component } from 'react'
import { Tabs, Card, Row, Col, Icon} from 'antd'
import { Ibox } from '../../../components/Ui'
import RoleTree from './RoleTree'
import RoleUsers from './RoleUsers'
import RoleMenus from './RoleMenus'

import styles from './index.less'

const TabPane = Tabs.TabPane

class Authority extends Component {
  constructor(props) {
    super(props)
    this.state = {tabKey: 'users'}
  }

  onSelected = (key, item) => {
    this.setState({roleItem: item})
  }

  handleChange = (key) => {
    this.setState({tabKey: key})
  }

  render() {
    const { roleItem, tabKey } = this.state

    return (
      <Ibox>
        <Row gutter={24} className={styles['authority']}>
          <Col lg={7} md={12} sm={24} xs={24} style={{marginTop: 5}}>
            <RoleTree onSelected={this.onSelected} />
          </Col>
          <Col lg={17} md={12} sm={24} xs={24} style={{marginTop: 5}}>
            <Ibox.IboxContent className={styles['authority-info']}>
              <Tabs activeKey={tabKey} className={styles.tab} onChange={this.handleChange}>
                <TabPane tab={<span><Icon type="user" />成员</span>} key="users">
                  <Card loading={!roleItem || tabKey !== 'users'} bordered={false} bodyStyle={{padding: 0}}>
                    <RoleUsers roleItem={roleItem} />
                  </Card>
                </TabPane>
                <TabPane tab={<span><Icon type="bars" />菜单</span>} key="menus">
                  <Card loading={!roleItem} bordered={false} bodyStyle={{padding: 0}}>
                    <RoleMenus roleItem={roleItem} />
                  </Card>
                </TabPane>
              </Tabs>
            </Ibox.IboxContent>
          </Col>
        </Row>
      </Ibox>
    )
  }
}

export default Authority