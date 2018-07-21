import React,{ Component } from 'react'
import { Form , Card , Row , Col , Switch , Modal , message, Button } from 'antd'
import { Input } from '../../../components/Ui'
import { api , clearObjEmpty } from '../../../utils'
import lodash from 'lodash'

import styles from './index.less'

const { confirm } = Modal

class MenusInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    renderMenuBar = () => {
        let { menuItem } = this.props
        if(!menuItem) return ""

        return (
            <div>
                <Button type="danger" size="small" icon="delete" className={styles['menu-bar']} onClick={this.handleDelete}>删除</Button>
            </div>
        )
    }

    renderMeunForm = () => {
        let { menuItem , onRefresh } = this.props
        if(!menuItem) return ""
        return <WrappedMenuForm item={menuItem} onRefresh={onRefresh} />
    }

    handleDelete = () => {
        let { menuItem , onRefresh } = this.props
        if(menuItem && menuItem.id) {
            confirm({
                title: '确定要删除该项吗?',
                onOk() {
                    api.delete("/pt/menus/"+menuItem.id)
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
        let { menuItem } = this.props

        return (
            <Card title="菜单信息" loading={!menuItem} bordered={false} className={styles['menu-info']} extra={this.renderMenuBar()}>
                {this.renderMeunForm()}
            </Card>
        )
    }
}

const FormItem = Form.Item

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

            let method = "post"
            let { is_parent } = values
            if(values.id){
                method = "put"
            } 

            values = clearObjEmpty(values,['is_parent'],['menu_css','menu_icon'])

            api[method]("/pt/menus",{menu: values})
            .then((result)=>{
                message.success("保存成功!")
                values = typeof result === "object" ? result : values
                values.is_parent = is_parent
                onRefresh(values,[values.id+""])
            })
            .catch(api.err)
        });
    }

    render() {
        const { form , item = {} } = this.props;
        const { getFieldDecorator } = form;
        let { id="" , menu_icon="" , menu_name="" , menu_badge="" , menu_url="" , menu_css="" , p_menu="" , childs , is_parent} = item
        is_parent = is_parent ? is_parent : childs ? childs.length : 0

        return (
            <Form >
                <div style={{ display: "none" }}>
                    {getFieldDecorator('id', {
                        initialValue: id,
                    })(
                        <Input type="hidden"/>
                    )}
                    {getFieldDecorator('p_menu', {
                        initialValue: p_menu,
                    })(
                        <Input type="hidden"/>
                    )}
                    {getFieldDecorator('is_parent', {
                        initialValue: is_parent,
                    })(
                        <Input type="hidden"/>
                    )}
                </div>
                <Row gutter={24}>
                    <Col lg={12} md={24} sm={24} xs={24}>
                        <FormItem >
                            {getFieldDecorator('menu_name', {
                            initialValue: menu_name,
                            rules: [
                                { required: true, message: '请填写菜单名称' },
                            ],
                            })(
                            <Input 
                            hintText="请输入菜单名称"
                            floatingLabelText="菜单名"
                            required maxLength={12}
                            style={{ width: "80%" }}
                            />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} md={24} sm={24} xs={24}>
                        <FormItem colon={false} >
                            {getFieldDecorator('menu_css', {
                            initialValue: menu_css,
                            })(
                            <Input 
                            hintText="菜单样式"
                            floatingLabelText="菜单样式"
                            required maxLength={12}
                            style={{ width: "80%" }}
                            />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    {!is_parent ? 
                        <Col lg={12} md={24} sm={24} xs={24}>
                            <FormItem >
                                {getFieldDecorator('menu_url', {
                                initialValue: menu_url,
                                })(
                                <Input 
                                hintText="菜单路由"
                                floatingLabelText="菜单路由"
                                required maxLength={50}
                                style={{ width: "80%" }}
                                />
                                )}
                            </FormItem>
                        </Col>
                        :
                        ""
                    }
                </Row>
                <Row gutter={24}>   
                    <Col lg={12} md={24} sm={24} xs={24}>
                        <FormItem>
                            {getFieldDecorator('menu_icon',{
                            initialValue: menu_icon,
                            })(
                                <Input 
                                hintText="菜单图标"
                                floatingLabelText="菜单图标"
                                required maxLength={50}
                                style={{ width: "80%" }}
                                />
                            )}
                        </FormItem>
                    </Col>
                    <Col lg={12} md={24} sm={24} xs={24}>
                        <FormItem>
                            {getFieldDecorator('menu_badge', {
                            initialValue: menu_badge,
                            })(
                            <Input 
                            hintText="通知标记"
                            floatingLabelText="通知标记"
                            required maxLength={8}
                            style={{ width: "80%" }}
                            />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col lg={12} md={24} sm={24} xs={24}>
                        <FormItem label=" " colon={false} >
                            {getFieldDecorator('switch', { valuePropName: 'checked' })(
                                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                            )}
                        </FormItem> 
                    </Col>
                </Row>
                <Row gutter={24}> 
                    <Col span={8} offset={14} style={{textAlign:'center'}}>
                        <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                        <Button type="danger" onClick={()=>{this.props.form.resetFields()}} style={{ marginLeft: 16 }}>重置</Button>
                    </Col>
                </Row>
            </Form>

            
        )
    }
}

const WrappedMenuForm = Form.create()(MenuForm)

export default MenusInfo