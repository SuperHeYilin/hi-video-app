import React, {Component} from 'react'
import { Form,
         Input,
         Tooltip,
         Icon,
         Select,
         Row,
         Col,
         Button,
         AutoComplete,
         message,
         Progress,
        } from 'antd';
import { Ibox, PicturesWall } from '../../../components/Ui'
import { api } from '../../../utils'

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  },
};

// const residences = [{
//   value: '重庆市',
//   label: '重庆市',
//   children: [{
//     value: '江北区',
//     label: '江北区',
//     children: [{
//       value: '大石坝',
//       label: '大石坝',
//     },{
//       value: '观音桥',
//       label: '观音桥',
//     }],
//   },{
//     value: '渝北区',
//     label: '渝北区',
//     children: [{
//       value: '红旗河沟',
//       label: '红旗河沟',
//     }],
//   }],
// }, {
//   value: '四川省',
//   label: '四川省',
//   children: [{
//     value: '成都市',
//     label: '成都市',
//     children: [{
//       value: '武侯区',
//       label: '武侯区',
//     }],
//   }],
// }];

// const jingqu = [
//   { label: '景区', value: '1' },
//   { label: '旅行社', value: '2' },
//   { label: '其他', value: '3', disabled: false },
// ];

class InfoForm extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    data: [],
    completePercent: 0,
  };

  componentDidMount() {
    this.fetch()
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }
  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  // 验证电话
  checkPhone = (rule, value, callback) => {
    if (value) {
      const phone = /^0\d{2,3}-?\d{7,8}$/
      const mobile = /^1[3|5|8|7]\d{9}$/
      if (value.length <= 8) {
        callback('如果是座机请填写区号 例"023-55666888"')
        return
      }
      if (value.length > 11) {
        callback('电话位数不对')
        return
      }
      if (mobile.test(value) || phone.test(value)) {
        callback = () => {this.validateStatus = "success"}
      }
    }
    callback('电话格式不对！')
  }
  // 统计表单完成度
  countOk = (data) => {
    var count = 0
    var formTrue = 0
    var formFalse = 0
    for (const value of Object.values(data)) {
      if (value) {
        formTrue++
      } else {
        formFalse++
      }
      count++
    }
    this.setState({ completePercent: Math.trunc((formTrue * 100) / count) })
  }
  // 得到景区信息
  fetch =() => {
    const id = 1001
    api.get("/tn/scenic", {id})
    .then((data) => {
      // console.log(JSON.stringify(data))
      this.countOk(data)
      this.setState({
        data,
      })
    })
    .catch(api.err)
  }
  // 保存景区信息
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      // this.props.form.validateFieldsAndScroll获取form表单数据提给values
      if (!err) {
        // alert("提交" + JSON.stringify(values))
        api.put("/tn/scenic", {tnScenic: values})// 将表单数据values赋值给user，后台接收user
        .then((result) => {
          message.success("保存成功!")
          this.fetch()
        })
        .catch(api.err)
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data, autoCompleteResult } = this.state;
    const { id = "", img = "", scenic_name = "", scenic_addr = "", scenic_grade = "",
            scenic_phone = "", scenic_post = "", scenic_info = "", scenic_url = "" } = data
    // let { data } =this.props;//有父组件传值进入
  // const prefixSelector = getFieldDecorator('prefix', {
  //   initialValue: '86',
  // })(
  //   <Select style={{ width: 60 }}>
  //     <Option value="86">+86</Option>
  //     <Option value="87">+87</Option>
  //   </Select>
  // );

  // const websiteOptions = autoCompleteResult.map(website => (
  //   <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
  // ));

  return (
    <Ibox>
      <Ibox.IboxTitle>
        <Row gutter={8} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={{ span: 3, offset: 3 }}><span style={{ float: "right" }}>资料完成度：</span></Col>
          <Col xs={24} sm={{ span: 10 }}>
            <Progress percent={this.state.completePercent} />
          </Col>
        </Row>
        <Form onSubmit={this.handleSubmit}>
          <FormItem layout="vertical" >
              {getFieldDecorator('id', {
                initialValue: id, // 设置默认值
              })(
                <Input type="hidden" />
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="景区图像"
          >
            {getFieldDecorator('img', {
            initialValue: img,
            getValueFromEvent: (data) => {
                var names = ""
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
            //     { required: true, message: '请上传图片' },
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
          <FormItem
            {...formItemLayout}
            label="景区名称："
            hasFeedback
          >
            {getFieldDecorator('scenic_name', {
              initialValue: scenic_name, // 设置默认值
              rules: [{
                message: '请输入账户名称,不能为空!',
              }, 
              {
                required: true, message: '请输入景区名称!',
              }],
            })(
              <Input disabled={data.scenic_name ? true : false} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="景区地址"
            hasFeedback
          >
            {getFieldDecorator('scenic_addr', {
              initialValue: scenic_addr,
              rules: [{
                required: true, message: '请输入景区地址！',
              }],
            })(
              <Input />
            )}
          </FormItem>
          {/* <FormItem
            {...formItemLayout}
            label="公司类型："
          >
          {getFieldDecorator('company_type', {
            // initialValue: data[0].company_type,
          })(
              <RadioGroup options={jingqu} />
            )}
          </FormItem> */}
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                官方网址：&nbsp;
                <Tooltip title="请输入公司官方网址?">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            )}
            hasFeedback
          >
            {getFieldDecorator('uscenic_url', {
              initialValue: scenic_url, // 设置默认值
              rules: [{
                required: true, message: '请输入公司官方网址', whitespace: true,
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="景区等级："
          >
            {getFieldDecorator('scenic_grade', {
              initialValue: scenic_grade, // 设置默认值
              rules: [{ message: '请选择景区等级！' }],
            })(
              <Select>
                <Option value="aa">2A</Option>
                <Option value="aaa">3A</Option>
                <Option value="aaaa">4A</Option>
                <Option value="aaaaa">5A</Option>
              </Select>
            )}
          </FormItem>
          {/* <FormItem
            {...formItemLayout}
            label="公司地址："
          >
            {getFieldDecorator('address', {
              // initialValue: data.length > 0 ? data[0].address : '',//设置默认值
              rules: [{ required: true, message: '请输入公司地址' }],
            })(
              <AutoComplete
                dataSource={websiteOptions}
                onChange={this.handleWebsiteChange}
                placeholder="公司地址"
              >
                <Input />
              </AutoComplete>
            )}
          </FormItem> */}
          <FormItem
            {...formItemLayout}
            label="景区电话："
          >
            {getFieldDecorator('scenic_phone', {
              initialValue: scenic_phone,
              rules: [
                {
                  required: true, message: '请输入联系电话',
                },
                {
                pattern: /^0\d{2,3}-?\d{7,8}$|^1[3|5|8|7]\d{9}$/, message: '请输入正确的电话格式 座机请加区号',
                },
              // {
              //   validator: this.checkPhone,
              // }
            ],
            })(
              // <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
              <Input style={{ width: '100%' }} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="景区邮编"
            hasFeedback
          >
            {getFieldDecorator('scenic_post', {
              initialValue: scenic_post,
              rules: [
              // {
              //   required: true, message: '请输入景区邮编！',
              // },
              {
                pattern: /^[1-9][0-9]{5}$/, message: '邮编格式有误',
              },
              ],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="景区简介"
            extra="输入景区的相关介绍！"
          >
                {getFieldDecorator('scenic_info', {
                  initialValue: scenic_info,
                  rules: [
                  //   {
                  //   required: true, message: '请输入景区简介!'
                  // },
                  ],
                })(
                  <TextArea placeholder="对景区的信息进行简单的描述" autosize={{ minRows: 2, maxRows: 6 }} />
                )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" >保存</Button>
          </FormItem>
        </Form>
      </Ibox.IboxTitle>
    </Ibox>
  );
  }
}
const WrappedScenicInfoForm = Form.create()(InfoForm);

export default WrappedScenicInfoForm

