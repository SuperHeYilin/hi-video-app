import React,{ Component } from 'react'
import { Table } from '../../../components/Ui'

class UserList extends Component {
    render(){
        let { data , onSelected } = this.props;
        let fetchProps = {
            fetch: {
                url: '/module/client/users',
                data,
            },
            selection: {
                isOpen: true,
                onSelected,
            },
            columns: [
                // { title: '头像', dataIndex: 'avatar_url'},
                { title: '用户名', dataIndex: 'name'},
                { title: '手机号', dataIndex: 'phonenum' },
                { title: '支护宝账户', dataIndex: 'ali_account' },
                { title: '微信账户', dataIndex: 'wechat_account' },
                { title: '银行卡号', dataIndex: 'bank_card' },
                { title: '账户余额', dataIndex: 'balance' },
                { title: '注册时间', dataIndex: 'create_time', sorter: true },
                { title: '账号状态', dataIndex: 'state', render:(state)=>{
                    //0:正常 1:暂停 2:异常 3:停用
                    return ['正常','暂停','异常','停用'][state]
                }},
            ]
        }
        return (
            <Table
                {...fetchProps}
            />
        )
    }
}

UserList.defaultProps = {
    data:　{}
}

export default UserList