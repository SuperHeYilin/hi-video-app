import React,{ Component } from 'react'
import { Form , Row , Col , Select , Input,Icon,Button } from 'antd';
import {Layer,PicturesWall} from '../../../components/Ui' 
import { api, err as apierr } from '../../../utils'
import StoreView from './View'

const FormItem = Form.Item
const StoreInfo = Form.create()(
  (props) => {
    const { form , item = {},point={} } = props
    const { getFieldDecorator , setFieldsValue } = form

    const fileprops = {
    }
    function inputOnChange(){
    	console.info("123123");
    }
    let {longitude,latitude} = item;
    if(point.lng){
      	longitude=point.lng;
      	latitude=point.lat;
    }
    return (
        <Form layout="vertical" >
          {getFieldDecorator('id', {
            initialValue: item.id,
          })(
            <Input type="hidden" />
          )}
            <Row gutter={24}>
            		<Col lg={8} md={8} sm={8} xs={8} >
                    <FormItem label="店铺名称">
                        {getFieldDecorator('name', {
                        initialValue: item.name,
                        rules: [
                            { required: true, message: '请输入店铺名称' },
                        ],
                        })(
                        <Input required />
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} sm={8} xs={8} >
                    <FormItem label="店铺地址">
                        {getFieldDecorator('address', {
                        initialValue: item.address,
                        rules: [
                            { required: true, message: '请输入店铺地址' },
                        ],
                        })(
                        <Input required />
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} sm={8} xs={8} >
                    <FormItem label="门店编码">
                        {getFieldDecorator('shop_id', {
                        initialValue: item.shop_id,
                        rules: [
                            { required: true, message: '请输入门店编码' },
                        ],
                        })(
                        <Input required />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col lg={4} md={4} sm={4} xs={4} >
                    <FormItem label="店铺图片">
                        {getFieldDecorator('img', {
                        initialValue: item.img,
                        getValueFromEvent:function(data){
                        	var names = "";
											  	for(var i in data){
											  		 if(data[i].nameid){
											  		 	names+=data[i].nameid+",";
											  		 }
											  	}
											  	if(names.length>0){
											  		names=names.substring(0,names.length-1);
											  	}
											  	return names;
                        },
                        rules: [
                            { required: true, message: '请上传图片' },
                        ],
                        })(
                        <PicturesWall {...fileprops}>
										      <div>
										        <Icon type="plus" />
										        <div className="ant-upload-text">上传图片</div>
										      </div>
										    </PicturesWall>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={24}>
            		<Col lg={6} md={6} sm={6} xs={6} >
                    <FormItem label="经度">
                        {getFieldDecorator('longitude', {
                        initialValue: longitude,
                        rules: [
                            { required: true, message: '请在地图上选择坐标' },
                        ],
                        })(
                        <Input required readOnly={true}/>
                        )}
                    </FormItem>
                </Col>
                <Col lg={6} md={6} sm={6} xs={6} >
                    <FormItem label="纬度">
                        {getFieldDecorator('latitude', {
                        initialValue: latitude,
                        rules: [
                            { required: true, message: '请在地图上选择坐标' },
                        ],
                        })(
                        <Input onChange={inputOnChange}  required readOnly={true}/>
                        )}
                    </FormItem>
                </Col>
                <Col lg={6} md={6} sm={6} xs={6} >
                    <FormItem label="店铺电话">
                        {getFieldDecorator('phone', {
                        initialValue: item.phone,
                        rules: [
                            { required: true, message: '请输入店铺电话' },
                        ],
                        })(
                        <Input required />
                        )}
                    </FormItem>
                </Col>
                <Col lg={6} md={6} sm={6} xs={6} >
                    <FormItem label="店铺描述">
                        {getFieldDecorator('text', {
                        initialValue: item.text,
                        })(
                        <Input />
                        )}
                    </FormItem>
                </Col>
            </Row>
            <StoreView form={form} item={item}/> 
        </Form>
    )
  }
)
export default StoreInfo