import React, { Component } from 'react';
import { Card ,Tabs, DatePicker, Row, Col, } from 'antd'
import {
     Bar,
  } from '../../../components/Charts';
import numeral from 'numeral';
import { api, err as apierr } from '../../../utils'
import { getTimeDistance } from './utils/utils';
import styles from './Analysis.less';

const { TabPane } = Tabs
const { RangePicker } = DatePicker

const salesDataDemo = [
    {"x":"1月","y":387},
    {"x":"2月","y":1064},
    {"x":"3月","y":1180},
    {"x":"4月","y":502},
    {"x":"5月","y":318},
    {"x":"6月","y":699},
    {"x":"7月","y":782},
    {"x":"8月","y":1136},
    {"x":"9月","y":622},
    {"x":"10月","y":896},
    {"x":"11月","y":395},
    {"x":"12月","y":1099}
]
const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `嘉德 ${i} 号中心`,
    total: 323234,
  });
}

const rangePickerValue = ["2017-11-26T16:00:00.111Z","2017-12-03T15:59:59.111Z"];

class ThirdCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            rangePickerValue: [],
            ranking_store: [],
        }
    }

    componentDidMount() {
        api
        .get("/pt/statistics/thirdcard")
        .then((result) => {
            // console.log("第三部分数据："+JSON.stringify(result))
            this.setState({
                loading: false,
                ranking_store: result.ranking_store,
                salesData: result.ranking_eachmonth,
                register_eachmonth: result.register_eachmonth,
            })
        })
        .catch(apierr)
    }
    
    handleRangePickerChange = (rangePickerValue) => {
        // console.log(rangePickerValue[0].format('YYYY-MM-DD HH:mm:ss') + "++++++++++++++++++++++++") 
        // console.log(rangePickerValue[1].format('YYYY-MM-DD HH:mm:ss') + "++++++++++++++++++++++++") 
        if (rangePickerValue.length === 0) {
            return
        }
        const d1 = rangePickerValue[0].format('YYYY-MM-DD HH:mm:ss')
        const d2 = rangePickerValue[1].format('YYYY-MM-DD HH:mm:ss')

        api
        .post("/pt/statistics/thirdtimechange", { d1, d2 })
        .then((result) => {
            // console.log("时间切换数据："+JSON.stringify(result))
            this.setState({
                rangePickerValue,
                salesData: result,
            })
        })
        .catch(apierr)
    }

    selectDate = (type) => {
        // alert("时间："+JSON.stringify(getTimeDistance(type)))
        api
        .post("/pt/statistics/thirdtime", { type })
        .then((result) => {
            // console.log("时间切换数据："+JSON.stringify(result))
            this.setState({
                rangePickerValue: getTimeDistance(type),
                salesData: result,
            })
        })
        .catch(apierr)
    }

    isActive(type) {
        const { rangePickerValue } = this.state;
        const value = getTimeDistance(type);
        if (!rangePickerValue[0] || !rangePickerValue[1]) {
          return;
        }
        if (rangePickerValue[0].isSame(value[0], 'day') && rangePickerValue[1].isSame(value[1], 'day')) {
          return styles.currentDate;
        }
    }
    
    render() {
        const { loading, rangePickerValue, ranking_store, salesData = salesDataDemo, register_eachmonth } = this.state
        const salesExtra = (
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>  
                <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
                  今日
                </a>
                <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
                  本周
                </a>
                <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
                  本月
                </a>
                <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
                  全年
                </a>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={this.handleRangePickerChange}
                style={{ width: 256 }}
              />
            </div>
          )
        return (
            <div>
                <Card
                    loading={loading}
                    bordered={false}
                    bodyStyle={{ padding: 0 }}
                >
                <div className={styles.salesCard}>
                    <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
                    <TabPane tab="销售额" key="sales">
                        <Row>
                            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                                <div className={styles.salesBar}>
                                <Bar
                                    height={295}
                                    title="销售额趋势"
                                    data={salesData}
                                />
                                </div>
                            </Col>
                            <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                                <div className={styles.salesRank}>
                                <h4 className={styles.rankingTitle}>门店销售额排名</h4>
                                <ul className={styles.rankingList}>
                                    {
                                    ranking_store.map((item, i) => (
                                        <li key={item.title}>
                                        <span className={(i < 3) ? styles.active : ''}>{i + 1}</span>
                                        <span>{item.title}</span>
                                        <span>{numeral(item.total).format('0,0')}</span>
                                        </li>
                                    ))
                                    }
                                </ul>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tab="注册量" key="views">
                        <Row gutter={72}>
                        <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                            <div className={styles.salesBar}>
                            <Bar
                                height={292}
                                title="注册量趋势"
                                data={register_eachmonth}
                            />
                            </div>
                        </Col>
                        <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                            <div className={styles.salesRank}>
                            <h4 className={styles.rankingTitle}>门店销售额排名</h4>
                            <ul className={styles.rankingList}>
                                {
                                ranking_store.map((item, i) => (
                                    <li key={item.title}>
                                    <span className={(i < 3) ? styles.active : '' }>{i + 1}</span>
                                    <span>{item.title}</span>
                                    <span>{numeral(item.total).format('0,0')}</span>
                                    </li>
                                ))
                                }
                            </ul>
                            </div>
                        </Col>
                        </Row>
                    </TabPane>
                    </Tabs>
                </div>
                </Card>
            </div>
        );
    }
}

export default ThirdCard;