import React, { Component } from 'react'
import { Tabs, Modal, Upload, message, Icon, Button } from 'antd'
import { Ibox } from '../../../components/Ui'
import GoodsFilter from './Filter'
import GoodsList from './List'
import ListDelete from './ListDelete'
import { api, err as apierr } from '../../../utils'

const TabPane = Tabs.TabPane
const Dragger = Upload.Dragger

class Goods extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      fileName: "", // 上传成功返回的文件名
      data: { status: "0", time: new Date() },
    }
  }
  onFilter = (filterData) => {
    const { data } = this.state
    delete data.time
    this.setState({ data: {...data, ...filterData} })
  }
  // 获取列表选中项
  onSelected = (keys, rows) => {
    this.setState({ keys, rows })
  }
  // 模态框
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    const { fileName } = this.state
    message.info("后台正在处理, 请勿频繁操作！")
    api
      .post("/pt/goods/upload", { fileName })
      .then((data) => {
        const { success, error } = data
        message.info("导入成功：" + success + " 条数据,更新：" + error + " 条数据!", 5)
      })
      .catch(apierr)
      this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  handleTabChange = (key) => {
    this.setState({ data: {...this.state.data, status: key} })
  }
  // 下载商品导入模板
  handleUploadGoodsDemo = () => {
    window.open( api.getBaseHost() + "/diffpi/upload/temp/快购批量导入商品模板.xlsx")
  }
  render() {
    const { data, keys, rows, visible } = this.state;
    const props = {
      name: 'file',
      multiple: false,
      accept: ".xls, .xlsx",
      action: api.getBaseUrl() + "pt/file/file",
      onChange: (info) => {
        const { status, response } = info.file
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          this.setState({
            fileName: response,
          })
          message.success(`${info.file.name} 文件上传成功.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
    };
    return (
      <Ibox>
        <Modal
          title="批量上传商品"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Button type="primary" icon="download" style={{ width: "100%", marginBottom: 12 }} onClick={this.handleUploadGoodsDemo} >下载批量导入商品模板</Button>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或者拖拽到此区域上传</p>
            <p className="ant-upload-hint">请上传单个文件,指定的文件格式 .xls .xlsx</p>
          </Dragger>
        </Modal>
        <Ibox.IboxTitle>
          <GoodsFilter
            onFilter={this.onFilter}
            selected={{ keys, rows }}
            history={this.props.history}
            showModal={this.showModal}
          />
        </Ibox.IboxTitle>
        <Ibox.IboxContent>
          <Tabs onChange={this.handleTabChange} type="card">
            {/* <TabPane tab={<span>商品</span>} key="3">
              <GoodsList data={data} onFilter={this.onFilter} onSelected={this.onSelected} />
            </TabPane> */}
            <TabPane tab={<span>仓库商品</span>} key="0">
              <GoodsList data={data} onFilter={this.onFilter} onSelected={this.onSelected} history={this.props.history} />
            </TabPane>
            <TabPane tab={<span>上架商品</span>} key="1">
              <GoodsList data={data} onFilter={this.onFilter} onSelected={this.onSelected} history={this.props.history} />
            </TabPane>
            <TabPane tab={<span>商品回收站</span>} key="2">
              <ListDelete data={data} onFilter={this.onFilter} onSelected={this.onSelected} history={this.props.history} />
            </TabPane>
          </Tabs>
        </Ibox.IboxContent>
      </Ibox>
    )
  }
}

export default Goods