import React,{ Component } from 'react'
import { Form , Row , Col , Input , InputNumber , Table , Steps , Radio , Popconfirm , Modal , Divider , Select , Button as AntBtn , message } from 'antd'
import { Button } from '../../../components/Ui' 
import { api } from '../../../utils'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Step = Steps.Step
const confirm = Modal.confirm
const { Option } = Select

class Discount extends Component {

  constructor(props) {
    super(props)
    this.state = {
      item: {},
      discountRules: []
    }
  }

  componentWillMount() {
    this.fetch()
  }
  
  fetch = ()=>{
    api
    .get("/module/discount")
    .then((result)=>{
      result = result ? result : {}
      this.setState({item:result,discountRules:result.discountRules})
    })
    .catch(api.err)
  }

  handleSave = ()=>{
    const { form } = this.props
    const { discountRules } = this.state
    form.validateFields((error, values) => {
      if (error) {
        return
      }

      discountRules.map((item)=>{
        if(!item.create_time){
          delete item.id
        }
        return item
      })
      api
      .post("/module/discount",{discount:values,discountRules})
      .then((result)=>{
        message.success("更新成功!")
        result = result ? result : {}
        this.setState({item:result,discountRules:result.discountRules})
      })
      .catch(api.err)
    })
  }

  handleRefreshDiscountRules = (discountRules)=>{
    this.setState({discountRules})
  }

  handleAddRule = ()=>{
    const { discountRules=[] } = this.state
    discountRules.push({
      id: new Date().getTime(),
      probability: 0,
      min_discount: 0,
      min_equal_rule: "0",
      max_discount: "0",
      max_equal_rule: "0",
      max_enjoy_num: "0",
      max_value: "0",
      editable: true,
    })
    this.setState({discountRules})
  }

