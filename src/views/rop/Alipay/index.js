import React, { Component } from 'react'
import { message } from 'antd'
import { Ibox , Button , Layer } from '../../../components/Ui'
import AlipayList from './List'
import { AlipayAccountForm } from './Info'
import { api } from '../../../utils'

import styles from './index.less'

class Alipay extends Component {

    constructor(props){
        super(props)
        this.state = {}
    }

    handleAdd = () => {
        let refForm
        Layer.open({
            title : "支付宝信息-新增",
            width : 860,
            content : <AlipayAccountForm ref={(form) => { refForm = form }}/>,
            onOk : (e)=>{
                refForm.validateFields((error, values) => {
                    if (error) {
                        return
                    }

                    api
                    .post("/alipay/accounts",{account: values})
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
            <Ibox className={styles['alipay-account']}>
                <Ibox.IboxTitle>
                    <Button type="primary" icon="plus" onClick={this.handleAdd}>新增</Button>
                </Ibox.IboxTitle>
                <AlipayList />
            </Ibox>
        )
    }
}

export default Alipay