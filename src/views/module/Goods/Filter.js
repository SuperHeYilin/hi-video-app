import React, { Component } from 'react'
import { Row, Col, Upload, Input, Cascader, message, Modal, Icon, Button as Btn } from 'antd'
import FileImport from './FileImport'
import { Layer, Button } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'
import GoodsImage from './Info'

const Search = Input.Search
const ButtonGroup = Button.Group
const confirm = Modal.confirm
const Dragger = Upload.Dragger
const { TextArea } = Input;

class GoodsFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      isFilter: false,
      text: "", // 搜索内容
      skuFileName: "", // sku文件名
      classText: [], // 分类搜索内容
      classType: [], // 分类
    }
  }

  componentDidMount = () => {
    this.fetch();
  }

  // 搜索回车
  onSearch = (value) => {
    let { onFilter } = this.props;
    onFilter({ name: value });
  }
  // 搜索事件
  onChange = (e) => {
    this.setState({ text: e.target.value })
  }

  // 清空
  handleClear = () => {
    let { onFilter } = this.props;
    this.setState({ text: "", classText: [] })
    onFilter({ name: "", classText: "" })
  }
  // 高级搜索 提交
  handleAllSearch = () => {
    let { onFilter } = this.props;
    const { text, classText } = this.state
    onFilter({ name: encodeURI(text), classText: classText.join(",") })
  }
  handleEdit = () => {
    let { selected: { rows }, onFilter } = this.props
    let refForm;
    Layer.open({
      title: "编辑图片",
      content: <GoodsImage item={rows[0]} ref={(form) => { refForm = form }} />,
      onOk: (e) => {
        refForm.validateFields((error, values) => {
          if (error) {
            return;
          }
        })
      },
    })
  }
  // tab切换
  handleTabChange = (key) => {
    // console.log("key:" + key)
  }
  handleShowFilter = () => {
    let isFilter = !this.state.isFilter;
    this.setState({ isFilter });
  }
  // enterLoading = () => {
  //   const that = this;
  //   confirm({
  //     title: '因数据量比较大，更新所有数据比较缓慢！是否确认更新?',
  //     onOk() {
  //       that.setState({ loading: true });
  //       api
  //         .post("/pt/goods/updateGoods")
  //         .then((data) => {
  //           setTimeout(() => {
  //             message.success("操作成功!")
  //             that.setState({ loading: false });
  //           }, 3000)
  //         })
  //         .catch(apierr)
  //     },
  //     onCancel() {
  //       console.log('Cancel')
  //     },
  //   })
  // }
  updateImage = () => {
    api
      .get("/pt/goods/updateGoodsimg")
      .then((data) => {
        message.success("操作成功!")
      })
      .catch(apierr)
  }

  inputChange = (e) => {
    this.setState({
      inputValue: e.target.value
    })
  }

  inputPost = () => {
    let { onFilter } = this.props;
    let { inputValue } = this.state;
    if (inputValue) {
      api
        .post("/pt/goods/upgoodsinfo", { goodsid: inputValue })
        .then((data) => {
          if (data) {
            onFilter({ time: new Date() })
            Layer.close()
            message.success("成功更新" + data + "个商品")
          } else {
            message.info("更新失败")
          }

        })
        .catch(apierr)
    }
  }
  updateGoods = () => {
    Layer.open({
      title: "更新商品(多个商品以逗号隔开)",
      content: <TextArea rows={6} style={{ width: "100%" }} onPressEnter={this.inputPost} placeholder="请输入商品编号,多个商品以 逗号隔开" onChange={this.inputChange} />,
      onOk: (e) => {
        this.inputPost()
      }
    })
  }
  // 模态框
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    const { skuFileName } = this.state
    message.info("后台正在处理, 请勿频繁操作！")
    api
      .post("/pt/goods/upload/sku", { fileName: skuFileName })
      .then((data) => {
        message.info("导入成功：" + data + " 条数据!", 5)
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

  // 跳转到添加商品页面
  handlePush = () => {
    const { history } = this.props
    history.push(`/module/goods/add/${0}`)
  }
  // 分类搜索事件
  handleClassChange = (value) => {
    this.setState({
      classText: value,
    })
  }
  // 高级搜索显示隐藏
  handleShowFilter = () => {
    this.setState({
      isFilter: !this.state.isFilter,
    })
  }
  handleFastPut = () => {
    let fileName
    let storeId = []
    Layer.open({
      title: "快速上架-导入",
      width: 500,
      content: <FileImport handleChangeValue={(value) => {
        fileName = value
      }}
        handleChangeStore={(value) => {
          storeId = value
        }}
      />,
      onOk: (e) => {
        if (fileName != null && storeId.length !== 0) {
          api
            .post("/pt/goods/upload/fastput", { fileName, storeId: storeId.join(",") })
            .then((result) => {
              message.success("上架成功" + result + "件商品")
              Layer.close()
            })
            .catch(apierr)
        } else {
          message.warning("请选择文件或门店")
        }
      },
    })
  }
  // 下载sku导入模板
  handleUploadSkuDemo = () => {
    window.open(api.getBaseHost() + "/diffpi/upload/temp/批量更新sku模板.xls")
  }
  // 分类数据
  fetch = () => {
    api
      .get("/module/classification/builder")
      .then((data) => {
        this.setState({ classType: data })
      })
      .catch(apierr)
  }

  render() {
    let { selected: { keys } } = this.props;
    let { isFilter, text, classType, classText, visible } = this.state;
    if (!keys) keys = []
    // 上传属性
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
            skuFileName: response,
          })
          message.success(`${info.file.name} 文件上传成功.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} 文件上传失败.`);
        }
      },
    };
    return (
      <div>
        <Modal
          title="批量添加SKU"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Button type="primary" icon="download" style={{ width: "100%", marginBottom: 12 }} onClick={this.handleUploadSkuDemo} >下载SKU导入模板</Button>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或者拖拽到此区域上传</p>
            <p className="ant-upload-hint">请上传单个文件,指定的文件格式 .xls .xlsx</p>
          </Dragger>
        </Modal>
        <Row gutter={24}>
          <Col lg={10} md={10} sm={10} xs={10}>
            <ButtonGroup>
              <Button type="primary" icon="plus" loading={this.state.loading} onClick={this.handlePush}>
                添加商品
              </Button>
              <Button type="primary" icon="upload" onClick={this.props.showModal}>
                批量添加
              </Button>
              <Button type="primary" icon="upload" onClick={this.showModal}>
                导入SKU
              </Button>
              <Button type="primary" icon="up-square-o" onClick={this.handleFastPut}>
                快速上架
              </Button>
              {/* <Button type="primary" icon="cloud-download" onClick={this.updateImage}>
                更新图片
				        </Button> */}
              {/* <Button type="danger" ghost style={{ marginLeft: "20px" }} onClick={this.updateGoods}>更新商品</Button> */}
            </ButtonGroup>
          </Col>
          <Col lg={{ offset: 6, span: 8 }} md={12} sm={8} xs={0} style={{ textAlign: 'right', display: `${isFilter ? "none" : "block"}` }}>
            <Search
              placeholder="商品编号/名称/条码"
              style={{ width: 200, marginRight: 12 }}
              onSearch={this.onSearch}
              onChange={this.onChange}
              value={text}
            />
            <Button icon="down" onClick={this.handleShowFilter}>
              高级搜索
            </Button>
          </Col>
        </Row>
        <div style={{ marginTop: 24, display: `${isFilter ? "block" : "none"}` }}>
          <Row>
            名称：
          <Input
              placeholder="商品编号/名称/条码"
              style={{ width: 200, marginRight: 12 }}
              // onSearch={this.onSearch}
              onChange={this.onChange}
              value={text}
            />
            分类：
          <Cascader options={classType} onChange={this.handleClassChange} value={classText} changeOnSelect placeholder="请选择分类" />
            <Button type="primary" loading={this.state.loading} onClick={this.handleAllSearch} style={{ marginLeft: 24 }}>
              搜索
            </Button>
            <Button style={{ marginLeft: 12 }} onClick={this.handleClear} >
              重置
            </Button>
            <span style={{ float: "right" }}>
              <Button icon="up" onClick={this.handleShowFilter}>
                收起
              </Button>
            </span>
          </Row>
        </div>
      </div>
    )
  }
}

export default GoodsFilter