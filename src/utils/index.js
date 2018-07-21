import classnames from 'classnames'
import moment from 'moment'
import store from 'store'
import copyboard from 'copy-to-clipboard'
import api, {err} from './api'
import auth from './auth'
import dynamic from './dynamic'

const clearObjEmpty = (obj, include = [], exclude = []) => {
  if (!obj) return

  Object.keys(obj).forEach(key => {
    if (!exclude.includes(key)) {
      if (include.includes(key) || obj[key] === "") delete obj[key]
    }
  })

  return obj
}

/**
 * 数组内查询,支持嵌套检索
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {array}
 */
const queryArray = (array, value, keyAlias = 'key', childsAlias = 'childs', isOnly = true, result = [], isLike = false) => {
  if (!(array instanceof Array)) {
    return result
  }
  array.forEach(_ => {
    if (isOnly && result.length) {
      return false
    }

    const isEq = !isLike ? _[keyAlias] === value : value.includes(_[keyAlias])
    if (isEq) {
      result.push(_)
    } else if (!isEq && _[childsAlias]) {
      result = queryArray(_[childsAlias], value, keyAlias, childsAlias, result)
    }
  })

  return result
}

/**
 * 得到grid布局状态
 */
const getGridState = () => {
  let sizeState
  const windowSize = window.innerWidth
  if (windowSize >= 1600) {
    sizeState = "xl"
  } else if (windowSize >= 1200) {
    sizeState = "lg"
  } else if (windowSize >= 992) {
    sizeState = "md"
  } else if (windowSize >= 768) {
    sizeState = "sm"
  } else {
    sizeState = "xs"
  }

  return sizeState
}

const getParam = (name) => {
  const url = window.location.href // 获取url

  const theRequest = {}
  if (url.indexOf("?") !== -1) {
    const str = url.substr(url.indexOf("?") + 1)
    const strs = str.split("&")
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1])
    }
  }

  return theRequest[name]
}

const fixedZero = (val) => {
  return val * 1 < 10 ? `0${val}` : val
}

const getTimeDistance = (type) => {
  const now = new Date()
  const oneDay = 1000 * 60 * 60 * 24

  if (type === 'today') {
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    return [moment(now), moment(now.getTime() + (oneDay - 1000))]
  }

  if (type === 'week') {
    let day = now.getDay()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)

    if (day === 0) {
      day = 6
    } else {
      day -= 1
    }

    const beginTime = now.getTime() - (day * oneDay)

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))]
  }

  if (type === 'month') {
    const year = now.getFullYear()
    const month = now.getMonth()
    const nextDate = moment(now).add(1, 'months')
    const nextYear = nextDate.year()
    const nextMonth = nextDate.month()

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)]
  }

  if (type === 'year') {
    const year = now.getFullYear()

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)]
  }
}

export {
  api,
  err,
  auth,
  store,
  dynamic,
  copyboard,
  queryArray,
  classnames,
  getGridState,
  clearObjEmpty,
  getParam,
  fixedZero,
  getTimeDistance,
}