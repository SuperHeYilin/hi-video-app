import React, { Component } from 'react'
import { Ibox } from '../../../components/Ui'
import WechatUserFilter from './Filter'
import WechatUserList from './List'


class WechatUser extends Component {

    constructor(props){
        super(props)
        this.state = {}
    }

    onFilter = (filterData) => {
        this.setState({data: filterData})
    }

    //获取列表选中项
    onSelected = (keys,rows) => {
        this.setState({keys,rows})
    }

    render(){
        let { data , keys , rows} = this.state;

        return (
            <Ibox>
                <Ibox.IboxTitle>
                    <WechatUserFilter onFilter={ this.onFilter } selected={{keys,rows}} />
                </Ibox.IboxTitle>
                <Ibox.IboxContent>
                    <WechatUserList data={data} onSelected={this.onSelected} />
                </Ibox.IboxContent>
            </Ibox>
        )
    }
}

export default WechatUser