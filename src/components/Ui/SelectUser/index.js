import React from 'react';
import { Input } from 'antd';
import { Layer} from '../../Ui' 
import UserTree from '../../Ui/SelectUser/UserTree'

const vae = "";
class SelectUser extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			values: '',
			ids: [],
			val:''
		}
	}
	SelectTree = () => {
		Layer.open({
			title: "选择用户",
			content: <UserTree handleValue={this.handleValue.bind(this)} keys={this.state.ids}/>,
			onOk: (e) => {
				Layer.close();
				this.setState({val: this.state.values});
			},
		})
	}
	handleValue = (val,ids) => {
		this.setState({values: val});
		this.setState({ids:ids });
	}
	render() {
		return (
			 <Input {...this.props} onClick={this.SelectTree} readOnly={true} value={this.state.val}/>
		);
	}
}
export default SelectUser;