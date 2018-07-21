import axios from 'axios'
import auth from '../auth'

const methods = [
  'get',
  'head',
  'post',
  'put',
  'delete',
  'options',
  'patch',
]

class _Api {
  constructor(config = {}, opts = {}) {
    this.config = config
    this.opts = opts

    if (!this.config.baseURL) {
      throw new Error('baseURI option is required')
    }
    const instance = axios.create(config)

    instance.interceptors.request.use((config) => {
      // 在请求发出之前进行一些操作
      const authToken = auth.getAuthToken()
      config.headers.Authorization = authToken || ""
      return config
    })

    methods.forEach(method =>
      this[method] = (path, data = {}, config = {}) => {
        if (method === "get" || method === "delete") {
          const newConfig = Object.assign({}, config, {params: data})
          return instance[method](path, newConfig)
          .then(response => {
            return response.data
          })
        } else {
          return instance[method](path, data, config)
          .then(response => {
            return response.data
          })
        }
      }
    )
  }
}

const Api = _Api

export default Api