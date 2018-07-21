import React, { Component } from 'react';
import {
    Form,
    Row,
    Col,
    Select,
    Button,
    Input,
    DatePicker,
}
from 'antd';
import { api,} from '../../../utils'
const FormItem=Form.Item;
const { Option } = Select;
const RangePicker = DatePicker.RangePicker;


class TableList extends Component {
    constructor(props){
        super(props)
        this.state = {
            expandForm: false, 
            store:[],  
        }
    }

    componentWillMount(){
      this.requestStore()
    }

   //获取所有的门店
    requestStore = ()=>{
      api
      .get("/pt/store/name")
      .then((result)=>{
          this.setState({store : result})
      })
      .catch(api.err)
  }

    handleFormReset = (e) => {
        this.props.form.resetFields();
    }

    toggleForm = () => {
        this.setState({
          expandForm: !this.state.expandForm,
        });
      }
      
    handleSearch = (e) => {
       let { onSearch } = this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            // if(values.create_time && values.create_time1){
            //   alert(values.create_time)
            //   values.create_time = values.create_time.format("YYYY-MM-DD 00:00:00")//单个时间组件值格式调整
            //   values.create_time1 = values.create_time1.format("YYYY-MM-DD 23:59:59") 
            // }
            let t = {...values,'create_time':["",""],'pay_time':["",""]};//创建t对象接管values对时间选择组件值进行处理
            if(values.pay_time){
              const payValue = values['pay_time'];
               t={
                ...values,
                'create_time':["",""],
                'pay_time': [payValue[0].format('YYYY-MM-DD 00:00:00'), payValue[1].format('YYYY-MM-DD 23:59:59')],
              };
            }
            if(values.create_time){
              const rangeValue = values['create_time'];
               t={
                ...values,                
                'create_time': [rangeValue[0].format('YYYY-MM-DD 00:00:00'), rangeValue[1].format('YYYY-MM-DD 23:59:59')],
                'pay_time':["",""],
              };
            }
            if(values.create_time && values.pay_time){
              const rangeValue = values['create_time'];
              const payValue = values['pay_time'];
               t={
                ...values,
                'create_time': [rangeValue[0].format('YYYY-MM-DD 00:00:00'), rangeValue[1].format('YYYY-MM-DD 23:59:59')],
                'pay_time':[payValue[0].format('YYYY-MM-DD 00:00:00'), payValue[1].format('YYYY-MM-DD 23:59:59')],
              };
            }
            
              onSearch({
                mobile:t.mobile,
                store:t.store,
                create_time:t.create_time[0],
                create_time1:t.create_time[1],
                pay_time:t.pay_time[0],
                pay_time1:t.pay_time[1],
                pay_type:t.pay_type,
              })
                        
            //直接请求封装请求参数            
          }
        });
        
    }      

    renderAdvancedForm(){
        const { getFieldDecorator } = this.props.form; 
        return (
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="结账日期">
                  <Col span={2} md={24}>
                    <FormItem>
                      {getFieldDecorator('pay_time')(
                        <RangePicker style={{ width: 200 }} placeholder="起止日期" />
                      )}
                      </FormItem>
                  </Col>
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="订单号/手机号：">
                  {getFieldDecorator('mobile')(
                    <Input placeholder="请输入订单号/手机号" style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>              
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{margin:8}}>
              <Col md={8} sm={24}>
              <FormItem label="创建日期">
                <Col span={2} md={24}>
                  <FormItem>
                    {getFieldDecorator('create_time')(
                      <RangePicker style={{ width: 200 }} placeholder="起止日期" />
                    )}
                    </FormItem>
                </Col>
              </FormItem>
              </Col>              
              <Col md={8} sm={24}>
                <FormItem label="支付方式">
                  {getFieldDecorator('pay_type', {
                        initialValue:"请选择",//设置默认值
                    })(
                    <Select style={{ width: 150 }}>
                      <Option value="0,1,2">全部</Option>
                      <Option value="0">微信支付</Option>
                      <Option value="1">余额支付</Option>
                      <Option value="2">提货卡支付</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 80 }} onClick={this.handleFormReset}>重置</Button>   
              </Col>
            </Row>
          </Form>
        );
    }   
    
    render(){
        return(
            this.renderAdvancedForm()
        )
    }
}
const TableListForm = Form.create()(TableList);

export default TableListForm