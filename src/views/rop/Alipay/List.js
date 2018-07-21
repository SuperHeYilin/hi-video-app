import React, { Component } from 'react'
import { Card , Row , Col , message , Modal , Select , Tag } from 'antd'
import { Button , Layer } from '../../../components/Ui'
import { api , copyboard } from '../../../utils'
import { AlipayAccountForm } from './Info'
import EditLimitTagGroup from './Limittag'

import styles from './index.less'

class AlipayList extends Component {

    constructor(props){
        super(props)
        this.state = {
        }
    }

    componentDidMount () {
        this.fetch()
    }

    componentWillReceiveProps(nextProps) {
        this.fetch()
    }

    handleCopyboard = text => {
        let success = copyboard(text, {
            debug: true,
            message: 'Press #{key} to copy',
        });
        success ? message.success('复制成功') : message.error('复制失败')
    }

    handleEdit = item => {
        let refForm
        Layer.open({
            title : "支付宝信息-编辑",
            width : 860,
            content : <AlipayAccountForm item={item} ref={(form) => { refForm = form}}/>,
            onOk : (e)=>{
                refForm.validateFields((error, values) => {
                    if (error) {
                        return;
                    }

                    api
                    .post("/alipay/accounts",{account: values})
                    .then((result)=>{
                        message.success("修改成功!")
                        this.fetch()
                        Layer.close()
                    })
                    .catch(api.err)
                })
            },
        })
    }

    handleLimit = item => {
        let { tags : limits = null } = item
        let tags = limits ? limits.split(",") : []
        Layer.open({
            title : "绑定支付金额-编辑",
            width : 550,
            content : <EditLimitTagGroup tags={tags} getTags={(newTags)=>{tags = newTags}} />,
            onOk : (e)=>{
                limits = null

                if(tags.length > 0) {
                    limits = tags.join(",")
                }
                api
                .post("/alipay/accounts/setlimits/"+item.id,{tags: limits})
                .then((result)=>{
                    message.success("设置成功!")
                    this.fetch()
                    Layer.close()
                })
                .catch(api.err)
            },
        })
    }

    handleDelete = id => {
        Modal.confirm({
            content: '确定要删除出吗?',
            onOk: () => {
                api
                .delete('/alipay/accounts/'+id)
                .then((result)=>{
                    this.fetch()
                })
                .catch((err)=>{
                    api.err(err)
                })
            },
            onCancel() {
            },
        })
    }

    renderBar = item => {
        return (
            <div>
                <Button size="small" icon="pay-circle-o" className={styles['bar']} onClick={()=>{this.handleLimit(item)}}>设置金额</Button>
                <Button size="small" icon="edit" className={styles['bar']} onClick={()=>{this.handleEdit(item)}}>编辑</Button>
                <Button type="danger" size="small" icon="delete" className={styles['bar']} onClick={()=>{this.handleDelete(item.id)}}>删除</Button>
            </div>
        )
    }

    renderLoop = ()=> {
        let { list = [] } = this.state

        return list.map((item,index)=>{
            let info = 
            <Col key={index} lg={8} md={12} sm={24} xs={24} style={{marginTop:5}}>
                <Card title={item.alipay_name ? item.alipay_name : " "} bordered={false} extra={this.renderBar(item)}>
                    <div className={styles['account-info']}><span className={styles['info-title']}>运行环境:</span><span className={styles['info-desc']} onClick={()=>{this.handleCopyboard(['正式','沙箱'][item.runtime*1])}}>{['正式','沙箱'][item.runtime*1]}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>标签:</span><span className={styles['info-desc']} onClick={()=>{this.handleCopyboard(item.tags)}}>{item.tags ? item.tags.replace(new RegExp(/(,)/g),'    ') : ""}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>appid:</span><span className={styles['info-desc']} onClick={()=>{this.handleCopyboard(item.app_id)}}>{item.app_id}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>商户id:</span><span className={styles['info-desc']} onClick={()=>{this.handleCopyboard(item.seller_id)}}>{item.seller_id}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>private_key:</span><span className={styles['info-desc']} onClick={()=>{this.handleCopyboard(item.app_private_key)}}>{item.app_private_key}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>public_key:</span><span className={styles['info-desc']} onClick={()=>{this.handleCopyboard(item.app_public_key)}}>{item.app_public_key}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>页面跳转路径:</span><span className={styles['info-desc']} onClick={()=>{this.handleCopyboard(item.return_url)}}>{item.return_url}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>通知回调路径:</span><span className={styles['info-desc']} onClick={()=>{this.handleCopyboard(item.notify_url)}}>{item.notify_url}</span></div>
                </Card>
            </Col>

            return info
        })
    }

    fetch = () => {
        api
        .get("/alipay/accounts")
        .then((result)=>{
            //alert(JSON.stringify(result.list))
            this.setState({
                list: result.list
            })
        })
        .catch(api.err)
    }

    render(){
        return (
            <Row gutter={24} className={styles.list}>
                {this.renderLoop()}
            </Row>
        )
    }
}

export default AlipayList