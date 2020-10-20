import request from '@/utils/request'

// 筛选
export function operateScreen(params){
  return request({
    url: '/admin_lmy/screen',
    method: 'get',
    params
  })
}

// 地区列表
export function areaList(){
  return request({
    url: '/admin_lmy/in_citys',
    method: 'get'
  })
}

// 用户订单信息
export function userOrder(params){
  return request({
    url: '/admin_lmy/user_order',
    method: 'get',
    params
  })
}

// 用户周期信息
export function userCycle(params){
  return request({
    url: '/admin_lmy/user_order_cycle',
    method: 'get',
    params
  })
}

// 地区交易排行榜
export function transactionRanking(params){
  return request({
    url: '/admin_lmy/trans_area_top',
    method: 'get',
    params
  })
}
// 周 / 月冠
export function wAMChampion(params){
  return request({
    url: '/admin_lmy/team_red_envelopes',
    method: 'get',
    params
  })
}

// 省份交易排行榜
export function regionalRanking(params){
  return request({
    url: '/admin_lmy/trans_pro_top',
    method: 'get',
    params
  })
}

// 产品复购线索
export function productClue(params){
  return request({
    url: '/admin_lmy/product_clue',
    method: 'get',
    params
  })
}

// 组合销售线索
export function combinationClue(params){
  return request({
    url: '/admin_lmy/combination_clue',
    method: 'get',
    params
  })
}

// 客户流失线索
export function customerClue(params){
  return request({
    url: '/admin_lmy/customer_clue',
    method: 'get',
    params
  })
}

// 客户门店分布
export function customerList(params){
  return request({
    url: '/admin_lmy/customer_list',
    method: 'get',
    params
  })
}

// 客户失效
export function userInvalid(data){
  return request({
    url: '/admin_lmy/user_info',
    method: 'put',
    data
  })
}

// 用户删除
export function userDel(data){
  return request({
    url: '/admin_lmy/user_info',
    method: 'delete',
    data
  })
}

// 客户商品超期列表
export function saleUserProduct(params){
  return request({
    url: '/admin_lmy/sale_user_product',
    method: 'get',
    params
  })
}

// 地图三级 - 查询省
export function mapProvince(params){
  return request({
    url: '/admin_lmy/province_in',
    method: 'get',
    params
  })
}

// 地图三级 - 查询市
export function mapCity(params){
  return request({
    url: '/admin_lmy/city_in',
    method: 'get',
    params
  })
}

// 地图三级 - 查询区
export function mapArea(params){
  return request({
    url: '/admin_lmy/area_in',
    method: 'get',
    params
  })
}

// 省市区查询行政代码
export function mapCode(params){
  return request({
    url: '/admin_lmy/area_code',
    method: 'get',
    params
  })
}

// 批量操作
export function batchHandle(data){
  return request({
    url: '/admin_lmy/batch_operation',
    method: 'put',
    data
  })
}
