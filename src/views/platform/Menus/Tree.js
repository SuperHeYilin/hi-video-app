import React,{ Component } from 'react'
import { Card , Tree , Icon , message } from 'antd'
import { Button } from '../../../components/Ui'
import { api , queryArray } from '../../../utils'
import lodash from 'lodash'

import styles from './index.less'

const TreeNode = Tree.TreeNode
// const Search = Input.Search
// const ButtonGroup = Button.Group
const tempKey = "temp"

class MenusTree extends Component {
  constructor(props){
    super(props)

    this.state = {
      loading: true,
      menusData: [],
      pKeys: [],
      expandedKeys: [],
      selectedKeys: [],
    }
  }

  componentDidMount () {
    this.fetch()
  }

  componentWillReceiveProps(nextProps) {
    const staticNextProps = lodash.cloneDeep(nextProps)
    const props = this.props
    
    if (!lodash.isEqual(staticNextProps , props)) {
      this.setState({
        selectedKeys: staticNextProps.selectedKeys
      },()=>{
        this.fetch()
      })
    }

  }

  onSelect = (selectedKey , selectedItem) => {
    let { onSelected } = this.props
    if( onSelected ) {
      onSelected(selectedKey,selectedItem)
    }
  }

  handleExpandAll = () => {
    let { expandedKeys , pKeys } = this.state
    let expandAll = expandedKeys.length > 0 ? true : false
    this.setState({expandedKeys: expandAll ? [] : pKeys })
  }

  handleExpand = (expandedKeys,{ expanded }) => {
    this.setState({expandedKeys})
  }
  
  handleSelect = (selectKeys , e) => {
    let { relMenusData , selectedKeys} = this.state
    let { selected, selectedNodes } = e

    if(selected) {
      let selectedItem = selectedNodes[0].props.item
      if(selectedKeys[0] === tempKey && selectedItem.childs && !selectedItem.childs[selectedItem.childs.length - 1].id){
        selectedItem.childs.pop()
        if(selectedItem.childs.length < 1){
          delete selectedItem.childs
        }
      }
      selectedKeys = selectKeys
      this.onSelect(selectedKeys[0],selectedItem)
      this.setState({menusData: relMenusData, selectedKeys: selectedKeys })
    }
  }

  handleDragStart = () => {
    this.setState({autoExpandParent:true})
  }

  handleDragEnter = (info) => {
    const expandedKeys = info.expandedKeys
    this.setState({ expandedKeys })
  }

