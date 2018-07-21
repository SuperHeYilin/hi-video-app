import React, { Component } from 'react';
import { Row, Col } from 'antd'
import NumberCard from './NumberCard'
import { api, err as apierr } from '../../../utils'

class SimpleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            today_money: 0,
            person_num: 0,
            user_online: 0,
            order_count: 0,
        }
    }
    componentDidMount() {
        api
        .get("/pt/statistics/simplecard")
        .then((result) => {
            // console.log("头部分数据："+JSON.stringify(result))
            this.setState({
                person_num: result.person_num,
                today_money: result.today_money.pay_amount,
                reimburse: result.reimburse.n,
                order_count: result.order_count.n,
            })
        })
        .catch(apierr)
    }
    render() {
        const { today_money = 0, person_num = 0, reimburse = 0, order_count = 0 } = this.state
        return (
            <div>
                <Row>
                    <Col lg={6} md={12}>
                        <NumberCard icon="pay-circle-o" color="#64ea91" title="今日销售额(已核验)" number={today_money} />
                    </Col>
                    <Col lg={6} md={12}>
                        <NumberCard icon="team" color="#8fc9fb" title="总注册用户" number={person_num} />
                    </Col>
                    <Col lg={6} md={12}>
                        <NumberCard icon="shopping-cart" color="#f69899" title="总支付笔数(已核验)" number={order_count} />
                    </Col>
                    <Col lg={6} md={12}>
                        <NumberCard icon="aliwangwang-o" color="#d897eb" title="待审核订单" number={reimburse} />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SimpleCard;