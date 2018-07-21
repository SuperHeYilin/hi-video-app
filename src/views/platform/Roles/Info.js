import React,{ Component } from 'react'
import { Form , Card , Row , Col , Switch , Modal , message } from 'antd'
import { Button , Input } from '../../../components/Ui'
import { api , clearObjEmpty } from '../../../utils'
import lodash from 'lodash'

import styles from './index.less'
import theme from '../../../components/Ui/Input/theme.less'

const { confirm } = Modal

class RoleInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    renderRoleBar = () => {
        let { roleItem } = this.props
        if(!roleItem) return ""

        return (
            <div>
                <Button type="danger" size="small" icon="delete" className={styles['role-bar']} onClick={this.handleDelete}>删除</Button>
            </div>
        )
    }

    handleDelete = () => {
        let { roleItem , onRefresh } = this.props
        if(roleItem && roleItem.id) {
            confirm({
                title: '确定要删除该项吗?',
                onOk() {
                    api.delete("/pt/roles/"+roleItem.id)
                    .then((data) => {
                        message.success("删除成功!")
                        onRefresh()
                    })
                    .catch(api.err);
                },
                onCancel() {
                    console.log('Cancel');
                },
            });
        } else {
            onRefresh()
        }
    }

    render() {
        let { roleItem , onRefresh } = this.props

        return (
            <Card title="角色信息" loading={!roleItem} bordered={false} className={styles['role-info']} extra={this.renderRoleBar()}>
                <WrappedMenuForm item={roleItem} onRefresh={onRefresh}/>
            </Card>
        )
    }
}


const FormItem = Form.Item;

class MenuForm extends Component {

    componentWillReceiveProps(nextProps) {
        const staticNextProps = lodash.cloneDeep(nextProps)
        const { item : staticNextItem } = staticNextProps
        const { item } = this.props
        
        if (!lodash.isEqual(staticNextItem , item)) {
            this.props.form.resetFields()
        }

        return true
    }

    handleSubmit = () => {
        let {　form : { validateFields } , onRefresh } = this.props

        validateFields((error, values) => {
            if (error) {
                return;
            }

            values = clearObjEmpty(values)
            console.log(JSON.stringify(values))
            api.post("/pt/roles",{role: values})
            .then((result)=>{
                message.success("保存成功!")
                onRefresh(result,[result.id+""])
            })
            .catch(api.err)
        });
    }

    render() {
        const { form , item = {} } = this.props;
        const { getFieldDecorator } = form;
        let { id="" , name="" , value="" , intro="" , pid="" } = item

        return (
            <Form >
                {getFieldDecorator('id', {
                    initialValue: id,
                })(
                    <Input type="hidden"/>
                )}
                {getFieldDecorator('pid', {
                    initialValue: pid,
                })(
                    <Input type="hidden"/>
                )}
                <Row gutter={24}>
                    <Col lg={12} md={24} sm={24} xs={24}>
                        <FormItem >
                            {getFieldDecorator('name', {
                            initialValue: name,
                            rules: [
                                { required: true, message: '请填写角色名称' },
                            ],
                            })(
                            <Input label="角色名称" theme={theme} required maxLength={12} />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} md={24} sm={24} xs={24}>
                        <FormItem colon={false} >
                            {getFieldDecorator('value', {
                            initialValue: value,
                            })(
                            <Input label="参数值" theme={theme} maxLength={12} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>   
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <FormItem>
                            {getFieldDecorator('intro',{
                            initialValue: intro,
                            })(
                            <Input label="角色简介" multiline theme={theme} maxLength={600} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}> 
                    <Col span={24} style={{textAlign:'center'}}>
                        <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                        <Button type="danger" onClick={()=>{this.props.form.resetFields()}}>重置</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const WrappedMenuForm = Form.create()(MenuForm)

export default RoleInfo