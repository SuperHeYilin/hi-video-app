import React from 'react'
import classnames from 'classnames'
import { Row, Col, Card, Icon, Button, Input, Form, Tooltip, message, Radio, InputNumber, Modal } from 'antd'
import { PicturesWall } from '../../../components/Ui'
import { api } from '../../../utils'
import styles from './UserDetailInfo.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { TextArea } = Input
const defaultAvatar = require('../../../public/imgs/defaultAvatar.jpg')

class Profile extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      // personData: {},
      // confirmDirty: false,
      // autoCompleteResult: [],
      visible: false,
    }
  }

  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("保存数据：", values);
        // const { id, pid, nickname, phonenum, email, realname, company, education, city, hobby, sex, age, avatar } = values
        // const user = { id, nickname, phonenum, email, realname }
        // const person = { id: pid, company, education, city, hobby, sex, age, avatar }
        // console.log(JSON.stringify(person))
        // 保存person
        // api
        // .put("tn/users/person", { person })
        // .catch(err)
        api
        .put("/pt/users", { user: values })
        .then((result) => {
          message.success("修改成功！", 1, () => {
            this.props.handleUpdate()
          })
        })
        .catch(err)
      }
    })
  }
  // 重置
  handleReset = () => {
    this.props.form.resetFields();
  }

  // 模态框
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  handleOk = () => {
    this.props.form.validateFields(['avatar', 'pid'], (err, values) => {
      // console.log("图片信息： " + JSON.stringify(values))
        api
        .put("/pt/users", { user: values })
        .then((result) => {
            message.success("修改成功！", 0.5, () => {
            this.props.handleUpdate()
          })
        })
        .catch(err)
    });
    this.setState({
      visible: false,
    })
  }
  // handleWebsiteChange = (value) => {
  //   let autoCompleteResult;
  //   if (!value) {
  //     autoCompleteResult = [];
  //   } else {
  //     autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
  //   }
  //   this.setState({ autoCompleteResult });
  // }

  render () {
    const { getFieldDecorator } = this.props.form
    const { visible } = this.state
    const { userData, avatar, onImgErr } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }
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
    }

    // const prefixSelector = getFieldDecorator('prefix', {
    //   initialValue: '86'
    // })(
    //   <Select style={{ width: 60 }}>
    //     <Option value='86'>+86</Option>
    //     <Option value='87'>+87</Option>
    //   </Select>
    // )

    // const websiteOptions = autoCompleteResult.map(website => (
    //   <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    // ))

    return (
      <div>
        <Row className={styles.showcase}>
          <Col xs={24} sm={24} md={12} lg={15} xl={15}>
            <Card
              bordered={false}
              hoverable
              title={
                <div className={classnames(styles['card-header'], { [styles.pink]: true})}>
                  <h4><Icon type="user" /></h4>
                </div>
              }
            >
            <Form onSubmit={this.handleSubmit}>
              {getFieldDecorator('id', {
                initialValue: userData.id,
              })(
                <Input type="hidden" />
              )}
              {/* {getFieldDecorator('pid', {
                initialValue: userData.person.id,
              })(
                <Input type="hidden" />
              )} */}
                <FormItem
                  {...formItemLayout}
                  label="真实姓名"
                >
                  {getFieldDecorator('full_name', {
                    initialValue: userData.full_name,
                    rules: [{ required: true, message: '请填写您的真实姓名!', whitespace: true }],
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={(
                    <span>
                      登录账户名&nbsp;
                      <Tooltip title="可用于登录账号">
                        <Icon type="question-circle-o" />
                      </Tooltip>
                    </span>
                  )}
                >
                  {getFieldDecorator('username', {
                    initialValue: userData.username,
                    rules: [
                      { required: true, message: '请填写您的账户名!', whitespace: true },
                      {
                        pattern: /^[a-zA-Z0-9_]{4,16}$/, message: '请输入4-16位字母(区分大小写)、数字、下划线',
                      },
                    ],
                  })(
                    <Input />
                  )}
                </FormItem>
                <Row>
                  <Col md={{ span: 24 }} lg={{ offset: 6, span: 8 }} >
                    <FormItem
                      {...formItemLayout}
                      label="性别"
                    >
                      {getFieldDecorator('sex', {
                        initialValue: userData.sex,
                        // rules: [{ required: true, message: '请填写您的真实姓名!' }]
                      })(
                        <RadioGroup>
                          <Radio value="0">男</Radio>
                          <Radio value="1">女</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                  </Col>
                <Col md={{ span: 24 }} lg={{ span: 10 }} >
                  <FormItem
                    {...formItemLayout}
                    label="年龄"
                  >
                    {getFieldDecorator('age', {
                      initialValue: userData.age,
                    })(
                      <InputNumber min={1} max={150} />
                    )}
                    <span> 岁</span>
                  </FormItem>
                </Col>
                </Row>
                <FormItem
                  {...formItemLayout}
                  // label={(
                  //   <span>
                  //     手机号码&nbsp;
                  //     <Tooltip title="手机号可用于登录账号">
                  //       <Icon type="question-circle-o" />
                  //     </Tooltip>
                  //   </span>
                  // )}
                  label="手机号"
                >
                  {getFieldDecorator('mobile', {
                    initialValue: userData.mobile,
                    rules: [
                      {
                      required: true, message: '请填写您的手机号码!',
                      },
                      {
                        pattern: /^1[3|5|8|7]\d{9}$/, message: '请输入正确的手机格式',
                      },
                    ],
                  })(
                    <Input style={{ width: '100%' }} />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="电子邮件"
                >
                  {getFieldDecorator('email', {
                    initialValue: userData.email,
                    rules: [{
                      type: 'email', message: '格式错误！',
                    }, {
                      required: true, message: '请填写您的电子邮件',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
                {/* <FormItem
                  {...formItemLayout}
                  label="所属公司"
                >
                  {getFieldDecorator('company', {
                    initialValue: userData.person.company,
                    rules: [
                    {
                      required: true, message: '请填写你的所属公司!',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem> */}
                {/* <FormItem
                  {...formItemLayout}
                  label="教育程度"
                >
                  {getFieldDecorator('education', {
                    initialValue: userData.person.education,
                  //   rules: [
                  //   {
                  //     required: true, message: 'Please input your E-mail!'
                  //   }
                  // ]
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="住址"
                >
                  {getFieldDecorator('city', {
                    initialValue: userData.person.city,
                    // rules: [
                    // {
                    //   type: 'email', message: 'The input is not valid E-mail!'
                    // }, {
                    //   required: true, message: 'Please input your E-mail!'
                    // }]
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="爱好"
                >
                  {getFieldDecorator('hobby', {
                    initialValue: userData.person.hobby,
                    // rules: [{ required: true, message: 'Please input website!' }]
                  })(
                    <TextArea placeholder="请输入您的爱好" autosize={{ minRows: 1, maxRows: 3 }} />
                  )}
                </FormItem> */}
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">更新</Button>
                  {' '}
                  <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    还原
                  </Button>
                </FormItem>
            </Form>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={1} lg={1} xl={1} style={{ marginTop: 60 }} />
          <Col xs={24} sm={24} md={11} lg={8} xl={8}>
            <Card
              bordered={false}
              hoverable
              title={
              <div className={styles['card-avatar']}>
                <a><img className={styles.img} src={defaultAvatar} onError={onImgErr} alt="头像" /></a>
              </div>
              }
            >
              <div className={styles['card-content']}>
                <h6>{`${userData.username}`}</h6>
                <h4>{userData.full_name}</h4>
                <p>
                  {userData.mobile}
                </p>
                <a>
                  <Button type="primary" onClick={() => this.props.handleChangeTab("3")}>更换密码</Button>
                </a>
              </div>
            </Card>
          </Col>
        </Row>
        <Modal title="头像"
          visible={visible}
          onOk={this.handleOk}
          // confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <FormItem label="头像">
            {getFieldDecorator('avatar', {
            // initialValue: userData.person.avatar,
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
        </Modal>
      </div>
    )
  }
}

const UserDeatilInfo = Form.create()(Profile)

export default UserDeatilInfo;