import React,{ Component } from 'react'
import { Row, Col , Card , Input , message , Modal } from 'antd'
import { WechatUserForm } from './Modal'
import WechatUserView from './View'
import { Layer , Button } from '../../../components/Ui'
import { api, err as apierr } from '../../../utils'

const Search = Input.Search
const ButtonGroup = Button.Group
const confirm = Modal.confirm

class WechatUserFilter extends Component {
    constructor(props){
        super(props)
        this.state = {
            isFilter : false
        }
    }

    onSearch = (value) => {
        let { onFilter } = this.props;
        onFilter({name : value});
    }


    render(){
        let {selected : { keys }} = this.props;
        let { isFilter } = this.state;
        if(!keys) keys = []
        return (
            <div>
                <Row gutter={24}>
                    <Col lg={8} md={12} sm={16} xs={18}>
                        <ButtonGroup>
                            <Button type="primary" disabled={keys.length !== 1} icon="eye">查看</Button>
                        </ButtonGroup>
                    </Col>
                    <Col lg={{ offset: 8, span: 8 }} md={12} sm={8} xs={0} style={{ textAlign: 'right' }}>
                        { !isFilter ? 
                        <Search
                            placeholder="姓名"
                            style={{ width: 200 }}
                            onSearch={this.onSearch}
                        />
                        :
                        ""
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

export default WechatUserFilter