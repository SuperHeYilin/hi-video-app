import React,{ Component } from 'react'
import { Table } from '../../../components/Ui'

class WechatUserList extends Component {
    render(){
        let { data , onSelected } = this.props;
        let fetchProps = {
            fetch: {
                url: '/wechat/users',
                data,
            },
            selection: {
                isOpen: true,
                onSelected,
            },
            columns: [
                // { title: '头像', dataIndex: 'avatar_url'},
                { title: '用户头像', dataIndex: 'headimgurl',render:(headimgurl)=>{
                    //0:正常 1:暂停 2:异常 3:停用
                    return <img  src={headimgurl} width="50" height="50"/>
                }},
                { title: '用户名ID', dataIndex: 'user'},
                { title: '用户的唯一标识', dataIndex: 'openid' },
                { title: '用户昵称', dataIndex: 'nickname' },
                { title: '性别', dataIndex: 'sex',render:(sex)=>{
                    //0:正常 1:暂停 2:异常 3:停用
                    return ['未知','男','女'][sex]
                }},
                { title: '国家', dataIndex: 'country'},
                { title: '省份', dataIndex: 'province' },
                { title: '城市', dataIndex: 'city' },
               
            ]
        }
        return (
            <Table
                {...fetchProps}
            />
        )
    }
}

WechatUserList.defaultProps = {
    data:　{}
}

export default WechatUserList