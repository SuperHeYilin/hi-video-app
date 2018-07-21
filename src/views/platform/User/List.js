import React,{ Component } from 'react'
import { Button } from 'antd'
import { Table } from '../../../components/Ui'

class UserList extends Component {
    constructor(props){
        super(props)
    }

    render() {
        let { data , onSelected } = this.props;
        let fetchProps = {
            fetch: {
                url: '/pt/users',
                data,
            },
            selection: {
                isOpen: true,
                onSelected,
            },
            columns: [
                // { title: '头像', dataIndex: 'avatar_url'},
                { title: '用户名', dataIndex: 'username'},
                { title: '邮箱', dataIndex: 'email' },
                { title: '手机号', dataIndex: 'mobile' , sorter : true},
                { title: '姓名', dataIndex: 'full_name' , sorter : true},
                { title: '年龄', dataIndex: 'age' },
                { title: '性别', dataIndex: 'sex' , render : (sex)=>{
                    return ['男','女'][sex]
                }},
                { title: 'openid', dataIndex: 'openid' },
                { title: '创建时间', dataIndex: 'created_at' },
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