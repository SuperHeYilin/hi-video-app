import React, { Component } from 'react';
import { Row, Col, Card, Menu, Dropdown, Icon, Radio } from 'antd'
import {
    Pie
  } from '../../../components/Charts';
import ActiveChart from '../../../components/ActiveChart';
import numeral from 'numeral'
import { api, err as apierr } from '../../../utils'

import styles from './Analysis.less';

const bottomColResponsiveProps = {
    xs: 24,
    sm: 12,
    style: { 
        marginBottom: 16,
        marginTop: 24,
    },
}
const pieSubTitle = ['支付量','热门商品']
const salesTypeData = [
    {"x":"家用电器","y":4544},
    {"x":"食用酒水","y":3321},
    {"x":"个护健康","y":3113},
    {"x":"服饰箱包","y":2341},
    {"x":"母婴产品","y":1231},
    {"x":"其他","y":1231}
]
const salesTypeDataOnline = [
    {"x":"家用电器","y":244},
    {"x":"食用酒水","y":321},
    {"x":"个护健康","y":311},
    {"x":"服饰箱包","y":41},
    {"x":"母婴产品","y":121},
    {"x":"其他","y":111}
]
const salesTypeDataOffline = [
    {"x":"家用电器","y":99},
    {"x":"个护健康","y":188},
    {"x":"服饰箱包","y":344},
    {"x":"母婴产品","y":255},
    {"x":"其他","y":65}
]
const menu = (
    <Menu>
      <Menu.Item>更新</Menu.Item>
      <Menu.Item>其他</Menu.Item>
    </Menu>
  );
const iconGroup = (
    <span className={styles.iconGroup}>
      <Dropdown overlay={menu} placement="bottomRight">
        <Icon type="ellipsis" />
      </Dropdown>
    </span>
  )
  const y = [
    {"x":"00:00","y":54},
    {"x":"01:00","y":246},
    {"x":"02:00","y":177},
    {"x":"03:00","y":340},
    {"x":"04:00","y":369},
    {"x":"05:00","y":360},
    {"x":"06:00","y":366},
    {"x":"07:00","y":535},
    {"x":"08:00","y":541},
    {"x":"09:00","y":579},
    {"x":"10:00","y":507},
    {"x":"11:00","y":735},
    {"x":"12:00","y":642},
    {"x":"13:00","y":679},
    {"x":"14:00","y":819},
    {"x":"15:00","y":822},
    {"x":"16:00","y":824},
    {"x":"17:00","y":968},
    {"x":"18:00","y":903},
    {"x":"19:00","y":998},
    {"x":"20:00","y":1191},
    {"x":"21:00","y":1197},
    {"x":"22:00","y":1119},
    {"x":"23:00","y":1263}
  ]
  const x = [
    {"x":"00:00","y":0},
    {"x":"11:00","y":0},
    {"x":"12:00","y":0},
    {"x":"23:00","y":0}
  ]
// const formatHourData = (obj) => {
//         if (obj.length > 0) {
//             return obj.map((o) => {
//                 return(Object.assign({},{x:o.hm},{y:o.n}))
//             })
//         }
//         return x
// }

class FourthCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            salesType: 'pay',
            payTypeData: [],
            goodsRankingData: [],
            hourData: x,
        }
    }
    componentDidMount() {
        api
        .get("/pt/statistics/fourthcard")
        .then((result) => {
            // console.log("第四部分数据："+JSON.stringify(result))
            // console.log("每小时数据："+JSON.stringify(result.recentlyHour))
            result.payTypeData.forEach((x) => {
                // console.log("遍历："+x)
                if (x.y === 0) {
                    x.x = "其他"
                }
                if (x.x === "0") {
                   x.x = "微信"
                }
                if (x.x === "1") {
                    x.x = "余额"
                }
                if (x.x === "2") {
                    x.x = "提货卡"
                }
            })
            // console.log("转换完："+JSON.stringify(result.payTypeData))
            this.setState({
                loading: false,
                payTypeData: result.payTypeData,
                goodsRankingData: result.goodsRankingData,
                // hourData: formatHourData(result.recentlyHour),
                hourData: result.recentlyHour.length > 0 ? result.recentlyHour : x,
            })
        })
        .catch(apierr)
    }

    handleChangeSalesType = (e) => {
        this.setState({
          salesType: e.target.value,
        });
    }
    
    render() {
        const { loading, salesType, payTypeData = salesTypeData, goodsRankingData, hourData } = this.state
        // console.log("数据："+JSON.stringify(payTypeData))
        const salesPieData = salesType === 'pay' ?
        payTypeData
        :
        (salesType === 'goods' ? goodsRankingData : salesTypeDataOffline);

        const titleName = salesType === 'pay' ?
        pieSubTitle[0]
        :
        (salesType === 'goods' ? pieSubTitle[1] : salesTypeDataOffline);

        return (
            <div>
                <Row gutter={24} >
                    <Col {...bottomColResponsiveProps}>
                        <Card title="活动情况预测"
                            //  style={{ marginBottom: 16 }} 
                             bordered={false}
                             bodyStyle={{ padding: 40 }}
                             extra={<div style={{ height: 68 }} />}
                        >
                            <ActiveChart activeData={hourData} />
                        </Card>
                    </Col>
                    <Col xl={12} lg={24} md={24} sm={24} xs={24}>
                        <Card
                        loading={loading}
                        className={styles.salesCard}
                        bordered={false}
                        title="销售相关占比"
                        bodyStyle={{ padding: 24 }}
                        extra={(
                            <div className={styles.salesCardExtra}>
                                {iconGroup}
                                <div className={styles.salesTypeRadio}>
                                    <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                                    <Radio.Button value="pay">支付类别占比</Radio.Button>
                                    <Radio.Button value="goods">热门商品</Radio.Button>
                                    {/* <Radio.Button value="offline">其他</Radio.Button> */}
                                    </Radio.Group>
                                </div>
                            </div>
                        )}
                        style={{ marginTop: 24, minHeight: 509 }}
                        >
                        <h4 style={{ marginTop: 8, marginBottom: 32 }}>{titleName}</h4>
                        <Pie
                            hasLegend="true"
                            subTitle={titleName}
                            // total={yuan(salesPieData.reduce((pre, now) => now.y + pre, 0))}
                            total={`${numeral(salesPieData.reduce((pre, now) => now.y + pre, 0)).format('0,0')}`}
                            data={salesPieData}
                            valueFormat={val => `${numeral(val).format('0,0')}`}
                            height={248}
                            lineWidth={4}
                        />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default FourthCard;