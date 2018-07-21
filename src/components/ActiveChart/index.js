import React, { PureComponent } from 'react';

import { MiniArea } from '../Charts';
import NumberInfo from '../NumberInfo';

import styles from './index.less';

const x = [
  {"x":"00:00","y":0},
  {"x":"11:00","y":0},
  {"x":"12:00","y":0},
  {"x":"23:00","y":0}
]
//按升序排列
function compare(y) {
  return function(a, b) {
      var value1 = a[y];
      var value2 = b[y];
      return value1 - value2;
  }
}

function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}


function getActiveData() {
  const activeData = [];
  for (let i = 0; i < 24; i += 1) {
    activeData.push({
      x: `${fixedZero(i)}:00`,
      y: (i * 50) + (Math.floor(Math.random() * 200)),
    });
  }
  return activeData;
}

export default class ActiveChart extends PureComponent {
  state = {
    activeData: getActiveData(),
  }

  componentDidMount() {
    // this.timer = setInterval(() => {
    //   this.setState({
    //     activeData: getActiveData(),
    //   });
    // }, 1000);
  }

  componentWillUnmount() {
    // clearInterval(this.timer);
  }

  render() {
    const { activeData = x } = this.props;
    const sortData = [...activeData].sort(compare('y'))
    // console.log("排序"+JSON.stringify(Object.values(sortData)[activeData.length - 1].y))
    return (
      <div className={styles.activeChart}>
        <NumberInfo
          subTitle="目标评估"
          total="有望达到预期"
        />
        <div style={{ marginTop: 52 }}>
          <MiniArea
            animate={false}
            line
            borderWidth={2}
            height={158}
            yAxis={{
              tickCount: 3,
              tickLine: false,
              labels: false,
              title: false,
              line: false,
            }}
            data={activeData}
          />
        </div>
        {
          activeData && (
            <div className={styles.activeChartGrid}>
              <p>{Object.values(sortData)[sortData.length - 1].y} 元</p>
              <p>{Object.values(sortData)[0].y} 元</p>
            </div>
          )
        }
        {
          activeData && (
            <div className={styles.activeChartLegend}>
              {/* <span>00:00</span> */}
              <span>{activeData[Math.floor(activeData.length / 2)].x}</span>
              <span>{activeData[activeData.length - 1].x}</span>
            </div>
          )
        }
      </div>
    );
  }
}
