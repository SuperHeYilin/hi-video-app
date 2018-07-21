import React,{ Component } from 'react'
import { Row, Col , Card , Input , message , Modal,Icon,Select,Button } from 'antd'
import { Layer } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'
import StoreInfo from './Info'
const Search = Input.Search
const ButtonGroup = Button.Group
const confirm = Modal.confirm
const Option = Select.Option

class StoreFilter extends Component {
    constructor(props){
        super(props)
        this.state = {
            isFilter : false
        }
    }

    onSearch = (value) => {
        let { onFilter } = this.props;
        onFilter({name : encodeURI(value)});
    }


    handleAdd = () => {
    	let { selected:{ rows } , onFilter } = this.props
	    let refForm;
	    Layer.open({
	        title : "新增店铺",
	        width:'80vw',
	        height:'100vh',
	        content : <StoreInfo ref={(form) => { refForm = form}} />,
	        onOk : (e)=>{
	        	// console.info(refForm);
	            refForm.validateFields((error, values) => {
	                if (error) {
	                    return;
	                }
	                // console.info(values);
	                api
	                .post("/pt/store",{"store":values})
	                .then((data) => {
	                    message.success("新增成功!")
	                    onFilter({refresh : new Date()})//传入一个刷新标记刷新table
	                    Layer.close()
	                })
	                .catch(apierr)
	            })
	        },
	    })
    }

    handleDelete = () =>{
       let {selected : { keys },onFilter} = this.props;
       confirm({
            title: '是否确认删除？',
            onOk() {
                api.delete("/pt/store",{"ids":keys})
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
    enterLoading = () =>{
    	const that = this; 
    	confirm({
            title: '因数据量比较大，更新所有数据比较缓慢！是否确认更新?',
            onOk() {
                that.setState({ loading: true });
		        setTimeout(()=>{
		        	that.setState({ loading: false }); 
		        },3000)
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    handleUpdateGoodsID = () => {
        api.put("/module/store/goods/goodsId")
        .then((result) => {
            if (result) {
                message.success("删除成功")
            } else {
                message.error("删除失败!")
            }
        })
        .catch(api.err)
    }
    render() {
        let {selected : { keys }} = this.props;
        let { isFilter } = this.state;
        if (!keys) keys = []
        return (
            <div>
                <Row gutter={24}>
                    <Col lg={8} md={12} sm={16} xs={18}>
                        <ButtonGroup style={{marginRight:"8px"}}>
                        <Button   type="primary" icon="plus"  onClick={this.handleAdd}>
				          新增店铺
				        </Button>
                 <Button type="primary" icon="plus"  onClick={this.handleUpdateGoodsID}>
				          更改goodsID
				        </Button>
				        </ButtonGroup>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default StoreFilter