  handleDrop = (info) => {
    let { relMenusData , expandedKeys } = this.state
    let data = lodash.clone(relMenusData)

    const dropKey = info.node.props.eventKey*1
    const dragKey = info.dragNode.props.eventKey*1
    const dropPos = info.node.props.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
    
    let dropItem = queryArray(data,dropKey,"id")[0]
    let dragItem = queryArray(data,dragKey,"id")[0]

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.id*1 === key) {
          return callback(item, index, arr)
        }
        if (item.childs) {
          return loop(item.childs, key, callback)
        }
      })
    }
    
    let dragObj
    let pMenu
    loop(data, dragKey , (item, index, arr) => {
      if(dropItem.p_menu && info.dropToGap){
        return
      }
      arr.splice(index, 1)
      dragObj = item
    })
    if (info.dropToGap) {
      if(dropItem.p_menu){
        message.warning("更改位置请直接修改排序属性!")
        return
      }
      let ar
      let i
      loop(data, dropKey, (item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i - 1, 0, dragObj)
      }
      pMenu = null
    } else {
      loop(data, dropKey, (item) => {
        item.childs = item.childs || []
        // where to insert 示例添加到尾部，可以是随意位置
        item.childs.push(dragObj)
      })
      pMenu = dropKey
    }

    if(!expandedKeys.includes(dropKey+"")){//展开父节点
      expandedKeys.push(dropKey+"")
    }
    this.setState({menusData: data,relMenusData: data, selectedKeys: [dragKey+""], expandedKeys},()=>{
      this.fetchUpdateIndex(dragKey,pMenu)
    })
    console.log(dropItem.id+"---------------------"+dragItem.id)
  }
  
  handleAddRoot = () => {
    let { relMenusData , selectedKeys } = this.state
    let menusData = lodash.clone(relMenusData)
    
    selectedKeys = [tempKey]
    let rootMenu = {
      menu_name: "新增节点",
    }

    menusData.push(rootMenu)
    
    this.onSelect(selectedKeys[0],rootMenu)
    this.setState({ menusData , selectedKeys })
  }

  handleAddChild = () => {
    let { selectedKeys , expandedKeys , relMenusData} = this.state
    let menusData = lodash.cloneDeep(relMenusData)//这里使用深度拷贝
    
    if(!selectedKeys || !selectedKeys.length){
      this.handleAddRoot()
      return
    } else if(selectedKeys[0] === tempKey) {
      return
    }

    let selectedItem = queryArray(menusData,selectedKeys[0]*1,"id")[0]//查询克隆的新的选中菜单对象

    if(selectedItem && !selectedItem.childs){
      selectedItem.childs = []
    }

    selectedKeys = [tempKey]
    let childMenu = {
      menu_name: "新增子节点",
      p_menu: selectedItem.id,
    }

    selectedItem.childs.push(childMenu)
    if(!expandedKeys.includes(selectedItem.id+"")){//展开父节点
      expandedKeys.push(selectedItem.id+"")
    }

    this.onSelect(selectedKeys[0],childMenu)
    this.setState({menusData , selectedKeys , expandedKeys })
  }

  renderMenuBar = () => {
    //<Button type="danger" size="small" icon="delete" className={styles['Menu-bar']}>删除</Button>
    let { expandedKeys } = this.state
    let expandAll = expandedKeys.length > 0 ? true : false
    return (
      <div>
        <Button size="small" icon={expandAll ? "caret-down" : "caret-right"} className={styles['menu-bar']} onClick={this.handleExpandAll}>展开</Button>
        <Button size="small" icon="plus-square-o" className={styles['menu-bar']} onClick={this.handleAddRoot}>添加(根)</Button>
        <Button size="small" icon="plus" className={styles['menu-bar']} onClick={this.handleAddChild}>添加(子)</Button>
      </div>
    )
  }

  renderMenuList = (MenusData) => {
    return MenusData.map((item) => {
      let key = item.id ? item.id : tempKey
      if (item.childs && item.childs.length) {
        return <TreeNode key={key} title={<span style={{ fontSize: 16 }}><Icon type={item.menu_icon} />{item.menu_name}</span>} item={item}>{this.renderMenuList(item.childs)}</TreeNode>
      }
      return <TreeNode key={key} title={<span style={{ fontSize: 14 }}><Icon type={item.menu_icon} />{item.menu_name}</span>} item={item} />
    })
  }

  fetch = () => {
    api.get("/pt/menus")
    .then((data)=>{
      let loopPkeys = (pkeys=[],data) => {
        data.map(item => {
          if(item.childs) {
            pkeys.push(item.id+"")
            loopPkeys(pkeys,item.childs)
          }
          return item
        })

        return pkeys
      }
      let pKeys = loopPkeys([],data)
      this.setState({
        loading: false,
        menusData: data,
        relMenusData: lodash.clone(data),//备份真实data
        pKeys,
      })
    })
    .catch(api.err)
  }

  fetchUpdateIndex = (currMenuId,pMenuId,index) => {
    api
    .put("/pt/menus/index",{currMenuId,pMenuId,index})
    .then((data)=>{
      message.success("更新成功!")
    })
    .catch(api.err)
  }

  render(){
    let { loading , menusData , expandedKeys , selectedKeys } = this.state
    let treeNodes = loading ? null : this.renderMenuList(menusData)
    
    return (
      <Card title="菜单列表" loading={this.state.loading} bordered={false} className={styles['menu-list']} extra={this.renderMenuBar()} >
        <Tree
          draggable
          autoExpandParent={false}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          onExpand={this.handleExpand}
          onSelect={this.handleSelect}
          onDragEnter={this.handleDragEnter}
          onDrop={this.handleDrop}
          className={styles['draggable-tree']}
        >
          {treeNodes}
        </Tree>
      </Card>
    )
  }
}

export default MenusTree