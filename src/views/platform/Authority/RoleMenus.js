import React,{ Component } from 'react'
import { Card , Input , Tree , Icon , message, Checkbox } from 'antd'
import { Button } from '../../../components/Ui'
import { api , queryArray } from '../../../utils'
import lodash from 'lodash'

import styles from './index.less'

const TreeNode = Tree.TreeNode
const CheckboxGroup = Checkbox.Group

class RoleMenus extends Component {
    constructor(props){
        super(props)

        this.state = {
            loading: true,
            menusData: [],
            pKeys: [],
            allKeys: [],
            expandedKeys: [],
            checkedKeys: [],
            relCheckedKeys: [],
            halfCheckedKeys: [],
        }
    }

    componentDidMount () {
        this.fetch()
    }

    componentWillReceiveProps(nextProps) {
        const staticNextProps = lodash.cloneDeep(nextProps)
        const props = this.props
        
        if (!lodash.isEqual(staticNextProps.roleItem , props.roleItem)) {
            this.setState({
                checkedKeys: []
            },()=>{
                this.fetch()
            })
        }
    }

    handleExpandAll = () => {
        let { expandedKeys , pKeys } = this.state
        let expandAll = expandedKeys.length > 0 ? true : false
        this.setState({expandedKeys: expandAll ? [] : pKeys })
    }

    handleCheckAll = () => {
        let { checkedKeys , allKeys } = this.state
        let checkedAll = checkedKeys.length > 0 ? true : false
        this.setState({
            checkedKeys: checkedAll ? [] : allKeys 
        })
    }

    handleExpand = (expandedKeys,{ expanded }) => {
			this.setState({expandedKeys})
    }

    handleCheck = (checkedKeys , e) => {
        let { halfCheckedKeys } = e
        // console.log("复选框"+JSON.stringify(halfCheckedKeys))
        this.setState({
            checkedKeys,
            halfCheckedKeys
        })
    }

    handleRefresh = () => {
			this.fetchUpdate()
    }

    handleReload = () => {
			let { relCheckedKeys } = this.state
			this.setState({
				checkedKeys: relCheckedKeys
			})
		}
		
		//传入某个数组 从里面删除指定数据
		onDeleteCheckedKey(checkedKeys,key){
			let checkedSet = [...new Set(checkedKeys)]
			if(!checkedSet.includes(key)){
				return checkedKeys
			}
			let index = checkedSet.findIndex((value)=>{
				return value === key
			})
			checkedSet.splice(index,1)

			return checkedSet
		}

		//单个check事件
    onCheckChange = (fatherId,key,pKey,e,childCheckKeys) => {
			let { checkedKeys } = this.state
			let checked = e.target.checked
			if(checked) {
				checkedKeys.push(key)
				//如果有子集 就添加父级
				checkedKeys.push(fatherId+"")
			} else {
				checkedKeys = this.onDeleteCheckedKey(checkedKeys,key)
			}
			
			//如果没有子集选取 就移除父级key
			if (childCheckKeys = 1) {
				checkedKeys = this.onDeleteCheckedKey(checkedKeys,fatherId+"")
			}
			this.setState({checkedKeys})
		}

		//切换显示所有
		onCheckAllChange = (key,item,e) => {
			let { checkedKeys } = this.state
			let checked = e.target.checked
			if(checked) {
				checkedKeys.push(key)
				if(item.childs && item.childs.length){
					item.childs.forEach((child)=>{
						if(!checkedKeys.includes(child.id+"")){
							checkedKeys.push(child.id+"")
						}
					})
				}

				return this.setState({checkedKeys})
			}

			checkedKeys = this.onDeleteCheckedKey(checkedKeys,key)
			//删除父级id
			checkedKeys = this.onDeleteCheckedKey(checkedKeys,item.id+"")
			if(item.childs && item.childs.length){
				item.childs.forEach((child)=>{
					checkedKeys = this.onDeleteCheckedKey(checkedKeys,child.id+"")
				})
			}
			this.setState({checkedKeys})
		}

    renderMenuBar = () => {
			let { expandedKeys , checkedKeys } = this.state
			let expandAll = expandedKeys.length > 0 ? true : false
			let checkedAll = checkedKeys.length > 0 ? true : false
			return (
				<div>
					{/* <Button size="small" icon={expandAll ? "caret-down" : "caret-right"} className={styles['menu-bar']} onClick={this.handleExpandAll}>展开</Button> */}
					<Button size="small" icon={checkedAll ? "minus-square-o" : "minus-square"} className={styles['menu-bar']} onClick={this.handleCheckAll}>{checkedAll ? '取消选择' : '全选'}</Button>
					<Button size="small" icon="reload" className={styles['menu-bar']} onClick={this.handleReload}>还原选择</Button>
					<Button size="small" icon="upload" className={styles['menu-bar']} onClick={this.handleRefresh}>更新</Button>
				</div>
			)
		}
		
