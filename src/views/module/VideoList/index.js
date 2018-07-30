import React, { Component } from 'react';
import { Row, Col, Input, Icon, Card, Button, Avatar, message, Pagination } from 'antd'
import { api, err } from '../../../utils'
import Img from '../ImgKit'

const defaultAvg = require('../../../public/imgs/av.png')

const { Meta } = Card

class VideoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // data: [], // 视频数据
      pageData: [], // 每页数据
      keyWord: '', // 搜索关键字
      current: 1, // 当前页
      totalCount: 0, // 总条数
      pageSize: 24, // 每页数量
    }
  }
  componentDidMount() {
    const { currPage, keyWord } = this.state
    this.fetch(currPage, keyWord)
  }
  // 分页
  onChange = (page) => {
    const { keyWord } = this.state
    this.fetch(page, keyWord)
    this.setState({
      current: page,
      // pageData: data.slice((page - 1) * pageSize, page * pageSize),
    })
  }
  fetch = (currPage, keyWord) => {
    api.get("/video", { pageNumber: currPage, keyWord })
      .then((value) => {
        this.setState({
          pageData: value.list,
          totalCount: value.totalRow,
         })
      })
      .catch(err)
  }
  // 播放
  play = (id) => {
    api.get("/video/play", { id })
      .then((value) => {
        if (!value) {
          message.info("视频错误！")
        }
      })
      .catch(err)
  }
  // 生成图片
  addImg = (id) => {
    if (!id) {
      message.warn("未获取到信息")
      return
    }
    api.post("/video/addimg", { id })
    .then((value) => {
      message.info('后台正在生成。。。请勿平凡操作');
    })
    .catch(err)
  }
  // 视频详情
  videoInfo = (id) => {
    const { history } = this.props
    history.push(`/module/video/detail/${id}`)
  }

  handleSearchChange = (e) => {
    // this.setState({ keyWord: e.target.value })
  }

  handleSearch = () => {
    const { keyWord } = this.state
    this.fetch(1, keyWord)
  }

  render() {
    const { keyWord, current, totalCount, pageData = [], pageSize } = this.state
    return (
      <div>
        <Card>
          <Row>
            <Col xs={24} sm={10} md={10} lg={10} xl={10} style={{ marginTop: 16 }} >
              <Input
                onChange={this.handleSearchChange}
                value={keyWord}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="作品名称" size="large"
                onPressEnter={this.handleSearch}
              />
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={6} style={{ marginTop: 16, marginBottom: 16 }} >
              <Button
                type="primary"
                size="large"
                onClick={this.handleSearch}
                style={{ marginLeft: 16 }}
              >
                搜索
              </Button>
              <Button
                type="primary"
                size="large"
                style={{ marginLeft: 16, background: "#71B84F", borderColor: "#71B84F" }}
                onClick={this.handleClear}
              >
                还原
              </Button>
            </Col>
          </Row>
          <Row gutter={16}>
              {pageData.map((v, k) => {
                return (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={k} style={{ marginTop: 12 }}>
                  <Card
                    hoverable
                    // style={{ width: 300 }}
                    cover={
                      <div >
                        <Img
                          alt="example"
                          src={v.imgPath}
                          height={260}
                          // width="100%"
                          // defaultSrc={`${require("../../../public/imgs/default" + Math.floor((Math.random() * 4) + 1) +".jpg")}`}
                          defaultSrc={`${require("../../../public/imgs/default4.jpg")}`}
                          onClick={() => this.videoInfo(v.id)}
                        />
                      </div>
                          }
                    actions={[<Icon type="play-circle" onClick={() => this.play(v.id)} />,
                    <Icon type="picture" onClick={() => this.addImg(v.id)} />,
                    <Icon type="ellipsis" onClick={() => this.videoInfo(v.id)} />,
                  ]}
                  >
                    <Meta
                      // avatar={
                      //   <Img src={v.imgPath || defaultAvg} height="45px" width="45px" borderRadius="50%" />
                      //   // <Avatar src={v.imgPath || defaultAvg} size="large" />
                      // }
                      title={
                        <div>
                          <p>
                            <span style={{ color: "#20B648", fontWeight: 400}}>{v.score || 0}分</span>
                            <span style={{ color: "#1890FF", fontWeight: 400, marginLeft: 24 }}>{v.size_mb}mb</span>
                          </p>
                        </div>
                      }
                      description={
                        <div style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          <span>{v.file_name}</span>
                        </div>
                      }
                    />
                  </Card>
                </Col>
                )
              })}
          </Row>
          <div style={{ marginTop: 24, float: "right" }} >
            <Pagination showQuickJumper total={totalCount} onChange={this.onChange} current={current} pageSize={pageSize} />
          </div>
        </Card>
      </div>
    );
  }
}

export default VideoList;