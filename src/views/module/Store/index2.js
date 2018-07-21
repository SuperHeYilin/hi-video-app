import React, { Component } from 'react'
import { Row, Col, Form, Card, Tooltip, List, Input, Button, Icon, Modal, message } from 'antd';
import { AvatarList, Layer } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'
import styles from './CoverCardList.less'
import StoreInfo from './Info'

const confirm = Modal.confirm
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
class CradView extends Component {

	constructor(props) {
		super(props)
		this.state = {
			loading: false
		}
	}
	handleEdit = (item) => {
		const that = this;
		let { onFilter } = this.props;
		let refForm;
		Layer.open({
			title: "编辑店铺",
			width: '80vw',
			height: '100vh',
			content: <StoreInfo item={item} ref={(form) => { refForm = form }} />,
			onOk: (e) => {
				refForm.validateFields((error, values) => {
					if (error) {
						return;
					}
					that.setState({ loading: true })
					api
						.put("/pt/store", { "store": values })
						.then((data) => {
							message.success("更新成功!")
							onFilter({ refresh: new Date() })//传入一个刷新标记刷新table
							Layer.close()
							setTimeout(() => {
								that.setState({ loading: false })
							}, 500)
						})
						.catch(apierr)
				})
			},
		})
	}
	handleDelete = (item) => {
		let { onFilter } = this.props
		const that = this;
		const cf = Modal.confirm({
			title: '是否确认删除？',
			okText: '确认',
			cancelText: '取消',
			onOk() {
				that.setState({ loading: true })
				api.delete("/pt/store", { "ids": item.id })
					.then((result) => {
						if (result) {
							message.success("删除成功")
							onFilter({ refresh: new Date() })
							setTimeout(() => {
								that.setState({ loading: false })
							}, 500)
						} else {
							message.error("删除失败!")
						}
					})
					.catch(api.err)
			},
			onCancel() {
				that.setState({ loading: false })
			},
		})

	}
	handleViewQrcode = (e, item) => {
		e.preventDefault()
		console.log(e)
		this.setState({
			previewVisible: true,
			previewURL: api.getBaseHost() + "?id=" + (item.id)
		})
	}
	handleMoCancel = () => {
		this.setState({
			previewVisible: false,
		})
	}
	// 添加商品跳转
	handleAddGoods = (item) => {
		const { history } = this.props
		const { id = 0 } = item
		history.push(`/module/store/goods/${id}`)
	}
	render() {
		let { data } = this.props
		let { previewVisible, previewURL } = this.state
		const cardList = data ? (
			<List className={styles.coverCardList}
				rowKey="id"
				loading={this.state.loading}
				grid={{ gutter: 24, lg: 4, md: 3, sm: 2, xs: 1 }}
				dataSource={data}
				renderItem={item => (
					<List.Item>
						<Card
							className={styles.card}
							hoverable
							cover={<img alt={item.name} src={api.getBaseHost() + "/diffpi/upload/" + item.img} />}
							actions={[
								<Tooltip title="二维码预览" placement="bottomLeft">
								<Icon type="qrcode" onClick={(e) => this.handleViewQrcode(e, item)} />
								</Tooltip>,
								<Tooltip title="编辑店铺" placement="bottom">
								<Icon type="edit" onClick={(e) => this.handleEdit(item)} />
								</Tooltip>,
								<Tooltip title="删除店铺" placement="bottom">
								<Icon type="delete" onClick={(e) => this.handleDelete(item)} />
								</Tooltip>,
								<Tooltip title="为店铺添加商品" placement="bottomRight">
								<Icon type="plus" onClick={(e) => this.handleAddGoods(item)} />
								</Tooltip>,
							]}
						>
							<Card.Meta
								title={<a href="">{item.name}</a>}
								description={item.text}
								onClick={() => this.handleAddGoods(item)}
							/>
							<div className={styles.cardItemContent}>
								<span>地址:{item.address}</span>
							</div>
							<div className={styles.cardItemContent}>
								<span>电话：{item.phone}</span>
							</div>
							{/* <div className={styles.cardItemContent} style={{float:"right"}}>
                <ButtonGroup>
                  <Button className={styles.btn} type="danger" icon="qrcode" onClick={()=>this.handleViewQrcode(item)} />
			      <Button className={styles.btn} type="danger" icon="edit" onClick={()=>this.handleEdit(item)} />
			      <Button className={styles.btn} type="danger" icon="delete" onClick={()=>this.handleDelete(item)}/>
			    </ButtonGroup>
              </div> */}
						</Card>
					</List.Item>
				)}
			/>) : null;
		return (
			<div className={styles.cardList}>
				{cardList}
				<Modal style={{ textAlign: "center" }} transparent={true} visible={previewVisible} footer={null} onCancel={this.handleMoCancel}>
					<img style={{ width: "100%" }} src={"http://pan.baidu.com/share/qrcode?w=400&h=400&url=" + previewURL + ""} alt="123" />
					<span>请右键图片点击另存为下载</span>
				</Modal>
			</div>
		)
	}
}

export default CradView