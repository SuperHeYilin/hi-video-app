import React,{ Component } from 'react'
import { 
    Row, 
    Col , 
    Card , 
    Input ,
    message,
    Modal,
    Select,
    Radio,
} from 'antd'
import Orderform from './OrderRefundForm'
import { Button } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'

const Search = Input.Search
const ButtonGroup = Button.Group
const confirm = Modal.confirm
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option

class OrderFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFilter : false
        }
    }
    //订单号及手机号查询
    onSearch = (value) => {
        let { onFilter } = this.props;
        onFilter({mobile:value});//value值以order_mobile传给父组件
    }
    //支付方式筛选查询
    onState = (value) => {
        let { onFilter } = this.props;
        onFilter({pay_type:value});//value值以order_mobile传给父组件
    }  

    //退款处理
    handleRefund = () =>{
        let {selected:{ keys,rows } , onFilter} = this.props; 
        // for(let i=0;i<rows.length;i++){
        //     if(rows[i].state !== '1'){
        //         confirm({            
        //             title: '订单中包含已退款订单，请重新选择！',
        //         });
        //         return
        //     }
        // }        
        //弹出一个模态框 
        // alert(rows[0].state+rows[0].name+keys)
        confirm({            
            title: '确定要退款吗?',
            onOk() {
                api
                .put("/module_order",{ids:keys.join(",")})
                .then((data) => {
                    message.success("退款成功!")
                    onFilter({refresh : keys})//传入一个刷新标记刷新table
                })
                .catch(apierr);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    
    handleStateChange = (e) => {
        let { onFilter } = this.props
        onFilter({state : e.target.value})//传入一个刷新标记刷新table
    }

    handleShowFilter = () => {
        let isFilter = !this.state.isFilter;
        this.setState({isFilter});
    }

    render() {
        let { onFilter } = this.props;
        let {selected : { keys }} = this.props;
        let { isFilter } = this.state;
        if (!keys) keys = []
        return (
            <div>
                <Row gutter={24}>
                    <Col lg={6} md={12} sm={16} xs={18}>
                        <RadioGroup onChange={this.handleStateChange} defaultValue="0">
                            <RadioButton value="0">可退款</RadioButton>
                            <RadioButton value="1">已全部退款</RadioButton>
                        </RadioGroup>
                    </Col>
                    <Col lg={{ offset: 8, span:10 }} md={12} sm={8} xs={0} style={{ textAlign: 'right' }}>
                    <Select style={{ width: '30%',marginRight:8 }} onChange={this.onState} placeholder="支付方式" >
                        <Option value="0,1,2">全部</Option>
                        <Option value="0">微信支付</Option>
                        <Option value="1">余额支付</Option>
                        <Option value="2">提货卡支付</Option>
                    </Select>                    
                        { !isFilter ? 
                        <Search
                            placeholder="订单编号/手机号"
                            style={{ width: 200 }}
                            onSearch={this.onSearch}
                        />
                        :
                        ""
                        }                        
                        <ButtonGroup style={{marginLeft : "5px"}}>
                            <Button type="dashed" icon="down" onClick={this.handleShowFilter}>筛选</Button>
                        </ButtonGroup>
                    </Col>
                    <Col lg={0} md={0} sm={0} xs={6} style={{ textAlign: 'right' }}>
                        <ButtonGroup>
                            <Button type="dashed" icon="filter" onClick={this.handleShowFilter}></Button>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Card style={{ marginTop: '10px' , display : isFilter ? "block" : "none"}}>        
                    <Orderform onSearch={onFilter} />    
                </Card>
            </div>
        )
    }
}

export default OrderFilter