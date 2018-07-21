import React, { Component } from 'react'
import { Upload, message, Icon, Button, Checkbox } from 'antd'
import { api } from '../../../utils'

const Dragger = Upload.Dragger

class FileImport extends Component {
  constructor(props) {
    super(props)
    this.state = {
       store: [], // 门店列表
    }
  }
  componentDidMount = () => {
    this.fetch()
  }
  fetch = () => {
    api
      .get("/pt/store")
      .then((data) => {
        this.setState({ store: data})
      })
      .catch(api.err)
  }
  // 下载批量上架模板
  handleUploadDemo = () => {
    window.open(api.getBaseHost() + "/diffpi/upload/temp/批量上架模板.xls")
  }
  render() {
    const { store } = this.state
    const { handleChangeValue, handleChangeStore } = this.props
    const props = {
      name: 'file',
      multiple: false,
      accept: ".xls, .xlsx",
      action: api.getBaseUrl() + "pt/file/file",
      onChange: (info) => {
        const { status, response } = info.file
        if (status !== 'uploading') {
          console.log(info.file, info.fileList)
        }
        if (status === 'done') {
          handleChangeValue(response)
          message.success(`${info.file.name} 文件上传成功.`)
        } else if (status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`)
        }
      },
    }
    return (
      <div>
        <Button type="primary" icon="download" style={{ width: "100%", marginBottom: 12 }} onClick={this.handleUploadDemo} >下载批量上架模板</Button>
        <div style={{ marginTop: 12, marginBottom: 12 }}>
        <p>请选择你要添加到的门店：</p>
        <Checkbox.Group style={{ width: '100%' }} onChange={handleChangeStore}>
          {
            store.map((v, n) => {
              return (
                  <div key={v.id}>
                    <Checkbox value={v.id} >{v.name}</Checkbox>
                    <br />
                  </div>
              )
            })
          }
        </Checkbox.Group>
        </div>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或者拖拽到此区域上传</p>
          <p className="ant-upload-hint">请上传单个文件,指定的文件格式 .xls .xlsx</p>
        </Dragger>
      </div>
    )
  }
}

export default FileImport