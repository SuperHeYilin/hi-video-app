import React,{ Component } from 'react'
import { TextField } from 'material-ui'
import classnames from 'classnames'

class RTInput extends Component {
	render() {
		let { className , ...otherProps } = this.props
		return <TextField className={classnames(className)} {...otherProps} />
	}
}

export {
	RTInput as Input
}