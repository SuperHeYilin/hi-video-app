import React,{ Component } from 'react'
import { Icon,Button,message} from 'antd'
import { Table,Layer } from '../../../components/Ui'
import StoreInfo from './Info'
import { api, err as apierr } from '../../../utils'
const ButtonGroup = Button.Group

class StoreList extends Component {
	
	handleEdit = (n) => {
	let {  onFilter } = this.props;
    let refForm;
    Layer.open({
        title : "编辑店铺",
        width:'80vw',
        height:'100vh',
        content : <StoreInfo item={n}  ref={(form) => { refForm = form}} />,
        onOk : (e)=>{
            refForm.validateFields((error, values) => {
                if (error) {
                    return;
                }
                api
                .put("/pt/store",{"store":values})
                .then((data) => {
                    message.success("更新成功!")
                    onFilter({refresh : new Date()})//传入一个刷新标记刷新table
                    Layer.close()
                })
                .catch(apierr)
            })
        },
    })
    }
    render() {
        let { data , onSelected } = this.props;
        let fetchProps = {
           fetch: {
                url: '/pt/store',
                data,
            },
            selection: {
                isOpen: true,
                onSelected,
            },
            columns: [
                { title: '店铺名称', dataIndex: 'name'},
                { title: '店铺地址', dataIndex: 'address'},
                { title: '经度', dataIndex: 'longitude'},
                { title: '纬度', dataIndex: 'latitude'},
                { title: '操作',width:'100px', dataIndex: 'cz',render:(v,n) => {
                	return (<div>
                		<ButtonGroup>
					      <Button type="primary" onClick={()=>this.handleEdit(n)}>
					       <Icon type="edit" /> 编辑店铺
					      </Button>
					    </ButtonGroup>
					    </div>);
                }},
            ]
        }
        return (
            <Table
                {...fetchProps}
            />
        )
    }
}

StoreList.defaultProps = {
    data:　{}
}

export default StoreList