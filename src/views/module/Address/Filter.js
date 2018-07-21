import React, { Component } from 'react'
import AddressImport from './AddressImport'
import { Row, Col, Input, message, Modal } from 'antd'
import { Layer, Button } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'

const Search = Input.Search
const ButtonGroup = Button.Group
const confirm = Modal.confirm

class AddressFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFilter: false,
    }
  }

  onSearch = (value) => {
    const { onFilter } = this.props
    onFilter({name: value})
  }

  handleStop = () => {
    const {selected: { keys }, onFilter} = this.props

    confirm({
      title: '确定要停用该用户吗?',
      onOk() {
        api
        .post("/module/client/users/stop", {id: keys[0]})
        .then((data) => {
          message.success("停用成功!")
          onFilter({refresh: keys})// 传入一个刷新标记刷新table
        })
        .catch(apierr)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  handleAddressImport = () => {
    let fileName
    Layer.open({
      title: "收货地址-导入",
      width: 500,
      content: <AddressImport handleChangeValue={(value) => {fileName = value}} />,
      onOk: (e) => {
        if (fileName != null) {
          api
          .post("/module/client/users/address/import", {fileName})
          .then((result) => {
            message.success("更新成功!")
            Layer.close()
          })
          .catch(apierr)
        } else {
          message.warning("请上传地址文件")
        }
      },
    })
  }

  handleShowFilter = () => {
    const isFilter = !this.state.isFilter
    this.setState({isFilter})
  }

  render() {
    let {selected: { keys }} = this.props
    const { isFilter } = this.state
    if (!keys) keys = []
    return (
      <div>
        <Row gutter={24}>
          <Col lg={8} md={12} sm={16} xs={18}>
            <ButtonGroup>
              <Button type="primary" icon="upload" onClick={this.handleAddressImport}>批量导入</Button>
            </ButtonGroup>
          </Col>
          <Col lg={{ offset: 8, span: 8 }} md={12} sm={8} xs={0} style={{ textAlign: 'right' }}>
            { !isFilter ?
            <Search
              placeholder="姓名"
              style={{ width: 200 }}
              onSearch={this.onSearch}
            />
            :
            ""
            }
          </Col>
        </Row>
      </div>
    )
  }
}

export default AddressFilter