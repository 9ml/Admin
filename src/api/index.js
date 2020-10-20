import request from '@/utils/request'

// 伊餐网首页
export function ycwData(params) {
  return request({
    url: '/admin/data',
    method: 'get',
    params
  })
}

// 运营首页
export function operateData(params) {
  return request({
    url: '/admin_lmy/data',
    method: 'get',
    params
  })
}
