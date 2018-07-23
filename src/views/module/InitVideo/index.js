import React, { Component } from 'react'
import { Card, Row, Col, Select, Button, Icon, Modal, Input, Table, message, List, Tree, Cascader, Radio  } from 'antd'
import { api, err } from '../../../utils'

const Option = Select.Option
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake',
    }],
  }],
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men',
    }],
  }],
}];

export default class InitVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disk: '', // 选取磁盘路径
      diskNames: [], // 移动硬盘名称集合
      diskName: 'default', // 选取别名
      visible: false,
      newDisk: '', // 新建盘符名称
      pathInfo: ['无最新信息'], // 扫描完的路径信息
      directory: [],
      cascaderDir: "", // 目标文件夹路径
      initType: 2, // 初始化类型
    };
  }
  componentDidMount() {
    // this.fetch()
  }
  fetch = () => {
    api.get("/file")
      .then((value) => {
        console.log(value)
        const {directory, diskInfo, videoInfo} = value
        this.setState({
          diskNames: diskInfo,
          directory,
          // pathInfo: videoInfo,
        })
      })
      .catch(err)
  }
  //input改变
  handleInputChange = (e) => {
    this.setState({ disk: e.target.value })
  }
  // 级联文件夹选择
  handleCascaderChange = (value) => {
    console.log("级联路径：", value)
    this.setState({ cascaderDir: value })
  }
  // 初始化类型
  handleRadioChange = (e) => {
    console.log("初始化类型", e.target.value)
    this.setState({ initType: e.target.value })
  }
  // 扫描注入
  handleInit = (e) => {
    const { disk, diskName } = this.state
    // if (diskName === "default") {
    //   message.warn("文件夹别名不能为空")
    //   return
    // }
    api.post("/video/init", { path: disk })
      .then((value) => {
        message.info("操作成功")
        // console.log(value)
        // this.setState({ pathInfo: value })
        // this.fetch()
      })
      .catch(err)
  }

  render() {
    const { disk, diskNames, diskName, visible, newDisk, pathInfo, cascaderDir, initType } = this.state

    const loop = data => data.map((item) => {
      if (item.child && item.child.length) {
        return <TreeNode key={item.id} title={item.name}>{loop(item.child)}</TreeNode>;
      }
      return <TreeNode key={item.id} title={item.name} />;
    });
    const columns = [{
      title: 'id',
      dataIndex: 'id',
      render: text => <a href="#">{text}</a>,
    }, {
      title: 'Age',
      dataIndex: 'age',
    }];
    return (
      <div>
        <Tree>
          {loop(this.state.directory)}
        </Tree>
        <Card
          title="扫描文件"
        >
          <Row>
            <Col>
              <Input value={disk} placeholder="文件夹路径" onChange={this.handleInputChange} style={{ width: 220, marginRight: 24 }} size="large" />
              <Cascader options={options} onChange={this.handleCascaderChange} changeOnSelect placeholder="请选择类型" style={{ width: 220 }} size="large" />
              <RadioGroup onChange={this.handleRadioChange} value={initType} size="large" style={{marginLeft: 24, marginRight: 24}} >
                <Radio value={1}>初始化导入</Radio>
                <Radio value={2}>导入TEMP</Radio>
              </RadioGroup>
              <Button type="primary" size="large" onClick={this.handleInit} >初始化</Button>
            </Col>
          </Row>
          <Row style={{ marginTop: 24 }}>
            <Col>
              <Table columns={columns} dataSource={pathInfo} />
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
}
