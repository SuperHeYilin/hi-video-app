import React,{ Component } from 'react'
import { Row, Col , Card , Input , message , Modal } from 'antd'
import { UserForm } from './Modal'
import UserView from './View'
import BalanceInfo from './BalanceInfo'
import { Layer , Button } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'

const Search = Input.Search
const ButtonGroup = Button.Group
const confirm = Modal.confirm

class UserFilter extends Component {
    constructor(props){
        super(props)
        this.state = {
            isFilter : false
        }
    }

    onSearch = (value) => {
        let { onFilter } = this.props;
        onFilter({name : value});
    }

    handleBalance = () => {
        let { selected:{ rows } , onFilter } = this.props
        let refForm;
        Layer.open({
            title : "用户余额-变更",
            width : 500,
            content : <BalanceInfo item={rows[0]} ref={(form) => { refForm = form}} />,
            onOk : (e)=>{
                refForm.validateFields((error, values) => {
                    if (error) {
                        return;
                    }

                    api
                    .post("/module/client/users/wallets/change",{...values})
                    .then((result)=>{
                        message.success("更新成功!")
                        Layer.close()
                        onFilter({refresh : Date.now()})
                    })
                    .catch(apierr)
                })
            },
        })
    }

    handleStop = () =>{
        let {selected:{ keys } , onFilter} = this.props;
        
        confirm({
            title: '确定要停用该用户吗?',
            onOk() {
                api
                .post("/module/client/users/stop",{id:keys[0]})
                .then((data) => {
                    message.success("停用成功!")
                    onFilter({refresh : keys})//传入一个刷新标记刷新table
                })
                .catch(apierr)
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    handleStart = () =>{
        let {selected:{ keys } , onFilter} = this.props;
        
        confirm({
            title: '确定要启用该用户吗?',
            onOk() {
                api
                .post("/module/client/users/start",{id:keys[0]})
                .then((data) => {
                    message.success("启动成功!")
                    onFilter({refresh : keys})//传入一个刷新标记刷新table
                })
                .catch(apierr)
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    handleView = () => {
        let {selected:{ rows }} = this.props
        
        Layer.open({
            title : "用户信息-查看",
            width : 800,
            content : <UserView id={rows[0].id} />,
            footer : <Button type="primary" onClick={()=>{Layer.close()}}>关闭</Button>,
        })
    }

    handleShowFilter = () =>{
        let isFilter = !this.state.isFilter;
        this.setState({isFilter});
    }

    render(){
        let {selected : { keys }} = this.props;
        let { isFilter } = this.state;
        if(!keys) keys = []
        return (
            <div>
                <Row gutter={24}>
                    <Col lg={8} md={12} sm={16} xs={18}>
                        <ButtonGroup>
                            <Button type="primary" disabled={keys.length !== 1} icon="eye" onClick={this.handleView}>查看</Button>
                            <Button type="primary" disabled={keys.length !== 1} icon="wallet" onClick={this.handleBalance}>余额变更</Button>
                            <Button type="ghost" disabled={keys.length !== 1} icon="stop" onClick={this.handleStart}>{keys.length > 1 ? "批量启用" : "启用"}</Button>
                            <Button type="danger" disabled={keys.length !== 1} icon="stop" onClick={this.handleStop}>{keys.length > 1 ? "批量停用" : "停用"}</Button>
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

export default UserFilter