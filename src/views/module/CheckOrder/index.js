import React, { Component } from 'react'
import { Ibox,Button } from '../../../components/Ui'
import { Spin,message } from 'antd'
import CheckOrderList from './List'
import CheckOrderFilter from './Filter'
import CheckOrderView from './View'
import styles from './Filter.less'
import {api, err as apierr} from '../../../utils'
class CheckOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
        	loading:false
        }
    }

	onRefresh = (loading)=>{
    	this.setState({loading: loading})
	}
    onFilter = (filterData,loading) => {
        this.setState({data: filterData})
    }
    // 获取列表选中项
    onSelected = (keys, rows) => {
        this.setState({keys, rows})
    }
	
	onRef=(ref)=>{
		this.child = ref
	}
	
	clearInput=()=>{
		this.child.onChange()
	}
	
	onSearch=()=>{
		this.child.onSearch()
	}
	onResetState=()=>{
		console.info(this.state.data.id)
		this.setState({data: null})
	}
	
	onCheckOrder=()=>{
		let {data} = this.state
		
		api.get("/module/order/validate/"+data.no)
	  .then((result) => {
	    if(result){
	    	message.success("取货成功")
	    	this.onResetState()
	    }else{
	    	 message.error("取货失败，请稍后重试!", 2)
	    }
    }).catch((err) => {
        api.err(err)
    })
	}
	
    render() {
        let { data, keys, rows ,loading} = this.state
        let onFilter = this.onFilter
        let clearInput = this.clearInput
        let onRefresh = this.onRefresh
        let onSearch = this.onSearch
        let CtEL = !data?null:( <Ibox.IboxContent className={styles.contentAnimation}>
								<CheckOrderView data={data} onSearch={onSearch} onRefresh={onRefresh} onFilter={onFilter} clearInput={clearInput}/>
								</Ibox.IboxContent>)
        
        let FilterEL = data?( <Ibox.IboxTitle style={{background:"transparent",textAlign:"center"}}>
								<Button onClick={()=>this.onResetState()} type="primary"  style={{width:"10%",backgroundColor:"#ec407a",borderColor:"#ec407a",marginRight:"10px"}}>返回</Button>
								<Button onClick={()=>this.onCheckOrder()} type="primary"  style={{width:"10%",backgroundColor:"#ec407a",borderColor:"#ec407a"}}>确认取货</Button>
								</Ibox.IboxTitle>)
        						:
        						( <Ibox.IboxTitle style={{background:"transparent"}}>
				                    <CheckOrderFilter onRef={this.onRef} onRefresh={this.onRefresh} onFilter={this.onFilter} selected={{keys, rows}} />
				                </Ibox.IboxTitle>)
        return (
        		<Spin spinning={loading}>
		            <Ibox>
		                {FilterEL}
		                {CtEL}
		            </Ibox>
	            </Spin>
        )
    }
}

export default CheckOrder