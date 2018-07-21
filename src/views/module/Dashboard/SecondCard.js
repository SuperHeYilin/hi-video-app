import React, { Component } from 'react';
import { Row, Col, Tooltip, Icon, } from 'antd'
import {
    ChartCard, yuan, MiniArea, MiniBar, MiniProgress, Field,
  } from '../../../components/Charts';
import Trend from '../../../components/Trend'
import numeral from 'numeral'
import { api, err as apierr } from '../../../utils'

import styles from './Analysis.less';

const topColResponsiveProps = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 12,
    xl: 6,
    style: { marginBottom: 24 },
}
const visitData = [
    {"x":"2017-11-27","y":7},
    {"x":"2017-11-28","y":5},
    {"x":"2017-11-29","y":4},
    {"x":"2017-11-30","y":2},
    {"x":"2017-12-01","y":4},
    {"x":"2017-12-02","y":7},
    {"x":"2017-12-03","y":5},
    {"x":"2017-12-04","y":6},
    {"x":"2017-12-05","y":5},
    {"x":"2017-12-06","y":9},
    {"x":"2017-12-07","y":6},
    {"x":"2017-12-08","y":3},
    {"x":"2017-12-09","y":1},
    {"x":"2017-12-10","y":5},
    {"x":"2017-12-11","y":3},
    {"x":"2017-12-12","y":6},
    {"x":"2017-12-13","y":5}
]

class SecondCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // visitData: visitData,
            all_money: 0,
            month_money: 0,
            year_money: 0,
            recently_day: [],
            recently_month: [],
        }
    }
    componentDidMount() {
        api
        .get("/pt/statistics/secondcard")
        .then((result) => {
            this.setState({
                all_money: result.all_money.allmoney,
                avg_year_money:result.avg_year_money.avg_year_money,
                // 年同比
                year_year_compare: result.year_year_compare,
                //月同比
                month_year_compare: result.month_year_compare,
                // 日环比
                day_year_compare: result.day_year_compare,
                // 月平均
                month_avg: result.month_avg,
                month_money: result.month_money.month_money,
                // 年销售
                year_money: result.year_money,
                // 昨日销售
                yesterday: result.yesterday,
                recently_day: result.recently_day,
                recently_month: result.recently_month,
            })
        })
        .catch(apierr)
    }
    
    render() {
        const { all_money = 0, month_money = 0, recently_day = 0, year_money = 0, recently_month = 0,
                avg_year_money = 0, month_year_compare = 0, day_year_compare = 0, year_year_compare = 0,
                month_avg = 0, yesterday = 0, 
        } = this.state
        let day_year_compare_pic = 0
        if (day_year_compare < 0) {
            day_year_compare_pic = 0
        }
        if (day_year_compare > 100) {
            day_year_compare_pic = 100
        }
        return (
            <div>
                <Row gutter={24}>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                        bordered={false}
                        title="总销售额"
                        action={<Tooltip title="截止目前总销售额信息"><Icon type="info-circle-o" /></Tooltip>}
                        total={yuan(all_money)}
                        footer={<Field label="年均销售额" value={`￥${numeral(avg_year_money).format('0,0')}`} />}
                        contentHeight={46}
                        >
                        <Trend flag={`${month_year_compare > 0 ? 'up' : 'down'}`} style={{ marginRight: 16 }}>
                            月同比
                            <span className={styles.trendText}>
                                {`${month_year_compare}%`}
                            </span>
                        </Trend>
                        
                        <Trend flag={`${day_year_compare > 0 ? 'up' : 'down'}`}>
                            日环比<span className={styles.trendText}>{`${day_year_compare}%`}</span>
                        </Trend>
                        </ChartCard>
                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                        bordered={false}
                        title="本年销售额"
                        action={<Tooltip title="本年销售以及最近每月情况"><Icon type="info-circle-o" /></Tooltip>}
                        // total={numeral(year_money).format('0,0')}
                        total={yuan(year_money)}
                        footer={
                            <Trend flag={`${year_year_compare > 0 ? 'up' : 'down'}`}>
                                同比去年<span className={styles.trendText}>{`${year_year_compare}%`}</span>
                            </Trend>
                        }
                        contentHeight={46}
                        >
                        <MiniBar
                            height={46}
                            data={recently_month}
                        />
                        </ChartCard>
                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                        bordered={false}
                        title="本月销售额"
                        action={<Tooltip title="本月销售以及最近每天情况"><Icon type="info-circle-o" /></Tooltip>}
                        // total={numeral(month_money).format('0,0')}
                        total={yuan(month_money)}
                        footer={<Field label="本月日均销售额" value={`￥${numeral(month_avg).format('0,0')}`} />}
                        contentHeight={46}
                        >
                        <MiniArea
                            color="#975FE4"
                            height={46}
                            data={recently_day}
                        />
                        </ChartCard>
                    </Col>
                    <Col {...topColResponsiveProps}>
                        <ChartCard
                        bordered={false}
                        title="日环比"
                        action={<Tooltip title="每日环比信息"><Icon type="info-circle-o" /></Tooltip>}
                        total={`${day_year_compare}%`}
                        footer={
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                                <Field label="昨日销售额" value={`￥${numeral(yesterday).format('0,0')}`} />
                            </div>
                        }
                        contentHeight={46}
                        >
                        <MiniProgress
                            percent={numeral(day_year_compare_pic).format('0,0')} 
                            strokeWidth={8} 
                            target={numeral(day_year_compare_pic).format('0,0')} 
                            color="#13C2C2" 
                        />
                        {/* 此处是目标完成组件 当前目标和当前为一致 */}
                        </ChartCard>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SecondCard;