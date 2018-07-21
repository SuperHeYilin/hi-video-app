import React, {
	Component
} from 'react'
import { Row, Col, Card, Input, message, Modal, Affix } from 'antd'
import { Layer, Button } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'
import { QuartzForm } from './Info'
import { QuartzUptimeForm } from './Uptime'
const Search = Input.Search
const ButtonGroup = Button.Group
const confirm = Modal.confirm

class QuartzFilter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isFilter: false
		}
	}
	onSearch = (value) => {
		let {
			onFilter
		} = this.props
	}

	handleAdd = () => {
		let {
			onFilter
		} = this.props
		let refForm
		Layer.open({
		title: "新增任务",
		content: < QuartzForm  ref = {
			(form) => {
				refForm = form
			}
		}
		/>,
		onOk: (e) => {
			refForm.validateFields((error, values) => {
				if(error) {
					return
				}
				api.post("/pt/quartz/addquartz",values,{timeout:100000})
					.then((result) => {
						if(result){
							message.success("新增成功!")
							Layer.close()
							this.setState({})
							onFilter({
								refresh: new Date()
							})
						}else{
							message.error("新增失败！")
						}
						
					})
					.catch(api.err)
				})
			},
		})
	}
	handleUpTime = () => {
		let {selected: {rows,keys},onFilter} = this.props
		let refForm
		Layer.open({
			title: "更新任务时间",
			content: < QuartzUptimeForm item={rows[0]} ref = {(form) => {refForm = form}}
			/>,
			onOk: (e) => {
				refForm.validateFields((error, values) => {
					if(error) {
						return
					}
					api.put("/pt/quartz/updatetime",values,{timeout:100000})
						.then((result) => {
							if(result){
								message.success("更新成功!")
								Layer.close()
								this.setState({})
								onFilter({
									refresh: new Date()
								})
							}else{
								message.error("更新失败，请检查表达式。")
							}
							
						})
						.catch(api.err)
				})
			},
		})
	}

	handleEdit = () => {
		let {
			selected: {
				rows
			},
			onFilter
		} = this.props

	}

	handleDelete = () => {
		let {selected: {rows,keys},onFilter} = this.props
		confirm({
            title: '确定要删除选中项吗?',
            onOk() {
                api.delete("/pt/quartz/del/"+rows[0].TRIGGER_GROUP+"/"+rows[0].TRIGGER_NAME,{})
				.then((result) => {
					if(result){
						message.success("删除成功")
						onFilter({refresh : new Date()})
					}else{
						message.error("删除失败!")
					}
				})
				.catch(api.err)
            },
            onCancel() {
                console.log('Cancel')
            },
        })
	}

	handleShowFilter = () => {
		let isFilter = !this.state.isFilter
		this.setState({
			isFilter
		})
	}
	handrestart = () => {
		let {selected: {rows,keys},onFilter} = this.props
		api.post("/pt/quartz/start/"+rows[0].TRIGGER_GROUP+"/"+rows[0].TRIGGER_NAME,{})
			.then((result) => {
				if(result){
					message.success("启动成功")
					onFilter({refresh : new Date()})
				}else{
					message.error("启动失败!")
				}
			})
			.catch(api.err)
	}
	handrestop = () => {
		let {selected: {rows,keys},onFilter} = this.props
		api.post("/pt/quartz/stop/"+rows[0].TRIGGER_GROUP+"/"+rows[0].TRIGGER_NAME,{})
			.then((result) => {
				if(result){
					message.success("暂停成功")
					onFilter({refresh : new Date()})
				}else{
					message.error("暂停失败!")
				}
			})
			.catch(api.err)
	}
	handleStartone = () => {
		let {selected: {rows,keys},onFilter} = this.props
		api.post("/pt/quartz/hand/"+rows[0].TRIGGER_GROUP+"/"+rows[0].JOB_NAME,{})
			.then((result) => {
				if(result){
					message.success("执行成功")
					onFilter({refresh : new Date()})
				}else{
					message.error("执行失败!")
				}
			})
			.catch(api.err)
	}

	render() {
		let {
			isFilter
		} = this.state
		let {
			selected: {
				keys
			}
		} = this.props;
		if(!keys) keys = []
		return(
			<div>
                <Row gutter={24}>
                    <Col lg={14} md={14} sm={18} xs={22}>
                        <ButtonGroup > 
                            <Button type="primary" icon="plus" onClick={this.handleAdd}>新增</Button>
                            <Button type="ghost" disabled={keys.length !== 1} icon="edit" onClick={this.handleUpTime}>更新任务时间</Button>
                        	<Button type="ghost" disabled={keys.length !== 1} icon="delete" onClick={this.handleDelete}>删除任务</Button>
                        	<Button type="ghost" disabled={keys.length !== 1}  onClick={this.handrestart}>重启任务</Button>
                            <Button type="ghost" disabled={keys.length !== 1}  onClick={this.handrestop}>暂停任务</Button>
                            <Button type="ghost" disabled={keys.length !== 1} onClick={this.handleStartone}>立即执行一次任务</Button>
                        </ButtonGroup>
                    </Col>
                </Row>
            </div>
		)
	}
}

export default QuartzFilter