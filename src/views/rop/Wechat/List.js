import React, { Component } from 'react'
import { Card , Row , Col , message , Modal } from 'antd'
import { Button , Layer } from '../../../components/Ui'
import { api , copyboard } from '../../../utils'
import { WechatAccountForm } from './Info'
import EditLimitTagGroup from './Limittag'

import styles from './index.less'

class WechatList extends Component {

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
            title : "微信信息-编辑",
            width : 860,
            content : <WechatAccountForm item={item} ref={(form) => { refForm = form}}/>,
            onOk : (e)=>{
                refForm.validateFields((error, values) => {
                    if (error) {
                        return;
                    }

                    api
                    .post("/wechat/accounts",{account: values})
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
                .post("/wechat/accounts/setlimits/"+item.id,{tags: limits})
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
                .delete('/wechat/accounts/'+id)
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
                <Button size="small" icon="edit" className={styles['bar']} onClick={this.handleEdit.bind(this,item)}>编辑</Button>
                <Button type="danger" size="small" icon="delete" className={styles['bar']} onClick={this.handleDelete.bind(this,item.id)}>删除</Button>
            </div>
        )
    }

    renderLoop = ()=> {
        let { list = [] } = this.state

        return list.map((item,index)=>{
            let info = 
            <Col key={index} lg={8} md={12} sm={24} xs={24} style={{marginTop:5}}>
                <Card title={item.wechat_name ? item.wechat_name : " "} bordered={false} extra={this.renderBar(item)}>
                    <div className={styles['account-info']}><span className={styles['info-title']}>微信号:</span><span className={styles['info-desc']} onClick={this.handleCopyboard.bind(this,item.wechat_number)}>{item.wechat_number}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>标签:</span><span className={styles['info-desc']} onClick={()=>{this.handleCopyboard(item.tags)}}>{item.tags ? item.tags.replace(new RegExp(/(,)/g),'    ') : ""}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>appid:</span><span className={styles['info-desc']} onClick={this.handleCopyboard.bind(this,item.app_id)}>{item.app_id}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>appsecret:</span><span className={styles['info-desc']} onClick={this.handleCopyboard.bind(this,item.app_secret)}>{item.app_secret}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>token:</span><span className={styles['info-desc']} onClick={this.handleCopyboard.bind(this,item.token)}>{item.token}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>账号类型:</span><span className={styles['info-desc']} onClick={this.handleCopyboard.bind(this,['服务号','订阅号','企业号','小程序'][item.type|0])}>{['服务号','订阅号','企业号','小程序'][item.type|0]}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>encodingAesKey:</span><span className={styles['info-desc']} onClick={this.handleCopyboard.bind(this,item.encodingAesKey)}>{item.encodingAesKey}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>partner_key:</span><span className={styles['info-desc']} onClick={this.handleCopyboard.bind(this,item.partner_key)}>{item.partner_key}</span></div>
                    <div className={styles['account-info']}><span className={styles['info-title']}>mch_id:</span><span className={styles['info-desc']} onClick={this.handleCopyboard.bind(this,item.mch_id)}>{item.mch_id}</span></div>
                </Card>
            </Col>

            return info
        })
    }

    fetch = () => {
        api
        .get("/wechat/accounts")
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

export default WechatList