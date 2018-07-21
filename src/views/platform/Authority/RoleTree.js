import React, { Component } from 'react'
import { Card, Input, Icon, message, Button, Modal, Tag } from 'antd'
import { api } from '../../../utils'

import styles from './styles.less'

const addStyle = {
	padding: 8,
	width: '80%',
	marginTop: 8,
	marginLeft: '10%',
	textAlign: 'center',
	// border: '0.5px solid #E8E8E8'
}

const { confirm } = Modal

class RoleTree extends Component {
  constructor(props) {
		super(props)
		this.state = {
			showAdd: true, // 显示隐藏add按钮
			roleName: '', // 新增角色名称
			rolesData: [],
			pKeys: [],
			expandedKeys: [],
			selectedKeys: [],
		}
	}

	componentDidMount () {
    this.fetch()
	}

	onSelect = (selectedKey, selectedItem) => {
		const { onSelected } = this.props
		if (onSelected) {
			onSelected(selectedKey, selectedItem)
		}
	}
	// 失去焦点
	onChangeBlur = () => {
		this.setState({ roleName: '', showAdd: true })
	}
	// 切换角色名称
	onChangeRole = (e) => {
		this.setState({ roleName: e.target.value })
	}
	// 切换添加按钮
	handleToggleAdd = () => {
		this.setState({ showAdd: !this.state.showAdd })
	}
	// 清空输入
	emitEmpty = () => {
		this.userRoleInput.focus()
		this.setState({ roleName: '' })
	}

	handleExpandAll = () => {
		const { expandedKeys, pKeys } = this.state
		this.setState({expandedKeys: expandedKeys.length ? [] : pKeys })
	}

	handleExpand = (expandedKeys, { expanded }) => {
		this.setState({expandedKeys})
	}

  handleSelect = (item) => {
    const { selectedKeys } = this.state
    // let { selected, selectedNodes } = e
    selectedKeys[0] = item.id + ""
    this.onSelect(item.id + "", item)
    this.setState({ selectedKeys })
  }

  fetch = () => {
    api
    .get("/pt/roles")
    .then((data) => {
      const loopPkeys = (pkeys = [], data) => {
        data.map(item => {
          if (item.childs) {
            pkeys.push(item.id + "")
            loopPkeys(pkeys, item.childs)
          }
          return item
        })
        return pkeys
      }
      const pKeys = loopPkeys([], data)
      this.setState({
        rolesData: data,
        pKeys,
      })
    })
    .catch(api.err)
  }
  // 添加角色
  handleSubmit = () => {
    const { roleName } = this.state
    if (roleName.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
      // message.warning("角色不能为空")
      this.onChangeBlur()
      return
    }
    api.post("/pt/roles", {role: { name: roleName, type: "2" }})
    .then((result) => {
      this.onChangeBlur()
      message.success("添加成功!")
      this.fetch()
      // onRefresh(result,[result.id+""])
    })
    .catch(api.err)
	}
	// 删除角色
	handleDelete = (roleItem) => {
		if (roleItem && roleItem.id) {
			confirm({
				title: '确定要删除该项吗?',
				onOk: () => {
					api.delete("/pt/roles/" + roleItem.id)
					.then((data) => {
						message.success("删除成功!")
						this.fetch()
					})
					.catch(api.err)
				},
				onCancel() {
				},
			})
		} else {
			this.fetch()
		}
	}

  render() {
    const { rolesData, selectedKeys, showAdd, roleName } = this.state
    // const selectKey = 'inbox'
    // let treeNodes = loading ? null : this.renderRoleList(rolesData)
    // let count = 0
    const suffix = roleName ? <Icon type="close-circle" onClick={this.emitEmpty} size="large" /> : null
    // console.log("RoleTree selectedKeys:"+JSON.stringify(selectedKeys))
    return (
      <Card
        hoverable
        className={styles.mail}
        title="角色列表"
        bodyStyle={{padding: 0}}
        extra={<Button type="primary" size="small" icon="plus" onClick={this.handleToggleAdd}>新建角色 </Button>}
      >
        <div style={{ display: showAdd ? 'none' : 'block' }} tabIndex="0" >
          <div style={addStyle} >
            <Input
              placeholder="请输入角色名称"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={suffix}
              value={roleName}
              onChange={this.onChangeRole}
              ref={node => this.userRoleInput = node}
              style={{ width: '70%' }}
            />
            <Button
              style={{ marginLeft: 16 }}
              type="primary"
              shape="circle"
              icon="check"
              onClick={this.handleSubmit}
            />
          </div>
        </div>
        <div className={styles["left-panel"]}>
          <ul className={styles["mail-nav"]}>
            {rolesData.map((item) => {
              return (
                <li className={parseInt(selectedKeys, 10) === item.id ? styles["active"] : null} onClick={() => this.handleSelect(item)} key={item.id}>
                  <span className={styles["iconleft"]}>{item.name}</span>
                  {/* <span className="iconright" /> */}
                  {
                  item.type !== 1 && parseInt(selectedKeys, 10) === item.id ?
                  <span className={styles["iconright"]} onClick={() => this.handleDelete(item)} ><Tag color="#87d068"><Icon type="close" /></Tag></span>
                  :
                  null
                  }
                </li>
              )
            })}
          </ul>
        </div>
      </Card>
    )
  }
}

export default RoleTree