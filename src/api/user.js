import request from '@/utils/request'

// 获取验证码
export function code(data) {
  return request({
    url: '/admin/send_sms',
    method: 'post',
    data
  })
}

// 登录
export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

// 获取导航
export function getNav(params) {
  return request({
    url: '/admin/admin_user',
    method: 'get',
    params
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
