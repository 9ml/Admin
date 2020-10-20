import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken, removeToken  } from '@/utils/auth'
import md5 from 'js-md5';
import { resetRouter } from '@/router'



// 创建 axios 实例
const service = axios.create({
  // 公共接口
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // send cookies when cross-domain requests
  // 请求超时
  timeout: 20000
})

// 使用创建的 axios 实例生成请求拦截器
service.interceptors.request.use(
  config => {
    // 发送请求之前做什么
    let token = getToken('token') || ''
    ,   auth = 'Basic_Ivj6eZRxMTx2yiyunZvnG8R65'
    ,   time = new Date().getTime()
    ,   clientType = 'pc'
    ,   userIP = ''
    ,   sign = "auth=" + auth + "&client-type=" + clientType + "&ip=" + userIP + "&time=" + time + "&token=" + token;
    if(token){
      config.headers['token'] = token
      config.headers['auth'] = auth
      config.headers['time'] = time
      config.headers['client-type'] = clientType
      config.headers['ip'] = userIP
      config.headers['sign'] = md5(sign)
    }else{
      config.headers['token'] = token
      config.headers['auth'] = auth
      config.headers['time'] = time
      config.headers['client-type'] = clientType
      config.headers['ip'] = userIP
      config.headers['sign'] = md5(sign)
    }
    return config
  },
  error => {
    // 请求错误处理
    return Promise.reject(error)
  }
)

// 使用创建的 axios 实例生成响应拦截器
service.interceptors.response.use(
  response => {
    // 判断状态
    const res = response.data
    if(res.code === 200){
      return res
    }else if(res.code === -1){
      removeToken()
      Message({
        message: '登录身份已过期，请重新登录',
        type: 'error'
      });
      this.$router.push({ path: '/login' });
      resetRouter()
    }else{
      Message({
        message: res.msg || 'Error',
        type: 'error'
      });
    }
  },
  error => {
    // 请求错误处理
    Message({
      message: error.msg,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default service