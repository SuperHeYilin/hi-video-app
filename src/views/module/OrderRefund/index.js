import React ,{ Component } from 'react'
import { Ibox } from '../../../components/Ui'
import OrderRefundTable from './OrderRefundTable'
import OrderFilter from './Filter'

class OrderRefund extends Component {
    constructor(props){
        super(props)
        this.state = {
            data:{}
        }
    }

    onFilter = (filterData) => {
        // alert("提交"+JSON.stringify(filterData))
        this.setState({data: filterData})
    }

    //获取列表选中项
    onSelected = (keys,rows) => {
        this.setState({keys,rows})
    }

    render() {
        let { data , keys , rows} = this.state;
        return (
            <Ibox>
                <Ibox.IboxTitle>
                    <OrderFilter onFilter={ this.onFilter } selected={{keys,rows}} />
                </Ibox.IboxTitle>
                <Ibox.IboxContent>
                    <OrderRefundTable data={data} history={this.props.history} onSelected={this.onSelected} />
                </Ibox.IboxContent>
            </Ibox>
        )
    }
}

export default OrderRefund