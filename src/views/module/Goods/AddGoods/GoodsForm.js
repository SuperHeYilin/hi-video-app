import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Icon, message, Select, Row, Col, InputNumber, Button, AutoComplete } from 'antd'
import { PicturesWall, Beditor } from '../../../../components/Ui'
import { api, err as apierr } from '../../../../utils'

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
}
const priceLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
}
const nameLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
}

class AddGoods extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    const { history, data = {} } = this.props
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { long = 0, wide = 0, high = 0, src, src1, classType } = values
        // 拼装体积
        const Size = long + "," + wide + "," + high
        // 分类
        const [class_a = -1, class_b = -1, class_c = -1] = classType
        // 添加
        if (data.id === -1 || data.id === 0) {
          // 添加商品
          delete values.id
          api
            .post("/pt/goods/add", { goods: { ...values, Size }, src, src1, class_a, class_b, class_c })
            .then((result) => {
              if (result) {
                message.success("添加成功！", 1, () => {
                  history.push("/module/goods")
                })
              }
            })
            .catch(apierr)
        } else {
          // 更新商品
          api
            .put("/pt/goods/update", { goods: { ...values, Size }, src, src1, class_a, class_b, class_c })
            .then((result) => {
              if (result) {
                message.success("更新成功！", 1, () => {
                  history.push("/module/goods")
                })
              }
            })
            .catch(apierr)
        }
      }
    });
  }
  // 清空
  handleReset = () => {
    this.props.form.resetFields();
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { data = {}, classType } = this.props
    const { Size = "0,0,0", class_a, class_b, class_c } = data
    const array = Size.split(",")
    const newClassType = [class_a, class_b, class_c]

    if (data.id === 0) return null
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          {getFieldDecorator('id', {
            initialValue: data.id,
          })(
            <Input hidden />
          )}
          <Card title="商品信息">
            <FormItem
              {...nameLayout}
              label="商品分类"
            >
              {getFieldDecorator('classType', {
                initialValue: newClassType,
                rules: [{ type: 'array', required: true, message: '请选择分类!' }],
              })(
                <Cascader options={classType} placeholder="商品分类" />
              )}
            </FormItem>
            <FormItem
              {...nameLayout}
              label="商品名称"
            >
              {getFieldDecorator('Name', {
                initialValue: data.Name,
                rules: [{
                  type: 'string', message: '请输入合法文本',
                }, {
                  required: true, message: '请输入商品名称',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...nameLayout}
              label="商品编码"
            >
              {getFieldDecorator('GoodsID', {
                initialValue: data.GoodsID,
                rules: [{
                  required: true, message: '请输入商品编码!',
                }],
              })(
                <InputNumber min={0} max={2100000000} style={{ width: 150 }} />
              )}
            </FormItem>
            <FormItem
              {...nameLayout}
              label="商品SKU"
            >
              {getFieldDecorator('SKU', {
                initialValue: data.SKU,
                // rules: [{
                //   required: true, message: '请输入商品条形码!',
                // }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...nameLayout}
              label="商品条形码"
            >
              {getFieldDecorator('BarcodeID', {
                initialValue: data.BarcodeID,
                rules: [{
                  required: true, message: '请输入商品条形码!',
                }],
              })(
                <Input />
              )}
            </FormItem>
          </Card>
          <Card title="商品描述">
            <FormItem
              {...formItemLayout}
              label="规格"
              extra="示例 规格(12oz,16个)、计量(杯,盒)"
            >
              <Row gutter={8}>
                <Col span={9}>
                  {getFieldDecorator('Spec', {
                    initialValue: data.Spec,
                  })(
                    <Input />
                  )}
                </Col>
                <Col span={3}>
                  <span>计量单位: </span>
                </Col>
                <Col span={10}>
                  {getFieldDecorator('UnitName', {
                    initialValue: data.UnitName,
                  })(
                    <Input />
                  )}
                </Col>
              </Row>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌"
            >
              <Row gutter={8}>
                <Col span={10}>
                  {getFieldDecorator('brand', {
                    initialValue: data.brand,
                  })(
                    <Input />
                  )}
                </Col>
                <Col span={2}>
                  <span>产地: </span>
                </Col>
                <Col span={10}>
                  {getFieldDecorator('Origin', {
                    initialValue: data.Origin,
                  })(
                    <Input />
                  )}
                </Col>
              </Row>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="重量"
              extra="示例 重量(500,1)、单位(k,kg)"
            >
              <Row gutter={8}>
                <Col span={10}>
                  {getFieldDecorator('weight', {
                    initialValue: data.weight,
                  })(
                    <Input />
                  )}
                </Col>
                <Col span={2}>
                  <span>单位: </span>
                </Col>
                <Col span={10}>
                  {getFieldDecorator('weightunit', {
                    initialValue: data.weightunit,
                  })(
                    <Input />
                  )}
                </Col>
              </Row>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="体积"
              extra="按照  长、宽、高 单位 cm  如：100, 200, 45"
            >
              <Row gutter={8}>
                <Col span={6}>
                  <span>长：</span>
                  {/* <InputNumber onChange={(value) => this.onSizeChange(value, "long")} /> */}
                  {getFieldDecorator('long', {
                    initialValue: array[0],
                  })(
                    <InputNumber />
                  )}
                </Col>
                <Col span={6}>
                  <span>宽：</span>
                  {/* <InputNumber onChange={(value) => this.onSizeChange(value, "wide")} /> */}
                  {getFieldDecorator('wide', {
                    initialValue: array[1],
                  })(
                    <InputNumber />
                  )}
                </Col>
                <Col span={6}>
                  <span>高：</span>
                  {/* <InputNumber onChange={(value) => this.onSizeChange(value, "high")} /> */}
                  {getFieldDecorator('high', {
                    initialValue: array[2],
                  })(
                    <InputNumber />
                  )}
                </Col>
              </Row>
            </FormItem>
          </Card>
          <Card title="商品价格">
            <FormItem
              {...priceLayout}
              label="成本价"
            >
              {getFieldDecorator('costPrice', {
                initialValue: data.costPrice,
                rules: [{
                  required: true, message: '请输入合法数字',
                }],
              })(
                <InputNumber style={{ width: 200 }} />
              )}
            </FormItem>
            <FormItem
              {...priceLayout}
              label="市场参考价"
            >
              {getFieldDecorator('RefPrice', {
                initialValue: data.RefPrice,
              })(
                <InputNumber style={{ width: 200 }} />
              )}
            </FormItem>
            <FormItem
              {...priceLayout}
              label="活动价"
            >
              {getFieldDecorator('activity_price', {
                initialValue: data.activity_price,
              })(
                <InputNumber style={{ width: 200 }} />
              )}
            </FormItem>
            <FormItem
              {...priceLayout}
              label="销售价格"
            >
              {getFieldDecorator('promPrice', {
                initialValue: data.promPrice,
                rules: [{
                  required: true, message: '请输入合法数字',
                }],
              })(
                <InputNumber style={{ width: 200 }} />
              )}
            </FormItem>
            <FormItem
              {...priceLayout}
              label="会员价格"
            >
              {getFieldDecorator('vip_price', {
                initialValue: data.vip_price,
                rules: [{
                  required: true, message: '请输入合法数字',
                }],
              })(
                <InputNumber style={{ width: 200 }} />
              )}
            </FormItem>
          </Card>
          <Card title="其他">
            <FormItem {...formItemLayout} label="商品图片">
              {getFieldDecorator('src', {
                initialValue: data.src,
                getValueFromEvent: (data) => {
                  let names = ""
                  for (const i in data) {
                    if (data[i].nameid) {
                      names += data[i].nameid + ",";
                    }
                  }
                  if (names.length > 0) {
                    names = names.substring(0, names.length - 1);
                  }
                  return names
                },
                // rules: [
                //   { required: true, message: '请上传图片' },
                // ],
              })(
                <PicturesWall>
                  <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">上传图片</div>
                  </div>
                </PicturesWall>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="其他图片(最多5张)">
              {getFieldDecorator('src1', {
                initialValue: data.src1,
                getValueFromEvent: (data) => {
                  let names = ""
                  for (const i in data) {
                    if (data[i].nameid) {
                      names += data[i].nameid + ",";
                    }
                  }
                  if (names.length > 0) {
                    names = names.substring(0, names.length - 1);
                  }
                  return names
                },
                // rules: [
                //   { required: true, message: '请上传图片' },
                // ],
              })(
                <PicturesWall length="5">
                  <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">上传图片</div>
                  </div>
                </PicturesWall>
              )}
            </FormItem>
          </Card>
          <Card title="详情编辑">
            <FormItem>
              {getFieldDecorator('info', {
                initialValue: data.info || "",
              })(
                <Beditor autoSave={false} fullScreen={true} />
              )}
            </FormItem>
          </Card>
          <FormItem {...tailFormItemLayout} >
            <Button type="primary" htmlType="submit">提交</Button>
            <Button style={{ marginLeft: 24 }} onClick={this.handleReset}>
              还原
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

const AddGoodsFrom = Form.create()(AddGoods)
export default AddGoodsFrom
