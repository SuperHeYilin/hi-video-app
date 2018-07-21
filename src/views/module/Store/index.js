import React, { Component } from 'react'
import { Ibox } from '../../../components/Ui'
import StoreFilter from './Filter'
import StoreList from './List'
import Card from './index2'
import { api, err as apierr } from '../../../utils'

class Store extends Component {

    constructor(props){
        super(props)
        this.state = {}
        api
        .get("/pt/store")
        .then((data) => {
           this.setState({
           	data:data
           });
        })
        .catch(apierr)
    }

    onFilter = (filterData) => {
    	api
        .get("/pt/store")
        .then((data) => {
           this.setState({
           	data:data
           });
        })
        .catch(apierr)
    }

    //获取列表选中项
    onSelected = (keys,rows) => {
        this.setState({keys,rows})
    }
	//<StoreList data={data} onFilter={ this.onFilter } onSelected={this.onSelected} />
    render() {
        let { data , keys , rows} = this.state;
        return (
            <Ibox>
                <Ibox.IboxTitle>
                    <StoreFilter onFilter={ this.onFilter } selected={{keys,rows}} />
                </Ibox.IboxTitle>
                <Ibox.IboxContent>
                	<Card data={data} onFilter={ this.onFilter } history={this.props.history} />
                </Ibox.IboxContent>
            </Ibox>
        )
    }
}

export default Store