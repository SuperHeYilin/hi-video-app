import React, { Component } from 'react'
import { Button, Popconfirm, message } from 'antd';
import { Table } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'

class CheckOrderList extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    handleTabChange = (key) => {
        this.setState({state: key })
    }
    handleTakeTicket=(type, item) => {
        let { onFilter } = this.props
        // let purl = type + "/" + item.id
        api.put("/tickets/details/get/tickets", {id: item.id}).then((data) => {
            if (data) {
                message.success("操作成功!")
                onFilter({d: new Date()})
            } else {
                message.error("操作失败,请稍后重试！")
            }
        })
    }
    render() {
        let { data, onSelected } = this.props
        let newData = Object.assign({}, data)

        let fetchProps = {
            fetch: {
                url: '/ticket/order',
                data: newData,
            },
            selection: {
                onSelected,
            },
            columns: [
                { title: '订单编号', dataIndex: 'order_number'},
                { title: '产品名称', dataIndex: 'user'},
                { title: '票码', dataIndex: 'create_time'},
                { title: '售价', dataIndex: 'price'},
                { title: '手机号码', dataIndex: 'iphone'},
                { title: '下单时间', dataIndex: 'create_time'},
                { title: '收款方式', dataIndex: 'pay_type'},
                { title: '订单状态', dataIndex: 'state'},
                { title: '门票状态', dataIndex: 'is_take'},
                { title: '打印次数', dataIndex: 'print_count'},
                { title: '渠道来源', dataIndex: 'order_source'},
                { title: '操作',
                    dataIndex: 'state1',
                    render: (v, item) => {
                        let iEl = (<div>是否确认反核销此订单？<br />(反核销后订单将会回到未验证状态)</div>);
                        return (<div>
                            <Popconfirm onConfirm={() => this.handleTakeTicket(1, item)} title="是否确认出票？" okText="出票" cancelText="取消">
                                <Button type="primary" size="small" style={{marginRight: "5px", fontSize: "12px"}} ghost>出票</Button>
                            </Popconfirm>
                             <Popconfirm onConfirm={() => this.handleTakeTicket(1, item)} title="是否打印？" okText="打印" cancelText="取消">
                                <Button type="danger" size="small" style={{marginRight: "5px", fontSize: "12px"}} ghost>打印</Button>
                            </Popconfirm>
                            </div>
                        )
                    },
                }
                
            ],
        }
        return (
            <div>
                <Table
                    {...fetchProps}
                />
            </div>
        )
    }
}

CheckOrderList.defaultProps = {
    data: {},
}

export default CheckOrderList