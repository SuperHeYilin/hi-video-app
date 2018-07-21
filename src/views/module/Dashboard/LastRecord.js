import React, { Component } from 'react';
import { Card, Tabs, Row, Col } from 'antd'
import {
     Pie, TimelineChart,
  } from '../../../components/Charts';
import NumberInfo from '../../../components/NumberInfo';

import { api, err as apierr } from '../../../utils'

import styles from './Analysis.less';

const { TabPane } = Tabs



//对象添加百分比
const formatPercent = (sum, num) => {
    return num.map((n) => {
        return(Object.assign({},{name: n.title},{cvr: ((n.total / sum.allmoney)).toFixed(1)}))
    })
}
//时间转换时间戳
const formatTime = (obj) => {
    // console.log("时间转换"+JSON.stringify(obj))
    if (obj.length <= 0) {
        return
    }
    return obj.map((o) => {
        return (Object.assign({},{x:Date.parse(new Date(o.x))},{y1:o.y}))
    })
}

class LastRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            currentTabKey: '',
            storeRankingData: [],
            offlineChartData: [],
        }
    }

    componentDidMount() {
        // alert(Date.parse(new Date("2014-07-10 10:21:12")))
        api
        .get("/pt/statistics/lastcard")
        .then((result) => {
            // console.log("最后部分数据："+JSON.stringify(result))
            // console.log("合并百分比数据"+JSON.stringify(formatPercent(result.allMoney, result.storeRanking)))
            
            this.setState({
                loading: false,
                storeRankingData: formatPercent(result.allMoney, result.storeRanking),
                offlineChartData: formatTime(result.recently),
            })
        })
        .catch(apierr)
    }

    handleTabChange = (key) => {
        this.setState({
            currentTabKey: key,
        });
    }
    
    render() {
        const offlineDataDemo = [
            {"name":"门店0","cvr":0.9},
            {"name":"门店1","cvr":0.4},
            {"name":"门店2","cvr":0.3},
            {"name":"门店3","cvr":0.4},
            {"name":"门店4","cvr":0.1},
            {"name":"门店5","cvr":0.7},
            {"name":"门店6","cvr":0.2},
            {"name":"门店7","cvr":0.4},
            {"name":"门店8","cvr":0.3},
            {"name":"门店9","cvr":0.4}
        ]
        const offlineChartDataDemo = [
            {"x":1511836943277,"y1":82,"y2":45},
            {"x":1511838743277,"y1":91,"y2":61},
            {"x":1511840543277,"y1":19,"y2":69},
            {"x":1511842343277,"y1":103,"y2":15},
            {"x":1511844143277,"y1":88,"y2":45},
            {"x":1511845943277,"y1":62,"y2":83},
            {"x":1511847743277,"y1":94,"y2":31},
            {"x":1511849543277,"y1":63,"y2":91},
            {"x":1511851343277,"y1":83,"y2":87},
            {"x":1511853143277,"y1":109,"y2":37},
            {"x":1511854943277,"y1":63,"y2":59},
            {"x":1511856743277,"y1":24,"y2":49},
            {"x":1511858543277,"y1":63,"y2":24},
            {"x":1511860343277,"y1":76,"y2":70},
            {"x":1511862143277,"y1":42,"y2":98},
            {"x":1511863943277,"y1":79,"y2":31},
            {"x":1511865743277,"y1":26,"y2":50},
            {"x":1511867543277,"y1":38,"y2":89},
            {"x":1511869343277,"y1":38,"y2":71},
            {"x":1511871143277,"y1":21,"y2":47}
        ]
        const { loading, currentTabKey, storeRankingData=offlineDataDemo, offlineChartData=offlineChartDataDemo } = this.state

        const activeKey = currentTabKey || (storeRankingData[0] && storeRankingData[0].name);
        // console.log("近期"+JSON.stringify(offlineChartData))
        const CustomTab = ({ data, currentTabKey: currentKey }) => (
            <Row gutter={8} style={{ width: 138, margin: '8px 0' }}>
              <Col span={12}>
                <NumberInfo
                  title={data.name}
                  subTitle="销售占比"
                  gap={2}
                  total={`${data.cvr * 100}%`}
                  theme={(currentKey !== data.name) && 'light'}
                />
              </Col>
              <Col span={12} style={{ paddingTop: 36 }}>
                <Pie
                  animate={false}
                  color={(currentKey !== data.name) && '#BDE4FF'}
                  inner={0.55}
                  tooltip={false}
                  margin={[0, 0, 0, 0]}
                  percent={data.cvr * 100}
                  height={64}
                />
              </Col>
            </Row>
          );
        
        return (
            <div>
                <Card
                    loading={loading}
                    className={styles.offlineCard}
                    bordered={false}
                    bodyStyle={{ padding: '0 0 32px 0' }}
                    style={{ marginTop: 32 }}
                >
                    <Tabs
                        activeKey={activeKey}
                        onChange={this.handleTabChange}
                    >
                        {
                        storeRankingData.map(shop => (
                            <TabPane
                            tab={<CustomTab data={shop} currentTabKey={activeKey} />}
                            key={shop.name}
                            >
                            <div style={{ padding: '0 24px' }}>
                                <TimelineChart
                                data={offlineChartData}
                                titleMap={{ y1: '近期日销售额' }}
                                />
                            </div>
                            </TabPane>)
                        )
                        }
                    </Tabs>
                </Card>
            </div>
        );
    }
}

export default LastRecord;