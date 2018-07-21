import React, { Component } from 'react'
import { Upload, message, Icon } from 'antd'
import { api } from '../../../utils'

const Dragger = Upload.Dragger

class Address extends Component {
  render() {
    const { handleChangeValue } = this.props
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
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">点击或者拖拽到此区域上传</p>
        <p className="ant-upload-hint">请上传单个文件,指定的文件格式 .xls .xlsx</p>
      </Dragger>
    )
  }
}

export default Address