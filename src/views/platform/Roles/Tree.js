import React,{ Component } from 'react'
import { Card , Input , Tree , Icon , message } from 'antd'
import { Button } from '../../../components/Ui'
import { api , queryArray } from '../../../utils'
import lodash from 'lodash'

import styles from './index.less'

const TreeNode = Tree.TreeNode
const tempKey = "temp"
const gridStyle = {
    // width: '80%',
    marginTop: 16,
    // marginLeft: '10%'
  };
const Imp = (e) => {
    console.log(JSON.stringify(e))
    if (e.ind == "God" || e.ind == "SuperAdmin") {
        return <img src={require(`./img/${e.ind}.jpg`) } alt="" width="45" height="45" />
    }
    return <img src={require(`./img/3.jpg`)} alt="" width="45" height="45" />
    
}

class RoleTree extends Component {
    constructor(props){
        super(props)

        this.state = {
            loading: true,
            rolesData: [],
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
        let  { onSelected } = this.props
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
        let { relRolesData , selectedKeys} = this.state
        let { selected, selectedNodes } = e
        console.log("Tree selectKeys:"+JSON.stringify(selectKeys))
        console.log("Tree selected:"+JSON.stringify(selected))
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
            this.setState({rolesData: relRolesData, selectedKeys: selectedKeys })
        }
    }
    //card选中
    handleSelect2 = (selectKeys) => {
        let { relRolesData , selectedKeys} = this.state

            selectedKeys = selectKeys
            // this.onSelect(selectedKeys[0])
            this.setState({rolesData: relRolesData, selectedKeys: selectedKeys })
    }

    handleDragStart = () => {
        this.setState({autoExpandParent:true})
    }

    handleDragEnter = (info) => {
        const expandedKeys = info.expandedKeys
        this.setState({ expandedKeys })
    }

    handleDrop = (info) => {
        let { relRolesData , expandedKeys } = this.state
        let data = lodash.clone(relRolesData)
        console.log(info)

        const dropKey = info.node.props.eventKey*1;
        const dragKey = info.dragNode.props.eventKey*1;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        
        let dropItem = queryArray(data,dropKey,"id")[0]
        let dragItem = queryArray(data,dragKey,"id")[0]

        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                if (item.id === key) {
                    return callback(item, index, arr);
                }
                if (item.childs) {
                    return loop(item.childs, key, callback);
                }
            });
        };
        
        let dragObj;
        loop(data, dragKey , (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        if (info.dropToGap) {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i - 1, 0, dragObj);
            }
        } else {
            loop(data, dropKey, (item) => {
                item.childs = item.childs || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.childs.push(dragObj);
            });
        }

        if(!expandedKeys.includes(dropKey+"")){//展开父节点
            expandedKeys.push(dropKey+"")
        }
        this.setState({rolesData: data, selectedKeys: [dragKey+""], expandedKeys})
        console.log(dropItem.id+"---------------------"+dragItem.id)
    }
    
    handleAddRoot = () => {
        let { relRolesData , selectedKeys } = this.state
        let rolesData = lodash.clone(relRolesData)
        
        selectedKeys = [tempKey]
        let rootMenu = {
            name: "新增节点",
        }

        rolesData.push(rootMenu)
       
        this.onSelect(selectedKeys[0],rootMenu)
        this.setState({ rolesData , selectedKeys })
    }

    handleAddChild = () => {
        let { selectedKeys , expandedKeys , relRolesData} = this.state
        let rolesData = lodash.cloneDeep(relRolesData)//这里使用深度拷贝
       
        if(!selectedKeys || !selectedKeys.length){
            this.handleAddRoot()
            return
        } else if(selectedKeys[0] === tempKey) {
            return
        }

        let selectedItem = queryArray(rolesData,selectedKeys[0]*1,"id")[0]//查询克隆的新的选中菜单对象

        if(selectedItem && !selectedItem.childs){
            selectedItem.childs = []
        }

        selectedKeys = [tempKey]
        let childMenu = {
            name: "新增子节点",
            pid: selectedItem.id,
        }

        selectedItem.childs.push(childMenu)
        if(!expandedKeys.includes(selectedItem.id+"")){//展开父节点
            expandedKeys.push(selectedItem.id+"")
        }

        this.onSelect(selectedKeys[0],childMenu)
        this.setState({rolesData , selectedKeys , expandedKeys })
    }

    renderRoleBar = () => {
        //<Button type="danger" size="small" icon="delete" className={styles['role-bar']}>删除</Button>
        let { expandedKeys } = this.state
        let expandAll = expandedKeys.length > 0 ? true : false
        return (
            <div>
                <Button size="small" icon={expandAll ? "caret-down" : "caret-right"} className={styles['role-bar']} onClick={this.handleExpandAll}>展开</Button>
                <Button size="small" icon="plus-square-o" className={styles['role-bar']} onClick={this.handleAddRoot}>添加(根)</Button>
                <Button size="small" icon="plus" className={styles['role-bar']} onClick={this.handleAddChild}>添加(子)</Button>
            </div>
        )
    }

    renderRoleList = (rolesData) => {
        return rolesData.map((item) => {
            let key = item.id ? item.id : tempKey
            if (item.childs && item.childs.length) {
                return <TreeNode key={key} title={item.name} item={item}>{this.renderRoleList(item.childs)}</TreeNode>;
            }
            return <TreeNode key={key} title={item.name} item={item} />;
        })
    }

    fetch = () => {
        api.get("/pt/roles")
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
                rolesData: data,
                relRolesData: lodash.clone(data),//备份真实data
                pKeys,
            })
        })
        .catch(api.err)
    }

    render(){
        let { loading , rolesData , expandedKeys , selectedKeys } = this.state
        let treeNodes = loading ? null : this.renderRoleList(rolesData)
        console.log("Tree rolesData: "+JSON.stringify(rolesData))
        return (
            <Card title="角色列表" loading={this.state.loading} bordered={false} className={styles['role-list']}  extra={this.renderRoleBar()} >
                <Tree
                    draggable
                    autoExpandParent={false}
                    expandedKeys={expandedKeys}
                    selectedKeys={selectedKeys}
                    onExpand={this.handleExpand}
                    onSelect={this.handleSelect}
                    //onDragStart={this.handleDragStart}
                    onDragEnter={this.handleDragEnter}
                    onDrop={this.handleDrop}
                    className={styles['draggable-tree']}
                >
                    {treeNodes}
                </Tree>
                { rolesData.map((item) => {
                        // return <Card.Grid
                        //             style={gridStyle} 
                        //             key={item.id}
                        //             onClick={() => alert(item.id)}
                        //             extra={<a href="#">More</a>}
                        //         >
                        //             {item.user_role_name}
                        //         </Card.Grid>
                    return <Card
                                style={gridStyle} 
                                key={item.id}
                                title={<Imp ind={item.value} />}
                                onClick={() => this.handleSelect2(item.id)}
                                extra={<a onClick={() => alert()}><Icon type="close" /></a>}
                            >
                                {item.name}
                            </Card>
                    })}
            </Card>
        )
    }
}

export default RoleTree