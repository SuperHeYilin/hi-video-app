import React, { Component } from 'react';
import { Card, Button, Row, Col, Icon, message, Tag, Input, Modal } from 'antd'
import { api, err } from '../../../utils'
import Img from '../ImgKit'

import styles from './index.less'

const { Meta } = Card
const dataImg = [1,2,3,4,5,6]
const CheckableTag = Tag.CheckableTag
const Search = Input.Search
const defaultImg = require('../../../public/imgs/default1.jpg')

class VideoDetail extends Component {
  constructor(props) {
    super(props)
    const { match } = this.props
    const { id = 0 } = match.params
    this.state = {
      id,
      data: {}, // 视频简介
      imgData: [], // 视频图片信息
      videoKey: [], // 视频名称关键字建议
      selectedTags: [], // 选中关键字
      inputValue: "", // 提交关键字
      visible: false, // 模态框
      modalIMg: "", // 模态框图片地址
    }
  }
  componentDidMount = () => {
    this.fetch()
  }

  // 添加图片
  handleAddImg = () => {
    const { id } = this.state
    api.post("/video/addron", { id })
      .then((result) => {
        message.success("正在获取，请赖心等待！")
      })
      .catch(err)
  }
  // 抓取图片
  handleScannerImg = () => {
    
  }
  
  // 输入框事件
  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value})
  }
  // 更改文件名
  handleChangeName = (value) => {
    api.get("/video", { value })
      .then((result) => {
        console.log(result)
        this.fetch()
      })
      .catch(err)
  }

  // 查看图片
  handleLook = (src) => {
    this.setState({
      visible: true,
      modalIMg: src,
    })
  }

  fetch = () => {
    const { id } = this.state
    api.get("/video/detail", { id })
      .then((result) => {
        console.log(result)
        this.setState({ data: result.videoInfo, videoKey: result.videoKey })
      })
      .catch(err)
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleChange(tag, checked) {
    const { selectedTags } = this.state;
    const nextSelectedTags = checked ?
            [...selectedTags, tag] :
            selectedTags.filter(t => t !== tag);
    console.log('You are interested in: ', nextSelectedTags);
    this.setState({ selectedTags: nextSelectedTags, inputValue: [...nextSelectedTags] });
  }

  render() {
    const { data = {}, imgData, videoKey = [], selectedTags, inputValue, modalIMg } = this.state
    return (
      <div className={styles.video}>
        <div className={styles.titleName}>{data.file_name}</div>
        <div className={styles.content}>
          <Row>
          <Col md={14} lg={16}>
            <Img alt={`${data.file_name}`} src={data.img_path} defaultSrc={defaultImg} />
          </Col>
          <Col md={10} lg={8}>
            <p>
              <span className={styles.weight}>识别码:</span>
              <span style={{ color: "#CC0000"}}>{data.id}</span>
            </p>
            <p>
              <span className={styles.weight}>等级分:</span>
              <span>{data.score}</span>
            </p>
            <p>
              <span className={styles.weight}>文件大小:</span>
              <span>{data.size_mb} MB</span>
            </p>
            <p className={styles.weight}>
              路径:
            </p>
            <p>
              {data.path}
            </p>
            <p className={styles.weight}>
              类别:
            </p>
            <div>
              123123
            </div>
          </Col>
          </Row>
        </div>
        <Modal
          title="图片预览"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="1000px"
        >
          <Img alt={`${modalIMg}`} src={modalIMg} width="100%" />
          <Button.Group>
            <Button type="primary">
              <Icon type="left" />
            </Button>
            <Button type="primary">
              <Icon type="right" />
            </Button>
          </Button.Group>
        </Modal>
        <Card>
          <div>
            <div style={{ float: "right" }}>
              <Button type="primary">播放</Button>
              <Button style={{ marginLeft: 12 }}>评比</Button>
              <Button type="danger" style={{ marginLeft: 12 }}>删除</Button>
            </div>
          </div>
        </Card>

        <Card>
          <div>
            <Row>
              <Col md={18} lg={16}>
                <span style={{ fontSize: 16, fontWeight: 500 }}>名称建议:</span>
                {videoKey.map(tag => (
                  <CheckableTag
                    key={tag}
                    checked={selectedTags.indexOf(tag) > -1}
                    onChange={checked => this.handleChange(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Col>
              <Col md={6} lg={8}>
                <Search value={inputValue} onChange={this.handleInputChange} enterButton="更改名称" onSearch={this.handleChangeName} />
              </Col>
            </Row>
          </div>
        </Card>
        <Card>
          <div>
            <Row>
              <Col md={18} lg={16}>
                <span style={{ fontSize: 16, fontWeight: 500 }}>父级目录:</span>
                {videoKey.map(tag => (
                  <CheckableTag
                    key={tag}
                    checked={selectedTags.indexOf(tag) > -1}
                    onChange={checked => this.handleChange(tag, checked)}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Col>
              <Col md={6} lg={8}>
                <Search value={inputValue} onChange={this.handleInputChange} enterButton="更改父级" onSearch={this.handleChangeName} />
              </Col>
            </Row>
          </div>
        </Card>
        <Card
          title="样品图片"
          extra={
            <Button type="primary" onClick={this.handleAddImg} >
              抓取图片
            </Button>
          }
        >
          <Row gutter={12} >
            <div style={{ marginTop: 36 }}>
                {
                  imgData.map((value, key) => {
                    let imgName
                    if (value) {
                      imgName = value.imgName
                    } else {
                      imgName = ""
                    }
                    // console.log(imgName)
                    return (
                      <Col xs={12} sm={8} md={6} lg={6} xl={6} key={key}>
                        <Card
                          hoverable
                          // style={{ width: 240 }}
                          cover={
                            <div style={{ textAlign: "center" }}>
                              <Img alt="t" src={imgName} defaultSrc={defaultImg} width="100%" />
                            </div>
                          }
                        >
                          <div style={{ textAlign: "center" }}>
                            <Button.Group>
                              <Button type="primary">
                                <Icon type="retweet" />封面
                              </Button>
                              <Button type="primary" onClick={() => this.handleLook(imgName)} >
                                查看
                              </Button>
                              <Button type="primary">
                                删除<Icon type="close" />
                              </Button>
                            </Button.Group>
                          </div>
                        </Card>
                      </Col>
                    )
                  })
                }
            </div>
          </Row>
        </Card>
      </div>
    );
  }
}

export default VideoDetail;

