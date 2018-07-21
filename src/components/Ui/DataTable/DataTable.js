import React, { Component} from 'react'
import PropTypes from 'prop-types'
import lodash from 'lodash'
import { Table, Card} from 'antd'
import { api, err } from '../../../utils'

import styles from './DataTable.less'

class DataTable extends Component {
  constructor (props) {
    super(props)
    const {
      dataSource,
      pagination,
    } = props
    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
      loadingInit: true,
      dataSource,
      fetchData: {
        pageSize: pagination.pageSize,
        pageNumber: pagination.current,
      },
      pagination,
    }
  }

  componentDidMount () {
    this.fetch()
  }

  componentWillReceiveProps (nextProps) {
    const staticNextProps = lodash.cloneDeep(nextProps)
    delete staticNextProps.columns
    for (const key in staticNextProps) {// 移除所有的方法
      if (typeof staticNextProps[key] === 'function') {
        delete staticNextProps[key]
      }
    }
    const otherProps = lodash.cloneDeep(this.props)
    delete otherProps.columns
    for (const key in otherProps) {// 移除所有的方法
      if (typeof otherProps[key] === 'function') {
        delete otherProps[key]
      }
    }

    // 比较非function值
    if (!lodash.isEqual(staticNextProps, otherProps) || !lodash.isEqual(staticNextProps.fetch.data, otherProps.fetch.data)) {
      this.props = nextProps

      if (!lodash.isEqual(staticNextProps.fetch.data, otherProps.fetch.data)) {
        const { pagination } = this.state
        pagination.current = 1
        this.setState({
          pagination,
          fetchData: {
            pageSize: pagination.pageSize,
            pageNumber: pagination.current,
          },
        }, () => {
          this.fetch()
        })
      }
    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.onSelected(selectedRowKeys, selectedRows)
    this.setState({selectedRowKeys, selectedRows})
  }

  // 填充选中数据
  onSelected = (selectedRowKeys, selectedRows) => {
    const { selection } = this.props

    if (selection.isOpen && selection.onSelected) {
      selection.onSelected(selectedRowKeys, selectedRows)
    }
  }

  // 构建rowSelection
  onRowSelection = (selectedRowKeys) => {
    const { selection } = this.props

    if (!selection.isOpen) return undefined

    this.rowSelection.selectedRowKeys = selectedRowKeys

    return this.rowSelection
  }

  rowSelection = {
    onChange: this.onSelectChange,
    selections: [{
      key: 'odd',
      text: '选择odd',
      onSelect: (changableRowKeys) => {
        let newSelectedRows = []
        const { dataSource } = this.state
        const newSelectedRowKeys = changableRowKeys.filter((key, index) => {
          if (index % 2 !== 0) {
            return false
          }
          return true
        })
        newSelectedRows = dataSource.filter((key, index) => {
          if (index % 2 !== 0) {
            return false
          }
          return true
        })
        this.onSelectChange(newSelectedRowKeys, newSelectedRows)
      },
    }, {
      key: 'even',
      text: '选择even',
      onSelect: (changableRowKeys) => {
        let newSelectedRows = []
        const { dataSource } = this.state
        const newSelectedRowKeys = changableRowKeys.filter((key, index) => {
          if (index % 2 !== 0) {
            return true
          }
          return false
        })
        newSelectedRows = dataSource.filter((key, index) => {
          if (index % 2 !== 0) {
            return true
          }
          return false
        })
        this.onSelectChange(newSelectedRowKeys, newSelectedRows)
      },
    }],
  }

  handleTableChange = (pagination, filters, sorter) => {
    const orderMode = sorter.order ? (sorter.order === "ascend" ? "asc" : "desc") : undefined
    this.setState({
      pagination,
      fetchData: {
        pageSize: pagination.pageSize,
        pageNumber: pagination.current,
        orderColunm: sorter.field,
        orderMode,
        ...filters,
      },
    }, () => {
      this.fetch()
    })
  }

  handleRowClick = (record, index) => {
    let { selectedRowKeys, selectedRows } = this.state
    const rowKey = record[this.props.rowKey]
    let isFilter = true

    selectedRowKeys = selectedRowKeys.filter((key, index) => {
      if (key === rowKey) {
        isFilter = false
        return false
      }
      return true
    })

    selectedRows = selectedRows.filter((row, index) => {
      const key = row[this.props.rowKey]
      if (key === rowKey) return false
      return true
    })

    if (!isFilter) {
      this.onSelectChange(selectedRowKeys, selectedRows)
      return
    }
    if (selectedRowKeys.length < 2) {
      selectedRowKeys = [rowKey]
      selectedRows = [record]
    } else {
      selectedRowKeys.push(rowKey)
      selectedRows.push(record)
    }

    this.onSelectChange(selectedRowKeys, selectedRows)
  }

  // 动态获取数据
  fetch = () => {
    if (!this.props.fetch) {
      return
    }
    const { fetch: { url, data, dataKey, callback }, showLoading } = this.props
    const { fetchData } = this.state
    this.onSelected([], [])// 重置选中项
    if (showLoading) {
      this.setState({ loading: true })
    }
    api.get(
      url,
      {
        ...fetchData,
        ...data,
      },
    ).then((result) => {
      // if (!this.refs.DataTable) {
      //   return
      // }
      if (callback) {
        this.setState(callback(result))
      } else {
        const { pagination } = this.state
        pagination.total = result.totalRow || 0

        this.setState({
          loading: false,
          loadingInit: false,
          dataSource: dataKey ? result[dataKey] : result.list,
          pagination,
          selectedRowKeys: [],
          selectedRows: [],
        })
      }
    }).catch(e => {
      this.setState({
        loading: false,
      })
      err(e)
    })
  }

  render () {
    const { loading: cusLoading, loadingInit, dataSource, pagination, selectedRowKeys } = this.state
    const { rowKey, loading = cusLoading, ...tableProps } = this.props

    return (
      // card延迟数据加载加强首次数据加载性能
      <Card className={styles['table-card']} loading={loadingInit} bordered={false}>
        <Table
          size="small"
          bordered
          scroll={{x: 0}}
          rowKey={rowKey}
          loading={loading}
          onRow={(record, index) => {
            return {
              onClick: () => {this.handleRowClick(record, index)}, // 点击行
              onMouseEnter: () => {}, // 鼠标移入行
            }
          }}
          onChange={this.handleTableChange}
          rowSelection={this.onRowSelection(selectedRowKeys)}
          {...tableProps}
          pagination={pagination}
          dataSource={dataSource}
        />
      </Card>
    )
  }
}

DataTable.defaultProps = {
  rowKey: "id",
  showLoading: true,
  pagination: {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '30', '40'],
    showTotal: total => `共 ${total} 条`,
    pageSize: 15,
    current: 1,
    total: 0,
  },
  selection: {
    isOpen: true,
  },
}

DataTable.propTypes = {
  rowKey: PropTypes.string,
  fetch: PropTypes.object,
  selection: PropTypes.object,
  columns: PropTypes.array,
  dataSource: PropTypes.array,
  pagination: PropTypes.object,
  showLoading: PropTypes.bool,
}

export default DataTable