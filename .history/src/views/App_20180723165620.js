import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import NProgress from 'nprogress'
import classnames from 'classnames'
import Layouts from '../components/Layout'
import {project as config} from '../constants'

import layStyles from '../components/Layout/Layout.less'
import 'nprogress/nprogress.css'

const { Header, Footer, Layout, Content, ControlPanel, TopSider, LeftSider} = Layouts

class App extends Component {
  componentWillReceiveProps() {
    NProgress.start()
  }

  /**
   * 优化加载性能
   * @param {obj} nextProps
   * @param {obj} nextState
   */
  shouldComponentUpdate(nextProps,nextState) {
    if (nextProps.location !== this.props.location) {
      // navigated!
      return true
    } else {
      return true
    }
  }

  componentDidUpdate() {
    NProgress.done()
  }

  render() {
    const { location, history, children, params } = this.props
    return (
      <Layout className={classnames(layStyles.layout)}>
        <Helmet>
          <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" name="viewport" />
          <title>嗨视频HiVideo</title>
          <link rel="icon" href={config.logoSrc} type="image/x-icon" />
          {config.iconFontUrl ? <script src={config.iconFontUrl} /> : ''}
        </Helmet>
        <LeftSider history={history} />
        <Layout>
          <Header history={history} />
          <TopSider history={history} />
          <Content location={location} history={history} params={params}>
            {children}
          </Content>
          <Footer />
        </Layout>
        <ControlPanel />
      </Layout>
    )
  }
}

export default App