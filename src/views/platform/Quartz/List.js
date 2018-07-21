import React,{ Component } from 'react'
import { Tabs , Badge } from 'antd'
import { Link } from 'react-router'
import { Table } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'
const TabPane = Tabs.TabPane

class QuartzList extends Component {
    constructor(props){
        super(props)
        this.state = {}
    }

    handleTabChange = (key)=> {
        this.setState({state:key})
    }

    render(){
        let { data , onSelected } = this.props
        let { state = '1' } = this.state
        let newData = Object.assign({},data,{state})

        let fetchProps = {
            fetch: {
                url: '/pt/quartz',
                data: newData,
            },
            selection: {
                isOpen: true,
                onSelected,
            },
            columns: [
                { title: '调度器名称', dataIndex: 'SCHED_NAME'},
                { title: '触发器分组', dataIndex: 'TRIGGER_GROUP'},
                { title: '触发器名称', dataIndex: 'TRIGGER_NAME'},
                { title: '作业状态', dataIndex: 'TRIGGER_STATE'},
                { title: '作业描述', dataIndex: 'DESCRIPTION'},
                { title: '时间规则', dataIndex: 'CRON_EXPRESSION'},
                { title: '作业类', dataIndex: 'JOB_CLASS_NAME'},
            ]
        }
        return (
            <div>
                <Table
                	rowKey="TRIGGER_GROUP"
                    {...fetchProps}
                />
            </div>
        )
    }
}

QuartzList.defaultProps = {
    data:　{}
}

export default QuartzList