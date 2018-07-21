import React, { Component } from 'react'
import { Row , Col , Icon , Card } from 'antd'
import CountUp from 'react-countup'
import { api, err } from '../../../utils'

import styles from './index.less'

class UserView extends Component {

    constructor(props){
        super(props)
        this.state = {
            item: {
                person: {},
                account: {},
                wallet: {},
            }
        }
    }
    
    componentWillMount() {
        this.fetch()
    }
    
    fetch = ()=>{
        let { id } = this.props

        api
        .get("/module/client/users/"+id)
        .then((result)=>{
            this.setState({
                item:result
            })
        })
        .catch(err)

    }

    render(){
        let { item } = this.state
        return (
            <div className={styles['profile']}>
                <div className={styles['white-box']}>
                    <div className={styles['user-bg']}> 
                        <img width="100%" alt="user" src={require('../../../public/imgs/background.jpg')} />
                        <div className={styles["overlay-box"]}>
                            <div className={styles['user-content']}>
                                <img src={require('../../../public/imgs/logo/黑.png')} className={styles["thumb-lg"]} alt="img" />
                                <h5 className={styles['text-white']}>{item.person.nickname}</h5>
                                <h5 className={styles['text-white']}>{item.phonenum}</h5>
                                <h5 className={styles['text-white']}>余额:{item.wallet.balance}</h5>
                            </div>
                        </div>
                    </div>
                    <div className={styles['user-btm-box']}>
                        <Row gutter={12}>
                            <Col lg={8} md={8} sm={8} xs={24} >
                                <p className={styles['text-purple']}>银行名称</p>
                                <h1>{item.account.bank_name || <br />}</h1>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={24} >
                                <p className={styles["text-purple"]}>银行卡号</p>
                                <h1>{item.account.bank_card || <br />}</h1>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={24} >
                                <p className={styles["text-purple"]}>账户姓名</p>
                                <h1>{item.account.account_name || <br />}</h1>
                            </Col>
                        </Row>
                        <Row gutter={12}>
                            <Col lg={8} md={8} sm={8} xs={24} >
                                <p className={styles['text-purple']}>支付宝账户</p>
                                <h1>{item.account.ali_account || <br />}</h1>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={24} >
                                <p className={styles["text-purple"]}>支付宝姓名</p>
                                <h1>{item.account.ali_name || <br />}</h1>
                            </Col>
                        </Row>
                        <Row gutter={12}>
                            <Col lg={8} md={8} sm={8} xs={24} >
                                <p className={styles['text-purple']}>微信名称</p>
                                <h1>{item.account.wechat_name || <br />}</h1>
                            </Col>
                            <Col lg={8} md={8} sm={8} xs={24} >
                                <p className={styles["text-purple"]}>微信号</p>
                                <h1>{item.account.wechat_account || <br />}</h1>
                            </Col>
                        </Row>
                    </div>
                </div>
                {/* <div>
                    <Row gutter={24}>
                        <Col lg={12} md={12}>
                            <NumberCard iconImg={require('../../../public/imgs/money.png')} color={'green'} title="中奖收益" number={13124} />
                        </Col>
                        <Col lg={12} md={12}>
                            <NumberCard iconImg={require('../../../public/imgs/refund.png')} color={'red'} title="下注金额" number={555} />
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col lg={12} md={12}>
                            <NumberCard iconImg={require('../../../public/imgs/wechat.png')} color={'black'} title="微信充值" number={123} />
                        </Col>
                        <Col lg={12} md={12}>
                            <NumberCard iconImg={require('../../../public/imgs/alipay.png')} color={'blue'} title="支付宝充值" number={331} />
                        </Col>
                    </Row>
                </div> */}
            </div>
        )
    }
}

function NumberCard ({ icon, iconImg , color, title, number, countUp }) {
    return (
        <Card className={styles.numberCard} bordered={false} bodyStyle={{ padding: 0 }}>
        {iconImg ? <img className={styles.iconImg} alt="" src={iconImg} /> : <Icon className={styles.iconWarp} style={{ color }} type={icon} />}
        <div className={styles.content}>
            <p className={styles.title}>{title || 'No Title'}</p>
            <p className={styles.number}>
            <CountUp
                start={0}
                end={number}
                duration={2.75}
                decimals={2.5}
                useEasing
                useGrouping
                separator=","
                {...countUp || {}}
            />
            </p>
        </div>
        </Card>
    )
}
  

export default UserView