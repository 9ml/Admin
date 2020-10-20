import request from '@/utils/request'

// 省市区数据
export function provincesList(){
  return request({
    url: '/admin/citys',
    method: 'get'
  })
}

// 店铺列表
export function storeList(params){
  return request({
    url: '/admin/shop',
    method: 'get',
    params
  })
}

// 店铺审核
export function storeExamine(data){
  return request({
    url: '/admin/shop',
    method: 'put',
    data
  })
}

// 轮播列表
export function bannerList(params){
  return request({
    url: '/admin/banner_yl',
    method: 'get',
    params
  })
}

// 修改轮播图启用状态
export function bannerUserStatus(data){
  return request({
    url: '/admin/shortcuts',
    method: 'put',
    data
  })
}
// 获取七牛云 token
export function getQiNiuToken(){
  return request({
    url: '/admin/qiniu_token',
    method: 'get'
  })
}

// 添加轮播图
export function addBanner(data){
  return request({
    url: '/admin/banner_yl',
    method: 'post',
    data: data
  })
}

// 编辑轮播图
export function updateBanner(data){
  return request({
    url: '/admin/banner_yl',
    method: 'put',
    data
  })
}

// 删除轮播图
export function delBanner(data){
  return request({
    url: '/admin/banner_yl',
    method: 'delete',
    data: data
  })
}

// 视频列表
export function videoList(params){
  return request({
    url: '/admin/video_yl',
    method: 'get',
    params
  })
}

// 添加视频
export function addVideo(data){
  return request({
    url: '/admin/video_yl',
    method: 'post',
    data: data
  })
}

// 编辑视频
export function updateVideo(data){
  return request({
    url: '/admin/video_yl',
    method: 'put',
    data
  })
}

// 删除视频
export function delVideo(data){
  return request({
    url: '/admin/video_yl',
    method: 'delete',
    data: data
  })
}

// 用户列表
export function userList(params){
  return request({
    url: '/admin/member',
    method: 'get',
    params
  })
}

// 用户标签组
export function userGroup(params){
  return request({
    url: '/admin/screen',
    method: 'get',
    params
  })
}

// 修改用户等级 / 标签
export function updateUserLevelAndTag(data){
  return request({
    url: '/admin/member',
    method: 'put',
    data
  })
}

// 用户收货地址
export function userAddress(params){
  return request({
    url: '/admin/address',
    method: 'get',
    params
  })
}

// 用户充值记录
export function userRechargeDetails(params){
  return request({
    url: '/admin/recharge',
    method: 'get',
    params
  })
}

// 用户消费记录
export function userConsumeDetails(params){
  return request({
    url: '/admin/flow_log',
    method: 'get',
    params
  })
}

// 用户等级列表
export function userLevelList(params){
  return request({
    url: '/admin/level',
    method: 'get',
    params
  })
}

// 添加用户等级
export function addUserLevel(data){
  return request({
    url: '/admin/level',
    method: 'post',
    data: data
  })
}

// 修改用户等级
export function updateUserLevel(data){
  return request({
    url: '/admin/level',
    method: 'put',
    data
  })
}

// 删除用户等级
export function delUserLevel(data){
  return request({
    url: '/admin/level',
    method: 'delete',
    data
  })
}

// 用户标签列表
export function userTagList(params){
  return request({
    url: '/admin/label',
    method: 'get',
    params
  })
}

// 添加用户标签
export function addUserTag(data){
  return request({
    url: '/admin/label',
    method: 'post',
    data: data
  })
}

// 修改用户标签
export function updateUserTag(data){
  return request({
    url: '/admin/label',
    method: 'put',
    data
  })
}

// 删除用户标签
export function delUserTag(data){
  return request({
    url: '/admin/label',
    method: 'delete',
    data
  })
}

// 充值记录
export function rechargeRecord(params){
  return request({
    url: '/admin/recharge',
    method: 'get',
    params
  })
}

