import React from 'react'
import { Tree,Icon } from 'antd'
import { api, err as apierr } from '../../../../utils'
const TreeNode = Tree.TreeNode

function generateTreeNodes(treeNode) {
	const arr = []
	const key = treeNode.props.eventKey
	for (let i = 0; i < 3; i++) {
    arr.push({ name: `leaf ${key}-${i}`, key: `${key}-${i}` })
	}
	return arr
}

function setLeaf(treeData, curKey, level) {
  const loopLeaf = (data, lev) => {
    const l = lev - 1
    data.forEach((item) => {
      if ((item.key.length > curKey.length) ? item.key.indexOf(curKey) !== 0 :
        curKey.indexOf(item.key) !== 0) {
        return
      }
      if (item.children) {
        loopLeaf(item.children, l)
      } else if (l < 1) {
        item.isLeaf = true
      }
    })
  }
  loopLeaf(treeData, level + 1)
}

function getNewTreeData(treeData, curKey, child, level) {
  console.info(treeData)
  const loop = (data) => {
    data.forEach((item) => {
      if (curKey.indexOf(item.key) === 0) {
        item.children = child
      } else if (item.children) {
        loop(item.children)
      }
    })
  }
  loop(treeData)
  setLeaf(treeData, curKey, level)
}

class UserTree extends React.Component {
  state = {
    treeData: [],
    selectData: [],
  }
  componentDidMount() {
    api
    .get('/pt/roles/parent')
    .then((values) => {
        this.setState({
          treeData: values,
        })
    })
    .catch((err) => {

    })
  }
  onSelect = (info) => {
//  console.log('selected', info)
  }
  onCheck = (chs,e) =>{
    chs = chs.join(",")
    api
    .get('/pt/roles/parent/listbyru', {keys: chs})
    .then((values) => {

    })
    .catch((err) => {

    })
    let names = ""
    for (let i in e.checkedNodes) {
      if (e.checkedNodes[i].key.includes("u-")) {
        names += e.checkedNodes[i].props.name + ","
      }
    }
    if (names.length > 0) {
      names = names.substring(0, names.length - 1)
    }
    let arry  = []
    for(var i in chs){
      if(chs[i].includes("u-")){
        arry.push(chs[i])
      }
    }
    this.props.handleValue(names,arry)
  }
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
    	let tid = treeNode.props.eventKey
	  	tid=tid.split("-")[1]
	  	api
	      .get('/pt/roles/parent/'+tid)
	      .then((values)=>{
	      	setTimeout(() => {
		        const treeData = [...this.state.treeData]
		        getNewTreeData(treeData, treeNode.props.eventKey, values, 3)
		        this.setState({ treeData:treeData}) 
		        resolve()
		      }, 1000)
	      })
	      .catch((err)=>{
	        
	    	})
    })
  }
  render() {
    const loop = data => data.map((item) => {
    	let val 
    	let val1 
    	if(item.icon){
    		val =<span><Icon type="user" />{item.name}</span>
    	}else{
    		val =<span><Icon type="team" />{item.name}</span>
    	}
      if (item.children) {
        return <TreeNode title={val} key={item.key}  name={item.name}>{loop(item.children)}</TreeNode>
      }
      return <TreeNode title={val} key={item.key}  name={item.name} isLeaf={item.isLeaf} />
    })
    const treeNodes = loop(this.state.treeData)
    return (
      <Tree onSelect={this.onSelect} onCheck={this.onCheck} loadData={this.onLoadData} defaultCheckedKeys={this.props.keys} checkable>
        {treeNodes}
      </Tree>
    )
  }
}

export default UserTree