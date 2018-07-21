import { message } from 'antd'
import Qs from 'qs'
import Api from './api'
import { api as apiConfig, publicPath } from '../../constants'
import { getNodeEnv } from '../router'

const getDoMain = () => {
  if (getNodeEnv() === "production") {
    return apiConfig.proDoMain
  } else {
    return apiConfig.devDoMain
  }
}

const getBaseUrl = () => {
  if (getNodeEnv() === "production") {
    return apiConfig.prodBaseURL
  } else {
    return apiConfig.devBaseURL
  }
}

const getImageUrl = () => {
  return apiConfig.imgURL
}

const getBaseHost = () => {
  if (getNodeEnv() === "production") {
    return apiConfig.prodHost
  } else {
    return apiConfig.devHost
  }
}

// https://github.com/mzabriskie/axios
// http://www.jianshu.com/p/df464b26ae58
const config = {
  // 请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
  url: '/',
  // 请求方法同上
  method: 'get', // default
  // 基础url前缀
  baseURL: getBaseUrl(),
  transformRequest: [function (data) {
    // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs（这个模块在安装axios的时候就已经安装了，不需要另外安装）
    data = JSON.stringify(data)
    return data
  }],
  transformResponse: [function (data) {
    // 这里提前处理返回的数据
    return data
  }],
  paramsSerializer: (params) => {
    return Qs.stringify(params, { arrayFormat: 'repeat' })
  },
  // 请求头信息
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // parameter参数
  params: {},
  // post参数，使用axios.post(url,{},config);如果没有额外的也必须要用一个空对象，否则会报错
  data: {},
  // 设置超时时间
  timeout: 15000,
  // 上传最大长度
  maxContentLength: 100000,
  // 返回数据类型
  responseType: 'json', // default
}

const api = new Api(config)

const printLog = (err) => {
  console.error(err)
}

const msgErr = (text) => {
  message.error(text)
}

const err = (err) => {
  message.destroy()
  printLog(err)
  if (err.response) {
    const { status, statusText, data = [] } = err.response

    switch (status) {
      case 401:
        // 其他操作
        msgErr("请求未授权")
        setTimeout(() => {
          // const pathname = location.pathname // 得到当前的路由状态
          // const refer = pathname ? "?ret=" + pathname : ""

          window.location.href = publicPath + 'auth/login'
        }, 100)
        break
      case 403:
        // 其他操作
        if (data) {// 系统抛出的HttpException
          msgErr(data[0].message || data[0].key)
        } else {// 抛出的ErrModelException
          msgErr("身份信息不完整")
        }
        break
      case 404:
        // 其他操作
        if (data) {// 系统抛出的HttpException
          msgErr(data[0].message)
        }
        break
      case 422:
        // 其他操作
        if (data) {// 系统抛出的HttpException
          msgErr(data[0].message)
        } else {
          msgErr(data[0].message)
        }
        break
      case 500:
        if (data) {// 系统抛出的HttpException
          msgErr(data[0].message || data[0].key)
        } else if (statusText) {// 主动抛出的HttpException
          message.warning(statusText)
        } else {// 抛出的ErrModelException

        }
        break;
      case 503: return;
      case 'timeout':
        msgErr('请求超时')
        break
      default:
        msgErr("未知错误")
        break
    }
  } else {
    const { message: msg } = err
    if (err.config) {
      switch (msg) {
        case 'timeout of ' + err.config.timeout + 'ms exceeded':
          msgErr('请求超时')
          break
        case 'Network Error':
          msgErr('服务器开小差了')
          break
        default:
          msgErr("未知错误")
          break
      }
    } else {
      switch (msg) {
        default:
          msgErr("未知错误")
          break
      }
    }
  }
}

api.err = err
api.getBaseUrl = getBaseUrl
api.getBaseHost = getBaseHost
api.getDoMain = getDoMain
api.getImageUrl = getImageUrl
export {
  api as default,
  err,
  getBaseUrl,
  getImageUrl,
}