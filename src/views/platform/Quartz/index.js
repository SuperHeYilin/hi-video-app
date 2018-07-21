import React, { Component } from 'react'
import { Layout , Row , Col } from 'antd'
import { Ibox } from '../../../components/Ui'
import QuartzList from './List'
import QuartzFilter from './Filter'

class Quartz extends Component {

    constructor(props){
        super(props)
        this.state = {}
    }

    onFilter = (filterData) => {
//      alert("传输查询数据"+JSON.stringify(filterData))
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
                    <QuartzFilter onFilter={ this.onFilter } selected={{keys,rows}}/>
                </Ibox.IboxTitle>
                <Ibox.IboxContent>
                    <QuartzList data={data} onSelected={this.onSelected}/>
                </Ibox.IboxContent>
            </Ibox>
        )
    }
}

export default Quartz