  render() {
    const { form } = this.props
    const { item = {} , discountRules=[] } = this.state
    const { getFieldDecorator } = form
    return (
      <Form layout="inline">
        {getFieldDecorator('id', {
          initialValue: item.id,
        })(
          <Input type="hidden" />
        )}
        <Steps progressDot direction="vertical" size="small">
          <Step status="finish" title={<h3>活动信息</h3>} description={
            <Row gutter={24}>
              <Col lg={8} md={24} sm={24} xs={24} >
                <FormItem label="活动名称">
                  {getFieldDecorator('title', {
                  initialValue: item.title,
                  })(
                  <Input placeholder="请输入活动名称" />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={24} sm={24} xs={24} >
                <FormItem label="活动状态">
                  {getFieldDecorator('enable', {
                  initialValue: item.enable||"0",
                  })(
                  <RadioGroup>
                    <Radio value={"0"}>启用</Radio>
                    <Radio value={"1"}>停用</Radio>
                  </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
          }
          />
          <Step 
          status="finish" 
          title={<h3>折扣规则<AntBtn shape="circle" icon="plus" size="small" style={{marginLeft:10}} onClick={this.handleAddRule} /></h3>} 
          description={<EditableTable refresh={this.handleRefreshDiscountRules} discountRules={discountRules} />} 
          />
        </Steps>
        <div style={{textAlign:"center",paddingBottom:10}}>
          <Button type="primary" style={{width:300}} onClick={this.handleSave}>保存</Button>
        </div>
      </Form>
    )
  }
}

const DiscountForm = Form.create()(Discount)

export default DiscountForm

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input size="small" style={{ width:100 }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)

const EditTableNumCell = ({ editable, value, onChange })=>(
  <div>
    {editable ? 
      <InputNumber
      defaultValue={value}
      min={0}
      max={100}
      size="small"
      formatter={value => `${value}%`}
      parser={value => value.replace('%', '')}
      onChange={onChange}
      />
      : value
    }
  </div>
)

const EditTableSelectCell = ({ editable, value, onChange })=>(
  <div>
    {editable ? 
    <Select
    defaultValue={value}
    style={{ width: 100 }}
    onChange={onChange}
    size="small"
    >
      <Option value="0">{"<"}</Option>
      <Option value="1">{"<="}</Option>
    </Select>
    : ['<','<='][value*1]
    }
  </div>
)

class EditableTable extends React.Component {
  constructor(props) {
    super(props)
    this.columns = [{
      title: '优惠几率(%)',
      dataIndex: 'probability',
      render: (text, record) => this.renderNumColumns(text, record, 'probability'),
    }, {
      title: '最小折扣(%)',
      dataIndex: 'min_discount',
      render: (text, record) => this.renderNumColumns(text, record, 'min_discount'),
    }, {
      title: '匹配规则(min)',
      dataIndex: 'min_equal_rule',
      render: (text, record) => this.renderSelectColumns(text, record, 'min_equal_rule'),
    }, {
      title: '最大折扣(%)',
      dataIndex: 'max_discount',
      render: (text, record) => this.renderNumColumns(text, record, 'max_discount'),
    }, {
      title: '匹配规则(max)',
      dataIndex: 'max_equal_rule',
      render: (text, record) => this.renderSelectColumns(text, record, 'max_equal_rule'),
    }, {
      title: '最大限额',
      dataIndex: 'max_value',
      render: (text, record) => this.renderColumns(text, record, 'max_value'),
    }, {
      title: '最大参与人数(月)',
      dataIndex: 'max_enjoy_num',
      render: (text, record) => this.renderColumns(text, record, 'max_enjoy_num'),
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: '150px',
      render: (text, record) => {
        const { editable } = record
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.save(record.id)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm title="确定取消吗?" onConfirm={() => this.cancel(record.id)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                :
                <span>
                  <a onClick={() => this.edit(record.id)}>编辑</a>
                  <Divider type="vertical" />
                  <a onClick={() => this.delete(record.id,record)}>删除</a>
                </span>
            }
          </div>
        )
      },
    }]
    const { discountRules = [] } = this.props
    this.state = { discountRules }
    this.cacheData = discountRules.map(item => ({ ...item }))
  }
  componentWillReceiveProps (nextProps) {
    const { discountRules } = nextProps
    this.setState({
      discountRules,
      cacheData:discountRules.map(item => ({ ...item }))
    })
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
      editable={record.editable}
      value={text}
      onChange={value => this.handleChange(value, record.id, column)}
      />
    )
  }
  renderNumColumns(text, record, column) {
    return (
      <EditTableNumCell
      editable={record.editable}
      value={text}
      onChange={value => this.handleChange(value, record.id, column)}
      />
    )
  }
  renderSelectColumns(text, record, column) {
    return (
      <EditTableSelectCell
      editable={record.editable}
      value={text}
      onChange={value => this.handleChange(value, record.id, column)}
      />
    )
  }
  handleChange(value, id, column) {
    const newData = [...this.state.discountRules]
    const target = newData.filter(item => id === item.id)[0]
    if (target) {
      target[column] = value
      this.props.refresh(newData)
    }
  }
  edit(id) {
    const newData = [...this.state.discountRules]
    const target = newData.filter(item => id === item.id)[0]
    if (target) {
      target.editable = true
      this.props.refresh(newData)
    }
  }
  save(id) {
    const newData = [...this.state.discountRules]
    const target = newData.filter(item => id === item.id)[0]
    if (target) {
      delete target.editable
      this.props.refresh(newData)
      this.cacheData = newData.map(item => ({ ...item }))
    }
  }
  cancel(id) {
    const newData = [...this.state.discountRules]
    const target = newData.filter(item => id === item.id)[0]
    if (target) {
      Object.assign(target, this.cacheData.filter(item => id === item.id)[0])
      delete target.editable
      this.props.refresh(newData)
    }
  }
  delete(id,record) {
    const newData = [...this.state.discountRules]
    const finalData = newData.filter(item => id !== item.id)
    if(record.create_time){
      confirm({
        title: '确定要删除吗?',
        onOk: ()=>{
          api
          .delete("/module/discountrule/"+id)
          .then((data) => {
            message.success("删除成功!")
            this.props.refresh(finalData)
          })
          .catch(api.err)
        },
        onCancel() {
          console.log('Cancel')
        },
      })
      return
    }
    this.props.refresh(finalData)
  }
  render() {
    return (
      <Table
      bordered
      rowKey="id"
      size="small"
      pagination={false}
      dataSource={this.state.discountRules}
      columns={this.columns}
      />
    )
  }
}