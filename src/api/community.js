import request from '@/utils/request'

// 社区轮播列表
export function bannerList(params){
  return request({
    url: '/admin/banner_sq',
    method: 'get',
    params
  })
}

// 新增社区轮播
export function addBanner(data){
  return request({
    url: '/admin/banner_sq',
    method: 'post',
    data: data
  })
}

// 新增社区轮播
export function updateBanner(data){
  return request({
    url: '/admin/banner_sq',
    method: 'put',
    data
  })
}

// 删除社区轮播
export function delBanner(data){
  return request({
    url: '/admin/banner_sq',
    method: 'delete',
    data: data
  })
}

// 帖子列表
export function postList(params){
  return request({
    url: '/admin/cards',
    method: 'get',
    params
  })
}

// 封贴
export function sealPost(data){
  return request({
    url: '/admin/cards',
    method: 'put',
    data
  })
}

// 帖子分类列表
export function circleClassList(params){
  return request({
    url: '/admin/community_label',
    method: 'get',
    params
  })
}

// 添加帖子分类
export function addCircleClass(data){
  return request({
    url: '/admin/community_label',
    method: 'post',
    data: data
  })
}

// 修改帖子分类
export function updateCircleClass(data){
  return request({
    url: '/admin/community_label',
    method: 'put',
    data
  })
}

// 删除帖子分类
export function delCircleClass(data){
  return request({
    url: '/admin/community_label',
    method: 'delete',
    data
  })
}

// 敏感词列表
export function sensitiveWordsList(params){
  return request({
    url: '/admin/filter_words',
    method: 'get',
    params
  })
}

// 新增敏感词
export function addSensitiveWords(data){
  return request({
    url: '/admin/filter_words',
    method: 'post',
    data: data
  })
}

// 修改敏感词
export function updateSensitiveWords(data){
  return request({
    url: '/admin/filter_words',
    method: 'put',
    data
  })
}

// 删除敏感词
export function delSensitiveWords(data){
  return request({
    url: '/admin/filter_words',
    method: 'delete',
    data
  })
}

// 黑名单列表
export function blackList(params){
  return request({
    url: '/admin/blacklist',
    method: 'get',
    params
  })
}

// 添加黑名单
export function addBlackList(data){
  return request({
    url: '/admin/blacklist',
    method: 'post',
    data: data
  })
}

// 编辑黑名单
export function updateBlackList(data){
  return request({
    url: '/admin/blacklist',
    method: 'put',
    data
  })
}

// 移除黑名单
export function delBlackList(data){
  return request({
    url: '/admin/blacklist',
    method: 'delete',
    data
  })
}

// 视频分类列表
export function videoClassList(params){
  return request({
    url: '/admin/college_type',
    method: 'get',
    params
  })
}

// 添加视频分类
export function addVideoClass(data){
  return request({
    url: '/admin/college_type',
    method: 'post',
    data: data
  })
}

// 编辑视频分类
export function updateVideoClass(data){
  return request({
    url: '/admin/college_type',
    method: 'put',
    data: data
  })
}

// 删除视频分类
export function delVideoClass(data){
  return request({
    url: '/admin/college_type',
    method: 'delete',
    data: data
  })
}

// 视频列表
export function videoList(params){
  return request({
    url: '/admin/college_video',
    method: 'get',
    params
  })
}

// 添加视频
export function addVideo(data){
  return request({
    url: '/admin/college_video',
    method: 'post',
    data: data
  })
}

// 编辑视频
export function updateVideo(data){
  return request({
    url: '/admin/college_video',
    method: 'put',
    data: data
  })
}

// 删除视频
export function delVideo(data){
  return request({
    url: '/admin/college_video',
    method: 'delete',
    data: data
  })
}

// 评论列表
export function commentList(params){
  return request({
    url: '/admin/college_video_review',
    method: 'get',
    params
  })
}

// 回复评论
export function replayComment(data){
  return request({
    url: '/admin/college_video_review',
    method: 'put',
    data
  })
}

// 删除评论
export function delComment(data){
  return request({
    url: '/admin/college_video_review',
    method: 'delete',
    data
  })
}
