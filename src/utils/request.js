import axios from 'axios'

export function request(config) {
  //创建axios，赋给变量api
  const api = axios.create({
    baseURL: 'http://42.192.10.199:8976',
    timeout: 10000
  })

  // 添加request拦截器
  api.interceptors.request.use(
    (config) => {
      // 在发送前做写什么
      if (window.localStorage.getItem('token') != undefined) {
        // 让每个请求携带自定义
        config.headers['token'] = window.localStorage.getItem('token')
      }
      return config
    },
    (error) => {
      //对错误做些什么
      return Promise.reject(error)
    }
  )

  // 添加response 拦截器
  api.interceptors.response.use(
    (response) => {
      //在响应前做些什么
      let { data } = response
      return data
    },
    //接口错误状态处理，也就是说无响应时的处理
    (error) => {
      console.log(error)
      // 对错误做些什么
      return Promise.reject(error.response.data.status) // 返回接口返回的错误信息
    }
  )
  //发送真正的网络请求
  return api(config)
}

export default request
