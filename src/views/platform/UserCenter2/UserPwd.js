import React, {Component} from 'react'
import { Form, Input, Button, message, Icon, Col, Progress, Row } from 'antd';
import { api, err as apierr, auth } from '../../../utils'
import { Ibox } from '../../../components/Ui'

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
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
      offset: 3,
    },
  },
};

class PwdForm extends Component {
  state = {
    confirmDirty: false,
    // autoCompleteResult: [],
    // data:[],
    inputType: 'password',
    status: 0, // 密码强度状态
  };
  // 显示密码操作
  handleShowPass = () => {
    // console.log("show")
    this.setState({ inputType: 'input' })
  }
  handleHiddenPass = () => {
    // console.log("hidden")
    this.setState({ inputType: 'password' })
  }
  // 验证密码强度 1强 -1中 0弱
   checkPasswdStrong = (string) => {
    if (string.length >= 6) {
    if (/[a-zA-Z]+/.test(string) && /[0-9]+/.test(string) && /\W+\D+/.test(string)) {
     this.setState({ status: 1 })
    } else if (/[a-zA-Z]+/.test(string) || /[0-9]+/.test(string) || /\W+\D+/.test(string)) {
     if (/[a-zA-Z]+/.test(string) && /[0-9]+/.test(string)) {
      this.setState({ status: -1 })
     } else if (/\[a-zA-Z]+/.test(string) && /\W+\D+/.test(string)) {
      this.setState({ status: -1 })
     } else if (/[0-9]+/.test(string) && /\W+\D+/.test(string)) {
      this.setState({ status: -1 })
     } else {
      this.setState({ status: 0 })
      return null
     }
    }
    } else {
      // console.log("no pass")
    }
   }

  handleSubmit = (e) => {
    e.preventDefault()
    const { history } = this.props
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log("提交"+JSON.stringify(values))
        api
        .put("tn/users/update/online/pwd", { oldpwd: values.oldpwd, newpwd: values.newpwd })
        .then((result) => {
          message.success("修改成功！", 1, () => {
            auth.logout()
            history.push("/auth/login")
          })
        })
        .catch(apierr)
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  // 验证密码强度
  checkPassword = (rule, value, callback) => {
    if (!value) {
      callback('密码不能为空')
      return
    }
    if (value.length < 6) {
      callback('密码长度不能小于6位')
      return
    }
    if (value.length >= 6) {
      this.checkPasswdStrong(value)
    }
    callback()
  }
  // 验证重复密码是否一致
  checkSamePassword = (rule, value, callback) => {
    const form = this.props.form;
    if (!value) {
      callback('密码不能为空')
      return
    }
    if (value.length < 6) {
      callback('密码长度不能小于6位')
      return
    }
    if (value.length >= 6 && value !== form.getFieldValue('newpwd')) {
      callback('两次输入的密码不一致，请重新输入！');
    }
    callback()
  }


  render() {
    const { inputType, status } = this.state
    const { getFieldDecorator } = this.props.form;
    // const { data } = this.props;
    let passwordPercent = 0
    let statusColor = "exception"
    let color = "red"
    if (status === 0) {
      passwordPercent = 33.3
    }
    if (status === -1) {
      passwordPercent = 66.6
      statusColor = "active"
      color = "#1890FF"
    }
    if (status === 1) {
      passwordPercent = 100
      statusColor = "success"
      color = "#52C41A"
    }
    return (
      <Ibox>
        <Ibox.IboxTitle>
          <Form >
            {/* <FormItem layout="vertical" >
                {getFieldDecorator('id', {
                  // initialValue: data[0].user_id,//设置默认值
                })(
                  <Input type="hidden" />
                )}
            </FormItem> */}
            <FormItem
              {...formItemLayout}
              label="当前密码："
              hasFeedback
            >
              {getFieldDecorator('oldpwd', {
                rules: [{
                  required: true, message: '错误!',
                }],
              })(
                <Input type="password" placeholder="请输入你的当前密码" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="新密码"
              // hasFeedback
            >
              {getFieldDecorator('newpwd', {
                rules: [
                  {
                  required: true, message: '请输入您的新密码!',
                },
                 {
                  validator: this.checkPassword,
                }],
              })(
                <Input
                type={inputType}
                placeholder="请输入你的新密码"
                suffix={
                  <Icon
                  type="eye-o"
                  onMouseDown={this.handleShowPass}
                  onMouseUp={this.handleHiddenPass}
                  />
                }
                />
              )}
            </FormItem>
              <Row>
                <Col sm={{ span: 8, offset: 3 }} xs={24} >
                  <Progress percent={passwordPercent} status={statusColor} showInfo={false} />
                  <Col sm={{ span: 5, offset: 3 }} xs={{ span: 5, offset: 3 }} ><span style={{ color: `${status === 0 ? color : 'black'}`}}>弱</span></Col>
                  <Col sm={{ span: 5, offset: 3 }} xs={{ span: 5, offset: 3 }}><span style={{ color: `${status === -1 ? color : 'black'}`}}>中</span></Col>
                  <Col sm={{ span: 5, offset: 3 }} xs={{ span: 5, offset: 3 }}><span style={{ color: `${status === 1 ? color : 'black'}`}}>强</span></Col>
                </Col>
              </Row>
            <FormItem
              {...formItemLayout}
              label="确认密码："
              hasFeedback
            >
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: '请确认您的新密码！',
                }, {
                  validator: this.checkSamePassword, // 验证两次密码
                }],
              })(
                <Input type="password" placeholder="请确认你的新密码" onBlur={this.handleConfirmBlur} />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={this.handleSubmit}>确认修改</Button>
            </FormItem>
          </Form>
        </Ibox.IboxTitle>
      </Ibox>
    );
  }
}

const WrappedRegistrationForm = Form.create()(PwdForm);

export default WrappedRegistrationForm