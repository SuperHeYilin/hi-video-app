import React ,{ Component } from 'react'
import { Tabs } from 'antd'
import { Ibox } from '../../../components/Ui'
import DiscountForm from './Discount'
import MemberLevel from './MemberLevel'

const TabPane = Tabs.TabPane
class Order extends Component {
  constructor(props){
    super(props)
    this.state = {  
      data:{}
    }
  }

  render(){
    return (
      <Ibox>
        <Ibox.IboxContent>
          <Tabs defaultActiveKey="1">
            <TabPane tab="随机优惠" key="1">
              <DiscountForm />
            </TabPane>
            <TabPane tab="会员制度" key="2">
              <MemberLevel />
            </TabPane>
          </Tabs>
        </Ibox.IboxContent>
      </Ibox>
    )
  }
}

export default Order