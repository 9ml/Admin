import request from '@/utils/request'

// 运费模板列表
export function freightList(params){
  return request({
    url: '/admin/freight_template',
    method: 'get',
    params
  })
}

// 添加运费模板
export function addFreight(data){
  return request({
    url: '/admin/freight_template',
    method: 'post',
    data
  })
}

// 修改运费模板
export function updateFreight(data){
  return request({
    url: '/admin/freight_template',
    method: 'put',
    data
  })
}

// 删除运费模板
export function delFreight(data){
  return request({
    url: '/admin/freight_template',
    method: 'delete',
    data
  })
}

// 配送区域列表
export function freightRegion(){
  return request({
    url: '/admin/region_province',
    method: 'get'
  })
}

// 添加配送区域
export function addFreightRegion(data){
  return request({
    url: '/admin/freight_template_config',
    method: 'post',
    data
  })
}

// 修改配送区域
export function updateFreightRegion(data){
  return request({
    url: '/admin/freight_template_config',
    method: 'put',
    data
  })
}

// 删除配送区域
export function delFreightRegion(data){
  return request({
    url: '/admin/freight_template_config',
    method: 'delete',
    data
  })
}

// 充值设置列表
export function rechargeSetList(params){
  return request({
    url: '/admin/recharge_config',
    method: 'get',
    params
  })
}

// 添加充值设置
export function addRechargeSet(data){
  return request({
    url: '/admin/recharge_config',
    method: 'post',
    data: data
  })
}

// 编辑充值设置
export function updateRechargeSet(data){
  return request({
    url: '/admin/recharge_config',
    method: 'put',
    data: data
  })
}

// 删除充值设置
export function delRechargeSet(data){
  return request({
    url: '/admin/recharge_config',
    method: 'delete',
    data: data
  })
}

// 通用设置信息
export function currencyInfo(params){
  return request({
    url: '/admin/base_info',
    method: 'get',
    params
  })
}

// 修改通用设置
export function updateCurrency(data){
  return request({
    url: '/admin/base_info',
    method: 'put',
    data
  })
}

// 管理日志列表
export function adminLogList(params){
  return request({
    url: '/admin/admin_log',
    method: 'get',
    params
  })
}

// 管理员列表
export function adminList(params){
  return request({
    url: '/admin/admin',
    method: 'get',
    params
  })
}

// 添加管理员
export function addAdmin(data){
  return request({
    url: '/admin/admin',
    method: 'post',
    data: data
  })
}

// 编辑管理员
export function updateAdmin(data){
  return request({
    url: '/admin/admin',
    method: 'put',
    data: data
  })
}

// 删除管理员
export function delAdmin(data){
  return request({
    url: '/admin/admin',
    method: 'delete',
    data: data
  })
}

// 角色列表
export function roleList(params){
  return request({
    url: '/admin/role',
    method: 'get',
    params
  })
}

// 添加角色
export function addRole(data){
  return request({
    url: '/admin/role',
    method: 'post',
    data: data
  })
}

// 编辑角色
export function updateRole(data){
  return request({
    url: '/admin/role',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(data){
  return request({
    url: '/admin/role',
    method: 'delete',
    data: data
  })
}

// 权限列表
export function getRoleList(params){
  return request({
    url: '/admin/role_access',
    method: 'get',
    params
  })
}

// 修改权限
export function updateGetRoleList(data){
  return request({
    url: '/admin/role_access',
    method: 'put',
    data
  })
}
