import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

  {
    path: '/',
    redirect: '/home/ycw',
    hidden: true
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/home',
    component: Layout,
    redirect: '/home/ycw',
    meta: { title: '首页', icon: 'index' },
    children: [
      {
        path: 'ycw',
        name: 'ycw',
        component: () => import('@/views/index/ycw/index'),
        meta: { title: '伊餐网', icon: 'ui_ycw' }
      },
      {
        path: 'operate',
        name: 'Operate',
        component: () => import('@/views/index/operate/index'),
        meta: { title: '运营', icon: 'ui_operate' }
      }
    ]
  },

  {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/store/storeList',
    name: 'Purchase',
    meta: { title: '采购', icon: 'purchase' },
    children: [
      {
        path: 'store',
        name: 'Store',
        component: () => import('@/views/purchase/index'),
        meta: { title: '店铺管理', icon: 'icon_store' },
        redirect: '/purchase/store/storeList',
        children: [
          {
            path: 'storeList',
            component: () => import('@/views/purchase/store/storeList'),
            name: 'StoreList',
            meta: { title: '店铺列表' }
          }
        ]
      },
      {
        path: 'applets',
        name: 'Applets',
        component: () => import('@/views/purchase/index'),
        meta: { title: '小程序管理', icon: 'icon_applets' },
        redirect: '/purchase/applets/banner',
        children: [
          {
            path: 'banner',
            component: () => import('@/views/purchase/applets/banner'),
            name: 'Banner',
            meta: { title: '轮播图管理' }
          },
          {
            path: 'video',
            component: () => import('@/views/purchase/applets/video'),
            name: 'Video',
            meta: { title: '视频管理' }
          }
        ]
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/purchase/index'),
        meta: { title: '用户管理', icon: 'icon_user' },
        redirect: '/purchase/user/userList',
        children: [
          {
            path: 'userList',
            component: () => import('@/views/purchase/user/userList'),
            name: 'UserList',
            meta: { title: '用户列表' }
          },
          {
            path: 'userLevel',
            component: () => import('@/views/purchase/user/userLevel'),
            name: 'UserLevel',
            meta: { title: '用户等级' }
          },
          {
            path: 'userTag',
            component: () => import('@/views/purchase/user/userTag'),
            name: 'UserTag',
            meta: { title: '用户标签' }
          }
        ]
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('@/views/purchase/index'),
        meta: { title: '产品管理', icon: 'icon_product' },
        redirect: '/purchase/goods/goodsManage',
        children: [
          {
            path: 'goodsManage',
            component: () => import('@/views/purchase/goods/goodsManage'),
            name: 'GoodsManage',
            meta: { title: '商品管理' }
          },
          {
            path: 'powderManage',
            component: () => import('@/views/purchase/goods/powderManage'),
            name: 'PowderManage',
            meta: { title: '粉料管理' }
          },
          {
            path: 'productClass',
            component: () => import('@/views/purchase/goods/productClass'),
            name: 'ProductClass',
            meta: { title: '产品分类' }
          },
          {
            path: 'productComment',
            component: () => import('@/views/purchase/goods/productComment'),
            name: 'ProductComment',
            meta: { title: '产品评论' }
          }
        ]
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/purchase/index'),
        meta: { title: '订单管理', icon: 'icon_order' },
        redirect: '/purchase/order/goodsOrder',
        children: [
          {
            path: 'goodsOrder',
            component: () => import('@/views/purchase/order/goodsOrder'),
            name: 'GoodsOrder',
            meta: { title: '原料订单' }
          },
          {
            path: 'powderOrder',
            component: () => import('@/views/purchase/order/powderOrder'),
            name: 'PowderOrder',
            meta: { title: '粉料订单' }
          }
        ]
      },
      {
        path: 'assets',
        name: 'Assets',
        component: () => import('@/views/purchase/index'),
        meta: { title: '资产管理', icon: 'icon_assets' },
        redirect: '/purchase/assets/recharge',
        children: [
          {
            path: 'recharge',
            component: () => import('@/views/purchase/assets/recharge'),
            name: 'Recharge',
            meta: { title: '充值记录' }
          },
          {
            path: 'consumption',
            component: () => import('@/views/purchase/assets/consumption'),
            name: 'Consumption',
            meta: { title: '消费记录' }
          },
          {
            path: 'integral',
            component: () => import('@/views/purchase/assets/integral'),
            name: 'Integral',
            meta: { title: '积分记录' }
          }
        ]
      },
      {
        path: 'data',
        name: 'Data',
        component: () => import('@/views/purchase/index'),
        meta: { title: '数据统计', icon: 'icon_data' },
        redirect: '/purchase/data/analysis',
        children: [
          {
            path: 'analysis',
            component: () => import('@/views/purchase/data/analysis'),
            name: 'Analysis',
            meta: { title: '销售统计' }
          },
          {
            path: 'productData',
            component: () => import('@/views/purchase/data/productData'),
            name: 'ProductData',
            meta: { title: '原料销售统计' }
          },
          {
            path: 'powderData',
            component: () => import('@/views/purchase/data/powderData'),
            name: 'PowderData',
            meta: { title: '粉料销售统计' }
          },
          {
            path: 'userData',
            component: () => import('@/views/purchase/data/userData'),
            name: 'UserData',
            meta: { title: '用户消费统计' }
          }
        ]
      }
    ]
  },

  // {
  //   path: '/order',
  //   component: Layout,
  //   name: 'Order',
  //   meta: { title: '点餐', icon: 'order' },
  //   redirect: '/order/oUser',
  //   children: [
  //     {
  //       path: 'oUser',
  //       name: 'oUser',
  //       component: () => import('@/views/404'),
  //       meta: { title: '用户端', icon: 'user' }
  //     },
  //     {
  //       path: 'oBusiness',
  //       name: 'oBusiness',
  //       component: () => import('@/views/404'),
  //       meta: { title: '商家端', icon: 'icon_store' }
  //     }
  //   ]
  // },

  {
    path: '/operate',
    component: Layout,
    redirect: '/operate/customer/customerDistribution',
    name: 'Operate',
    meta: { title: '运营', icon: 'operate' },
    children: [
      {
        path: 'transaction',
        name: 'Transaction',
        component: () => import('@/views/operate/index'),
        meta: { title: '交易排行', icon: 'transaction' },
        redirect: '/operate/transaction/transactionRanking',
        children: [
          {
            path: 'transactionRanking',
            component: () => import('@/views/operate/transaction/transactionRanking'),
            name: 'TransactionRanking',
            meta: { title: '地区交易排行' }
          },
          {
            path: 'regionalRanking',
            component: () => import('@/views/operate/transaction/regionalRanking'),
            name: 'RegionalRanking',
            meta: { title: '省份交易排行' }
          }
        ]
      },
      {
        path: 'customer',
        name: 'Customer',
        component: () => import('@/views/operate/index'),
        meta: { title: '客户分布', icon: 'customer' },
        redirect: '/operate/customer/customerDistributionMap',
        children: [
          {
            path: 'customerDistributionMap',
            component: () => import('@/views/operate/customer/customerDistributionMap'),
            name: 'CustomerDistribution',
            meta: { title: '客户分布图' }
          },
          {
            path: 'customerDistributionData',
            component: () => import('@/views/operate/customer/customerDistributionData'),
            name: 'CustomerDistribution',
            meta: { title: '客户分布数据列表' }
          }
        ]
      },
      {
        path: 'clue',
        name: 'Clue',
        component: () => import('@/views/operate/index'),
        meta: { title: '销售线索', icon: 'clue' },
        redirect: '/operate/clue/targetCustomers',
        children: [
          {
            path: 'targetCustomers',
            component: () => import('@/views/operate/clue/targetCustomers'),
            name: 'TargetCustomers',
            meta: { title: '目标客户线索' }
          },
          {
            path: 'productRepurchase',
            component: () => import('@/views/operate/clue/productRepurchase'),
            name: 'ProductRepurchase',
            meta: { title: '产品复购线索' }
          },
          {
            path: 'portfolioSales',
            component: () => import('@/views/operate/clue/portfolioSales'),
            name: 'PortfolioSales',
            meta: { title: '组合销售线索' }
          },
          {
            path: 'customerChurn',
            component: () => import('@/views/operate/clue/customerChurn'),
            name: 'customerChurn',
            meta: { title: '客户流失线索' }
          }
        ]
      }
    ]
  },

  {
    path: '/community',
    component: Layout,
    redirect: '/community/view/vBanner',
    name: 'Community',
    meta: { title: '社区', icon: 'community' },
    children: [
      {
        path: 'view',
        name: 'View',
        component: () => import('@/views/community/index'),
        meta: { title: '视图管理', icon: 'picture' },
        redirect: '/community/view/vBanner',
        children: [
          {
            path: 'vBanner',
            component: () => import('@/views/community/view/banner'),
            name: 'VBanner',
            meta: { title: '社区轮播' }
          }
        ]
      },
      {
        path: 'circle',
        name: 'Circle',
        component: () => import('@/views/community/index'),
        meta: { title: '圈子', icon: 'icon_circle' },
        redirect: '/community/circle/postManage',
        children: [
          {
            path: 'postManage',
            component: () => import('@/views/community/circle/postManage'),
            name: 'PostManage',
            meta: { title: '发帖管理' }
          },
          {
            path: 'tagManage',
            component: () => import('@/views/community/circle/tagManage'),
            name: 'TagManage',
            meta: { title: '帖子分类' }
          },
          {
            path: 'sensitiveWords',
            component: () => import('@/views/community/circle/sensitiveWords'),
            name: 'SensitiveWords',
            meta: { title: '敏感词管理' }
          },
          {
            path: 'blacklistManage',
            component: () => import('@/views/community/circle/blacklistManage'),
            name: 'blacklistManage',
            meta: { title: '黑名单管理' }
          }
        ]
      },
      {
        path: 'college',
        name: 'College',
        component: () => import('@/views/community/index'),
        meta: { title: '学院', icon: 'icon_college' },
        redirect: '/community/college/videoClass',
        children: [
          {
            path: 'videoClass',
            component: () => import('@/views/community/college/videoClass'),
            name: 'VideoClass',
            meta: { title: '视频分类' }
          },
          {
            path: 'videoManage',
            component: () => import('@/views/community/college/videoManage'),
            name: 'VideoManage',
            meta: { title: '视频管理' }
          },
          {
            path: 'commentManage',
            component: () => import('@/views/community/college/commentManage'),
            name: 'CommentManage',
            meta: { title: '评论管理' }
          }
        ]
      }
    ]
  },

  {
    path: '/set',
    component: Layout,
    redirect: '/set/basicsSet/freight',
    name: 'Set',
    meta: { title: '设置', icon: 'set' },
    children: [
      {
        path: 'basicsSet',
        name: 'BasicsSet',
        component: () => import('@/views/set/index'),
        meta: { title: '基础设置', icon: 'icon_basic' },
        redirect: '/set/basicsSet/freight',
        children: [
          {
            path: 'freight',
            component: () => import('@/views/set/basicsSet/freight'),
            name: 'Freight',
            meta: { title: '运费设置' }
          },
          {
            path: 'rechargeSet',
            component: () => import('@/views/set/basicsSet/rechargeSet'),
            name: 'RechargeSet',
            meta: { title: '充值设置' }
          },
          {
            path: 'currency',
            component: () => import('@/views/set/basicsSet/currency'),
            name: 'Currency',
            meta: { title: '通用设置' }
          }
        ]
      },
      {
        path: 'system',
        name: 'System',
        component: () => import('@/views/set/index'),
        meta: { title: '系统设置', icon: 'icon_system' },
        redirect: '/set/system/adminLog',
        children: [
          {
            path: 'adminLog',
            component: () => import('@/views/set/system/adminLog'),
            name: 'AdminLog',
            meta: { title: '管理日志' }
          },
          {
            path: 'admin',
            component: () => import('@/views/set/system/admin'),
            name: 'Admin',
            meta: { title: '管理员' }
          },
          {
            path: 'roleManage',
            component: () => import('@/views/set/system/roleManage'),
            name: 'RoleManage',
            meta: { title: '角色设置' }
          }
        ]
      }
    ]
  }
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
