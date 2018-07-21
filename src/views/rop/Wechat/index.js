import React, { Component } from 'react'
import { message } from 'antd'
import { Ibox , Button , Layer } from '../../../components/Ui'
import WechatList from './List'
import { WechatAccountForm } from './Info'
import { api , clearObjEmpty } from '../../../utils'

import styles from './index.less'

class Wechat extends Component {

    constructor(props){
        super(props)
        this.state = {}
    }

    handleAdd = () => {
        let refForm
        Layer.open({
            title : "微信信息-新增",
            width : 860,
            content : <WechatAccountForm ref={(form) => { refForm = form}}/>,
            onOk : (e)=>{
                refForm.validateFields((error, values) => {
                    if (error) {
                        return;
                    }

                    api
                    .post("/wechat/accounts",{account: values})
                    .then((result)=>{
                        message.success("添加成功!")
                        Layer.close()
                        this.setState({})
                    })
                    .catch(api.err)
                })
            },
        })
    }

    render() {
        return (
            <Ibox className={styles['wechat-account']}>
                <Ibox.IboxTitle>
                    <Button type="primary" icon="plus" onClick={this.handleAdd}>新增</Button>
                </Ibox.IboxTitle>
                <WechatList />
            </Ibox>
        )
    }
}

export default Wechat