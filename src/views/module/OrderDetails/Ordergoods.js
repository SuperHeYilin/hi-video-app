import React, { Component } from 'react'
import { Table, Button, Modal, Input, message } from 'antd';
import { api, err as apierr } from '../../../utils'

class GoodsTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            record: {},
            sku: "",
        }
    }
    onChangeUserName = (e) => {
        this.setState({ sku: e.target.value });
    }
    showModal = (record) => {
        this.setState({
            record,
            sku: record.sku,
            visible: true,
        });
    }
    handleOk = (e) => {
        const { record, sku } = this.state
        const { goods_id } = record
        if (goods_id) {
            api
            .put("/pt/goods/sku", {id: goods_id, sku})
            .then((data) => {
                message.success("更新成功!")
                this.props.fetch()
            })
            .catch(apierr)
            this.setState({
                visible: false,
            })
        }
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    render() {
        const { dataOrderGoods, dataGoods } = this.props;
        const { record = {} } = this.state
        const columns = [
            // { title: '商品编码', width: 80, dataIndex: 'goods_id', key: 'goods_id'},
            { title: '商品名称', width: 150, dataIndex: 'goods_name', key: 'goods_name' },
            { title: '商品条码', width: 150, dataIndex: 'barcode', key: 'barcode' },
            { title: '商品规格', dataIndex: 'spec', key: 'spec', width: 80 },
            { title: '购买数量', dataIndex: 'num', key: 'num', width: 120 },
            {
                title: '商品数量',
                dataIndex: 'num',
                key: 'refund_num',
                width: 120,
                render: (num, row) => {
                    return num + row.refund_num
                },
            },
            { title: '原价', dataIndex: 'normal_price', key: 'normal_price', width: 120 },
            { title: '折扣金额', dataIndex: 'discount', key: 'discount', width: 120 },
            { title: '实际付款', dataIndex: 'price', key: 'price', width: 120 },
            { title: 'sku', dataIndex: 'sku', key: 'sku', width: 150 },
            {
                title: '操作',
                key: 'amount',
                width: 120,
                render: (v, record) => {
                    return (
                        <Button onClick={() => this.showModal(record)} >修改sku</Button>
                    )
                }
            },
        ];
        return (
            <div>
                <Modal
                    title="修改sku"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Input placeholder="请输入SKU" value={this.state.sku} onChange={this.onChangeUserName} />
                </Modal>
                <Table columns={columns} dataSource={dataOrderGoods} pagination={false} rowKey={record => record.id} />
            </div>
        )
    }
}

GoodsTable.defaultProps = {
    data: {}
}

export default GoodsTable