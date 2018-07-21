import React from 'react'
// 引入编辑器以及编辑器样式
import BraftEditor from 'braft-editor'
import { message } from 'antd'
import { api } from '../../../utils'

import styles from './beditor.less'
import 'braft-editor/dist/braft.css'

class Beditor extends React.Component {
  state = {
		name: this.props.name || "file",
		action: api.getBaseUrl() + (this.props.action || "pt/file/image"),
		htmlContent: this.props.value || '',
		placeholder: this.props.name || '在此键入',
		maxFileSize: this.props.maxFileSize || 1024 * 5000, // 默认上传不能大于5M
		initValue: this.props.value || '',
  }

  componentDidMount() {
    const mediaLibrary = this.editorInstance.getMediaLibraryInstance()
    const libraryId = new Date().getTime()
    return
    api
    .get("/pt/file/history")
    .then((result) => {
      if (result) {
        const array = result
        let json = ""
        array.forEach((value) => {
          value.url = api.getImageUrl()+value.url
          value.thumbnail = value.url
          json += JSON.stringify(value) + ","
        })
        mediaLibrary.addItems(array)
      } else {
				console.error('获取图片库失败')
			}
		})
		.catch(api.err)
  }

  componentWillUpdate() {
    // console.info(this.editorInstance.getSelectionBlockType())
  }

  validateFn = (file) => {
    if (file.size > this.state.maxFileSize) {
      message.error("文件超过大小！")
    }
    return file.size < this.state.maxFileSize
  }

  uploadFn =(param) => {
    const serverURL = this.state.action
    const xhr = new XMLHttpRequest()
    const fd = new FormData()

    // libraryId可用于通过mediaLibrary示例来操作对应的媒体内容
    console.log(param.libraryId)

    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      const json = JSON.parse(xhr.responseText)
      const uls = api.getImageUrl()+json.id
      param.success({
        url: uls,
      })
    }

    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100)
    }

    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败，请稍后重试',
      })
    }

    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.send(fd)
  }

  handleHTMLChange = (htmlContent) => {
    this.setState({ htmlContent })
     this.props.onChange(htmlContent)
  }

  render() {
    const { placeholder } = this.state
    const cssname = styles['lbeditor']
    const editorProps = {
      placeholder,
      contentFormat: "html",
      initialContent: this.state.initValue,
      onHTMLChange: this.handleHTMLChange,
      onRawChange: this.handleRawChange,
      viewWrapper: "." + cssname,
      media: {
        validateFn: this.validateFn,
        uploadFn: this.uploadFn,
      },
      // 增加自定义预览按钮
      extendControls: [
        {
          type: 'split',
        }, {
          type: 'button',
          text: '预览',
          className: 'preview-button',
          onClick: () => {
            window.open().document.write(this.state.htmlContent)
          },
        },
      ],
    }
    return (
      <div className={cssname}>
        <BraftEditor ref={instance => this.editorInstance = instance} {...editorProps} />
      </div>
    )
  }
}

export default Beditor

/* {
	type: 'dropdown',
	text: < span > 下拉菜单 < /span>,
	component: < h1 style = {
		{
			width: 200,
			color: '#ffffff',
			padding: 10,
			margin: 0
		}
	} > Hello World! < /h1>
}, {
	type: 'modal',
	text: < span style = {
		{
			paddingRight: 10,
			paddingLeft: 10
		}
	} > 弹出菜单 < /span>,
	className: 'modal-button',
	modal: {
		title: '这是一个弹出框',
		showClose: true,
		showCancel: true,
		showConfirm: true,
		confirmable: true,
		onConfirm: () => console.log(1),
		onCancel: () => console.log(2),
		onClose: () => console.log(3),
		children: (
			<div style={{width: 480, height: 320, padding: 30}}>
                <span>Hello World！</span>
              </div>
		)
	}
}
*/