import React,{ Component } from 'react'
import { Row, Col , Card , Input , message , Modal , Affix} from 'antd'
import { UserForm } from './Modal'
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

    componentDidMount() {
        this.fetch()
    }

    onSearch = (value) => {
        let { onFilter } = this.props;
        onFilter({name : value});
    }

    handleAdd = () => {
        let { onFilter } = this.props
        const { stores } = this.state
        let refForm;
        Layer.open({
            title : "用户信息-新增",
            content : <UserForm ref={(form) => { refForm = form}} stores={stores} />,
            onOk : (e)=>{
                refForm.validateFields((error, values) => {
                    if (error) {
                        return;
                    }

                    api
                    .post("/pt/users",{user: values})
                    .then((result)=>{
                        message.success("添加成功!")
                        Layer.close()
                        onFilter({refresh : Date.now()})
                    })
                    .catch(apierr)
                })
            },
        })
    }

    handleEdit = () => {
        let {selected:{ rows } , onFilter} = this.props
        const { stores } = this.state
        
        let refForm;
        Layer.open({
            title : "用户信息-编辑",
            content : <UserForm item={rows[0]} ref={(form) => { refForm = form}} stores={stores} />,
            onOk : (e)=>{
                refForm.validateFields((error, values) => {
                    if (error) {
                        return;
                    }

                    api
                    .put("/pt/users",{user: values})
                    .then((result)=>{
                        message.success("保存成功!")
                        Layer.close()
                        onFilter({refresh : Date.now()})//传入一个刷新标记刷新table
                    })
                    .catch(apierr)
                })
            },
        })
    }

    handleDelete = () =>{
        let {selected:{ keys } , onFilter} = this.props;
        
        confirm({
            title: '确定要删除选中项吗?',
            onOk() {
                api
                .delete("/pt/users",{ids:keys.join(",")})
                .then((data) => {
                    message.success("删除成功!")
                    onFilter({refresh : keys})//传入一个刷新标记刷新table
                })
                .catch(apierr);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    handleShowFilter = () =>{
        let isFilter = !this.state.isFilter;
        this.setState({isFilter});
    }

    fetch = ()=> {
        api
        .get("/pt/store/name")
        .then((result)=>{
            this.setState({stores : result})
        })
        .catch(api.err)
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
                            <Button type="primary" icon="plus" onClick={this.handleAdd}>新增</Button>
                            <Button type="ghost" disabled={keys.length !== 1} icon="edit" onClick={this.handleEdit}>编辑</Button>
                            <Button type="ghost" disabled={keys.length < 1} icon="delete" onClick={this.handleDelete}>{keys.length > 1 ? "批量删除" : "删除"}</Button>
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
                    <Col lg={0} md={0} sm={0} xs={6} style={{ textAlign: 'right' }}>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default UserFilter