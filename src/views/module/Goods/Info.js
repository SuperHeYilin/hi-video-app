import React,{ Component } from 'react'
import { Form , Row , Col , Select , Input,Icon } from 'antd';
import { PicturesWall , Editor } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'

const FormItem = Form.Item
const GoodsImage = Form.create()(
  (props) => {
    const { form , item = {} } = props
    const { getFieldDecorator } = form
    const fileprops = {
    }
    return (
        <Form layout="vertical" >
          {getFieldDecorator('id', {
            initialValue: item.id,
          })(
            <Input type="hidden" />
          )}
            <Row gutter={24}>
            		<Col lg={24} md={24} sm={24} xs={24} >
                    <FormItem label="封面图片">
                        {getFieldDecorator('name', {
                        initialValue: item.src,
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
                            { required: true, message: '请上传封面图片' },
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
            		<Col lg={24} md={24} sm={24} xs={24} >
                    <FormItem label="其他图片(最多5张)">
                        {getFieldDecorator('name1', {
                        initialValue: item.src1,
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
                        })(
                        <PicturesWall {...fileprops} length="5">
										      <div>
										        <Icon type="plus" />
										        <div className="ant-upload-text">上传图片</div>
										      </div>
										    </PicturesWall>
                        )}
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
  }
)
export default GoodsImage