		// 遍历子集checkbox
		renderCheckboxs(menusData,pKey,checkedKeys,childCheckKeys) {
			// console.log("遍历子集："+JSON.stringify(menusData))
			return menusData.childs.map((item)=>{
				return (
				<Checkbox
				key={item.id}
				onChange={(e)=>{this.onCheckChange(menusData.id,item.id+"",pKey,e,childCheckKeys)}}
				checked={checkedKeys.includes(item.id+"")}
				style={{ marginLeft: 32 }}
				>
					<span>{item.menu_name}</span>
				</Checkbox>
				)
			})
		}

		// 通过角色菜单数据 选中可以 遍历出checkbox 
    renderMenuList = (menusData,checkedKeys) => {
			
			return menusData.map((item) => {
				let key = item.id+""
				// 判断是否有子级
				let isExistsChild = item.childs && item.childs.length
				// 判断当前item 选中的子集个数
				let childCheckKeys = 0
				if(isExistsChild){
				
					item.childs.forEach((child)=>{
						if(checkedKeys.includes(child.id+"")){
							childCheckKeys++
						}
					})
					if(childCheckKeys > 0) {
						//如果有子集 就添加父级
						checkedKeys.push(item.id+"")
					}
					//如果没有子集选取 就移除父级key
					if (childCheckKeys <= 0) {
						checkedKeys = this.onDeleteCheckedKey(checkedKeys,item.id+"")
						// console.log("移除后："+JSON.stringify(checkedKeys))
					}
				}

				return (
					<div key={key} style={{ marginTop: 24 }}>
						<div style={{ borderBottom: '1px solid #E9E9E9' , marginBottom: 16, paddingBottom: 8 }} >
							<Checkbox
							indeterminate={isExistsChild ? childCheckKeys > 0 && childCheckKeys !== item.childs.length : false}
							onChange={(e)=>this.onCheckAllChange(key,item,e)}
							checked={isExistsChild ? childCheckKeys === item.childs.length : checkedKeys.includes(key)}
							>
								<span style={{ fontWeight: "bold" }}>{item.menu_name}</span>
							</Checkbox>
						</div>
						{isExistsChild ? <div>{this.renderCheckboxs(item,key,checkedKeys,childCheckKeys)}</div> : null}
					</div>
				)
			})
    }

    loopkeys = (data,pKeys=[],allKeys=[],checkedKeys=[]) => {
			data.map(item => {
					let id = item.id+""
					allKeys.push(id)
					if(item.pmr_id) {
							checkedKeys.push(id)
					}
					if(item.childs) {
							pKeys.push(id)
							this.loopkeys(item.childs,pKeys,allKeys,checkedKeys)
					}
					return item
			})

			return {pKeys , allKeys , checkedKeys}
    }

		//更新角色菜单
    fetchUpdate = () => {
			let { checkedKeys , halfCheckedKeys } = this.state
			let { roleItem } = this.props
			let keys = [...checkedKeys,...halfCheckedKeys]
			//去除重复
			const newKyes = [...new Set(keys)];
			
			// console.log("RoleMenus set:"+JSON.stringify(newKyes))
			api.put("/pt/menus/roles",{roleId: roleItem.id , menus: newKyes.join(',')})
			.then((data)=>{
					message.success('更新成功')
			})
			.catch(api.err)
    }

    fetch = () => {
			let { roleItem } = this.props
			//通过角色id查菜单
			api.get("/pt/menus/roles",{roleId : roleItem.id})
			.then((data)=>{
					// console.log("RoleMenus fetch: data :"+JSON.stringify(data))
					let {pKeys , allKeys , checkedKeys} = this.loopkeys(data)
					// console.log("RoleMenus checkedKeys: "+JSON.stringify(checkedKeys))
					this.setState({
							loading: false,
							menusData: data,
							pKeys,
							allKeys,
							checkedKeys,
							relCheckedKeys : lodash.clone(checkedKeys)
					})
			})
			.catch(api.err)
    }

    render(){
				let { loading , menusData , expandedKeys , checkedKeys = [] } = this.state
				// 传入角色菜单数据 和选中的key
        let menus = loading ? null : this.renderMenuList(menusData,checkedKeys)
        
        return (
					<Card title="菜单列表" loading={this.state.loading} bordered={false} className={styles['menu-list']} extra={this.renderMenuBar()} >
						{menus}
					</Card>
        )
    }
}

export default RoleMenus