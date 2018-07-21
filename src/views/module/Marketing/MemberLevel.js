import React,{ Component } from 'react'
import { Input , InputNumber , Table , Popconfirm , Modal , Divider , Button as AntBtn , message } from 'antd'
import { Button } from '../../../components/Ui' 
import { api } from '../../../utils'

const confirm = Modal.confirm
class MemberLevel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      memberLevels: []
    }
  }

  componentWillMount() {
    this.fetch()
  }
  
  fetch = ()=>{
    api
    .get("/module/memberlevel")
    .then((result)=>{
      result = result ? result : []
      this.setState({memberLevels:result})
    })
    .catch(api.err)
  }

  handleSave = ()=>{
    const { memberLevels } = this.state

    memberLevels.map((item)=>{
      if(!item.create_time){
        delete item.id
      }
      return item
    })

    api
    .post("/module/memberlevel",{memberLevels})
    .then((result)=>{
      message.success("更新成功!")
      this.fetch()
    })
    .catch(api.err)
  }

  handleRefreshMemberLevels = (memberLevels)=>{
    this.setState({memberLevels})
  }

  handleAddRule = ()=>{
    const { memberLevels=[] } = this.state
    memberLevels.push({
      id: new Date().getTime(),
      level: 0,
      name: "",
      integral_proportion: "0",
      memo: "",
      editable: true,
    })
    this.setState({memberLevels})
  }

  render() {
    const { memberLevels=[] } = this.state
    return (
      <div>
        <Divider dashed={true}>会员等级</Divider>
        <EditableTable refresh={this.handleRefreshMemberLevels} memberLevels={memberLevels} />
        <div style={{textAlign:"center",paddingBottom:10,marginTop:20}}>
        <Button type="primary" style={{width:300}} onClick={this.handleSave}>保存</Button>
        <Button type="primary" style={{width:100,marginLeft:10}} onClick={this.handleAddRule}>添加</Button>
        </div>
      </div>
    )
  }
}

export default MemberLevel

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input size="small" value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)

const EditTableIntCell = ({ editable, value, onChange })=>(
  <div>
    {editable ? 
      <InputNumber
      defaultValue={value}
      min={0}
      max={100}
      size="small"
      onChange={onChange}
      />
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
      size="small"
      formatter={value => `${value}%`}
      parser={value => value.replace('%', '')}
      onChange={onChange}
      />
      : value
    }
  </div>
)

class EditableTable extends React.Component {
  constructor(props) {
    super(props)
    this.columns = [{
      title: '会员名称',
      dataIndex: 'name',
      render: (text, record) => this.renderColumns(text, record, 'name'),
    }, {
      title: '会员等级',
      dataIndex: 'level',
      render: (text, record) => this.renderIntColumns(text, record, 'level'),
    }, {
      title: '积分比例',
      dataIndex: 'integral_proportion',
      render: (text, record) => this.renderNumColumns(text, record, 'integral_proportion'),
    },{
      title: '描述',
      dataIndex: 'memo',
      render: (text, record) => this.renderColumns(text, record, 'memo'),
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
    const { memberLevels = [] } = this.props
    this.state = { memberLevels }
    this.cacheData = memberLevels.map(item => ({ ...item }))
  }
  componentWillReceiveProps (nextProps) {
    const { memberLevels } = nextProps
    this.setState({
      memberLevels,
      cacheData:memberLevels.map(item => ({ ...item }))
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
  renderIntColumns(text, record, column) {
    return (
      <EditTableIntCell
      editable={record.editable}
      value={text}
      onChange={value => this.handleChange(value, record.id, column)}
      />
    )
  }
  handleChange(value, id, column) {
    const newData = [...this.state.memberLevels]
    const target = newData.filter(item => id === item.id)[0]
    if (target) {
      target[column] = value
      this.props.refresh(newData)
    }
  }
  edit(id) {
    const newData = [...this.state.memberLevels]
    const target = newData.filter(item => id === item.id)[0]
    if (target) {
      target.editable = true
      this.props.refresh(newData)
    }
  }
  save(id) {
    const newData = [...this.state.memberLevels]
    const target = newData.filter(item => id === item.id)[0]
    if (target) {
      delete target.editable
      this.props.refresh(newData)
      this.cacheData = newData.map(item => ({ ...item }))
    }
  }
  cancel(id) {
    const newData = [...this.state.memberLevels]
    const target = newData.filter(item => id === item.id)[0]
    if (target) {
      Object.assign(target, this.cacheData.filter(item => id === item.id)[0])
      delete target.editable
      this.props.refresh(newData)
    }
  }
  delete(id,record) {
    const newData = [...this.state.memberLevels]
    const finalData = newData.filter(item => id !== item.id)
    if(record.create_time){
      confirm({
        title: '确定要删除吗?',
        onOk: ()=>{
          api
          .delete("/module/memberlevel/"+id)
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
      dataSource={this.state.memberLevels}
      columns={this.columns}
      />
    )
  }
}