// 资产类型
export function assetsTypes(params){
  return request({
    url: '/admin/screen',
    method: 'get',
    params
  })
}

// 消费记录列表
export function consumptionList(params){
  return request({
    url: '/admin/flow_log',
    method: 'get',
    params
  })
}

// 积分记录列表
export function integralList(params){
  return request({
    url: '/admin/integral_log',
    method: 'get',
    params
  })
}

// 数据统计
export function dataList(params){
  return request({
    url: '/admin/data',
    method: 'get',
    params
  })
}

// 分类列表
export function cateList(params){
  return request({
    url: '/admin/cate',
    method: 'get',
    params
  })
}

// 新增分类
export function addCate(data){
  return request({
    url: '/admin/cate',
    method: 'post',
    data
  })
}

// 编辑分类
export function updateCate(data){
  return request({
    url: '/admin/cate',
    method: 'put',
    data
  })
}

// 删除分类
export function delCate(data){
  return request({
    url: '/admin/cate',
    method: 'delete',
    data
  })
}

// 评论列表
export function commentList(params){
  return request({
    url: '/admin/product_reviews',
    method: 'get',
    params
  })
}

// 评论列表
export function replayComment(data){
  return request({
    url: '/admin/product_reviews',
    method: 'put',
    data
  })
}

// 删除评论
export function delComment(data){
  return request({
    url: '/admin/product_reviews',
    method: 'delete',
    data
  })
}

// 商品列表
export function goodsList(params){
  return request({
    url: '/admin/product_yl',
    method: 'get',
    params
  })
}

// 添加组合
export function addCombination(data){
  return request({
    url: '/admin/product_att',
    method: 'post',
    data
  })
}

// 修改组合
export function updateCombination(data){
  return request({
    url: '/admin/product_att',
    method: 'put',
    data
  })
}

// 删除组合
export function delCombination(data){
  return request({
    url: '/admin/product_att',
    method: 'delete',
    data
  })
}

// 添加商品
export function addGoods(data){
  return request({
    url: '/admin/product_yl',
    method: 'post',
    data
  })
}

// 修改商品
export function updateGoods(data){
  return request({
    url: '/admin/product_yl',
    method: 'put',
    data
  })
}

// 删除商品
export function delGoods(data){
  return request({
    url: '/admin/product_yl',
    method: 'delete',
    data
  })
}

// 粉料列表
export function powderList(params){
  return request({
    url: '/admin/product_tl',
    method: 'get',
    params
  })
}

// 添加粉料
export function addPowder(data){
  return request({
    url: '/admin/product_tl',
    method: 'post',
    data
  })
}

// 修改粉料
export function updatePowder(data){
  return request({
    url: '/admin/product_tl',
    method: 'put',
    data
  })
}

// 删除粉料
export function delPowder(data){
  return request({
    url: '/admin/product_tl',
    method: 'delete',
    data
  })
}

// 原料订单
export function gOrder(params){
  return request({
    url: '/admin/raw_order',
    method: 'get',
    params
  })
}

// 订单物流
export function orderLogistics(params){
  return request({
    url: '/admin/logistics',
    method: 'get',
    params
  })
}

// 物流公司
export function logisticsList(){
  return request({
    url: '/admin/express_company',
    method: 'get'
  })
}

// 原料订单操作
export function oHandleGoods(data){
  return request({
    url: '/admin/raw_order',
    method: 'put',
    data
  })
}

// 订单日志
export function orderLog(params){
  return request({
    url: '/admin/order_log',
    method: 'get',
    params
  })
}

// 粉料订单
export function pOrder(params){
  return request({
    url: '/admin/soup_order',
    method: 'get',
    params
  })
}

// 粉料订单操作
export function oHandlePowder(data){
  return request({
    url: '/admin/soup_order',
    method: 'put',
    data
  })
}

// 批量操作
export function batchHandle(data){
  return request({
    url: '/admin/batch_operation',
    method: 'put',
    data
  })
}
