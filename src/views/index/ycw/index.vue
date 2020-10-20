<template>
  <div class="app-container">
    <el-row>
      <!-- 顶 -->
      <el-col :span="24" class="i-top-main">
        <div class="i-t-m-item" v-for="(t,t_idx) in iTList" :key="t_idx">
          <div class="i-t-m-i-mains">
            <img class="i-t-m-i-m-icon" :src="t.icon" alt="" srcset="">
            <div class="i-t-m-i-m-fonts">
              <div class="i-t-m-i-m-f-nums">
                <countTo :startVal='0' :decimals="t.posi" :endVal='t.nums' :duration='2000'></countTo>
              </div>
              <div class="i-t-m-i-m-f-fonts hiddenFonts">
                {{t.font}}
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 中 -->
      <el-col :span="24" class="i-mid-main margin">
        <!-- 左 -->
        <div class="i-m-m-left">
          <!-- 原料订单 -->
          <div class="i-m-m-l-data">
            <div class="i-m-m-l-d-title">
              <div class="i-m-m-l-d-t-icon">
                <div class="i-m-m-l-d-t-i-mains"></div>
              </div>
              <div class="i-m-m-l-d-t-name">
                原料订单
              </div>
            </div>
            <div class="i-m-m-l-d-mains">
              <div class="i-m-m-l-d-m-item"
                v-for="(g,g_idx) in gOrderList"
                :key="g_idx"
                @click="navTo(1,g_idx,g.nums)"
              >
                <div class="i-m-m-l-d-m-i-top">
                  {{g.nums}}
                </div>
                <div class="i-m-m-l-d-m-i-bom">
                  {{g.name}}
                </div>
              </div>
            </div>
          </div>
          <!-- 粉料订单 -->
          <div class="i-m-m-l-data margin">
            <div class="i-m-m-l-d-title">
              <div class="i-m-m-l-d-t-icon">
                <div class="i-m-m-l-d-t-i-mains"></div>
              </div>
              <div class="i-m-m-l-d-t-name">
                粉料订单
              </div>
            </div>
            <div class="i-m-m-l-d-mains">
              <div class="i-m-m-l-d-m-item"
                v-for="(g,g_idx) in pOrderList"
                :key="g_idx"
                @click="navTo(2,g_idx,g.nums)"
              >
                <div class="i-m-m-l-d-m-i-top">
                  {{g.nums}}
                </div>
                <div class="i-m-m-l-d-m-i-bom">
                  {{g.name}}
                </div>
              </div>
            </div>
          </div>
          <!-- 待办事项 -->
          <div class="i-m-m-l-data margin">
            <div class="i-m-m-l-d-title">
              <div class="i-m-m-l-d-t-icon">
                <div class="i-m-m-l-d-t-i-mains"></div>
              </div>
              <div class="i-m-m-l-d-t-name">
                待办事项
              </div>
            </div>
            <div class="i-m-m-l-d-mains">
              <div class="i-m-m-l-d-m-item"
                v-for="(g,g_idx) in wHandleList"
                :key="g_idx"
                @click="navTo(3,g_idx,g.nums)"
              >
                <div class="i-m-m-l-d-m-i-top">
                  {{g.nums}}
                </div>
                <div class="i-m-m-l-d-m-i-bom">
                  {{g.name}}
                </div>
              </div>
            </div>
          </div>
          <!-- 销售情况统计 -->
          <div class="i-m-m-l-data margin">
            <div class="i-m-m-l-d-title">
              <div class="i-m-m-l-d-t-icon">
                <div class="i-m-m-l-d-t-i-mains"></div>
              </div>
              <div class="i-m-m-l-d-t-name">
                销售情况统计
              </div>
            </div>
            <div class="i-m-m-l-d-mains">
              <div class="i-m-m-l-d-m-item"
                v-for="(g,g_idx) in saleList"
                :key="g_idx"
              >
                <div class="i-m-m-l-d-m-i-top">
                  {{g.nums}}
                </div>
                <div class="i-m-m-l-d-m-i-bom">
                  {{g.name}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右 -->
        <div class="i-m-m-right">
          <!-- 客户 -->
          <div class="i-m-m-r-info">
            <div class="i-m-m-r-i-top i-m-m-r-i-customer">
              <img src="@/assets/icon/icon_customer.png" alt="">
            </div>
            <div class="i-m-m-r-i-bom">
              <div class="i-m-m-r-i-b-item">
                <div class="i-m-m-r-i-b-i-top">
                  {{customerData.sumNum}}
                </div>
                <div class="i-m-m-r-i-b-i-fonts">
                  总客户数
                </div>
              </div>
              <div class="i-m-m-r-i-b-item">
                <div class="i-m-m-r-i-b-i-top">
                  {{customerData.weekUserNum}}
                </div>
                <div class="i-m-m-r-i-b-i-fonts">
                  本周新增客户数
                </div>
              </div>
            </div>
          </div>
          <!-- 订单 -->
          <div class="i-m-m-r-info margin">
            <div class="i-m-m-r-i-top i-m-m-r-i-order">
              <img src="@/assets/icon/icon_orders.png" alt="">
            </div>
            <div class="i-m-m-r-i-bom">
              <div class="i-m-m-r-i-b-item">
                <div class="i-m-m-r-i-b-i-top">
                  {{orderData.sumOrderNum}}
                </div>
                <div class="i-m-m-r-i-b-i-fonts">
                  总订单数
                </div>
              </div>
              <div class="i-m-m-r-i-b-item">
                <div class="i-m-m-r-i-b-i-top">
                  {{orderData.weekOrderNum}}
                </div>
                <div class="i-m-m-r-i-b-i-fonts">
                  本周订单数
                </div>
              </div>
            </div>
          </div>
          <!-- 销售额利润占比 -->
          <div class="i-m-m-r-canvas margin">
            <div class="i-m-m-r-c-top">
              <div class="i-m-m-l-d-title">
                <div class="i-m-m-l-d-t-icon">
                  <div class="i-m-m-l-d-t-i-mains"></div>
                </div>
                <div class="i-m-m-l-d-t-name hiddenFonts">
                  销售额利润占比
                </div>
              </div>
              <div class="i-m-m-r-c-t-right">
                <div class="i-m-m-r-c-t-r-left hiddenFonts">
                  选择月份
                </div>
                <div class="i-m-m-r-c-t-r-right">
                  <el-date-picker
                    v-model="monthValue"
                    type="month"
                    @change="getChangeValue"
                    value-format="yyyy-MM"
                    placeholder="选择月">
                  </el-date-picker>
                </div>
              </div>
            </div>
            <div class="i-m-m-r-c-canvas">
              <div class="i-m-m-r-c-c-mains" id="pieReport"></div>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 下 -->
      <el-col :span="24" class="i-bom-main margin">
        <div class="i-m-m-r-c-top">
          <div class="i-m-m-l-d-title">
            <div class="i-m-m-l-d-t-icon">
              <div class="i-m-m-l-d-t-i-mains"></div>
            </div>
            <div class="i-m-m-l-d-t-name hiddenFonts">
              订单总数统计
            </div>
          </div>
          <div class="i-m-m-r-c-t-right">
            <div class="i-m-m-r-c-t-r-left hiddenFonts">
              选择月份
            </div>
            <div class="i-m-m-r-c-t-r-right">
              <el-date-picker
                v-model="monthValue"
                type="month"
                @change="getChangeValue"
                value-format="yyyy-MM"
                placeholder="选择月">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="i-bom-m-canvas" id="crossReport"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import countTo from 'vue-count-to';
  import { ycwData } from '@/api/index';
  export default {
    components: { countTo },
    data() {
      return {
        // 顶部
        iTList: [
          {
            icon: require('@/assets/icon/icon_money.png'),
            nums: 0,
            font: '今日订单总金额(元)',
            posi: 2
          },
          {
            icon: require('@/assets/icon/icon_order.png'),
            nums: 0,
            font: '今日订单数(笔)',
            posi: 0
          },
          {
            icon: require('@/assets/icon/icon_visit.png'),
            nums: 0,
            font: '今日用户访问量(次)',
            posi: 0
          },
          {
            icon: require('@/assets/icon/icon_transaction.png'),
            nums: 0,
            font: '本月订单总金额(元)',
            posi: 2
          },
          {
            icon: require('@/assets/icon/icon_sales.png'),
            nums: 0,
            font: '本月总销量(笔)',
            posi: 0
          }
        ],
        // 原料
        gOrderList: [
          {
            nums: '0',
            name: '待付款订单'
          },
          {
            nums: '0',
            name: '待发货订单'
          },
          {
            nums: '0',
            name: '今日订单数'
          },
          {
            nums: '0',
            name: '今日销售额'
          },
          {
            nums: '0',
            name: '本月订单数'
          }
        ],
        // 粉料
        pOrderList: [
          {
            nums: '0',
            name: '待付款订单'
          },
          {
            nums: '0',
            name: '待发货订单'
          },
          {
            nums: '0',
            name: '今日订单数'
          },
          {
            nums: '0',
            name: '今日销售额'
          },
          {
            nums: '0',
            name: '本月订单数'
          }
        ],
        // 待办
        wHandleList: [
          {
            nums: '0',
            name: '待审核店铺'
          },
          {
            nums: '0',
            name: '待付款订单'
          },
          {
            nums: '0',
            name: '待发货订单'
          },
          {
            nums: '0',
            name: '售后待处理'
          }
        ],
        // 待办信息
        wHandleData: '',
        // 销售
        saleList: [
          {
            nums: '0',
            name: '昨日订单量'
          },
          {
            nums: '0',
            name: '昨日订单金额'
          },
          {
            nums: '0',
            name: '本月订单量'
          },
          {
            nums: '0',
            name: '本月订单金额'
          }
        ],
        // 客户
        customerData: '',
        // 订单
        orderData: '',
        // 月份
        monthValue: '',
        // 饼图
        chartsPie: "",
        // 饼图属性
        opinion: [],
        // 饼图值
        opinionData: [],
        // 折线图
        chartsCross: '',
        // 日期列表
        dateList: [],
        // 折线图数据
        lineData: []
      }
    },
    created(){
      let getYear = new Date().getFullYear()
      ,   getMonth = new Date().getMonth() + 1
      this.monthValue = getYear + '-' + getMonth
      this.getData('index')
      this.getData('sales_profit')
      this.getData('order_sum_statistics')
    },
    mounted() {
      // this.$nextTick(() => {
      //   this.drawPie("pieReport");
      //   this.drawCross('crossReport');
      // })
    },
    methods: {
      // 获取数据
      getData(type){
        let params = {
          data_type: type
        }
        ycwData(params).then(res=>{
          switch(type){
            case 'index':
              // 顶部
              this.iTList[0].nums = res.data.all_order.dayOrderMoney * 1
              this.iTList[1].nums = res.data.all_order.dayOrderNum * 1
              this.iTList[2].nums = res.data.all_order.todayVisitNum * 1
              this.iTList[3].nums = res.data.all_order.monthOrderMoney * 1
              this.iTList[4].nums = res.data.all_order.monthOrderNum * 1
              // 原料
              this.gOrderList[0].nums = res.data.raw_data.waitPayOrderNum
              this.gOrderList[1].nums = res.data.raw_data.waitSendOrderNum
              this.gOrderList[2].nums = res.data.raw_data.dayOrderNum
              this.gOrderList[3].nums = res.data.raw_data.dayOrderMoney
              this.gOrderList[4].nums = res.data.raw_data.monthOrderNum
              // 粉料
              this.pOrderList[0].nums = res.data.soup_data.waitPayOrderNum
              this.pOrderList[1].nums = res.data.soup_data.waitSendOrderNum
              this.pOrderList[2].nums = res.data.soup_data.dayOrderNum
              this.pOrderList[3].nums = res.data.soup_data.dayOrderMoney
              this.pOrderList[4].nums = res.data.soup_data.monthOrderNum
              // 待办
              this.wHandleList[0].nums = res.data.wait_hand.waitCheckShopNum
              this.wHandleList[1].nums = res.data.wait_hand.waitPayOrderNum
              this.wHandleList[2].nums = res.data.wait_hand.waitSendOrderNum
              this.wHandleList[3].nums = res.data.wait_hand.waitHandOrderNum
              this.wHandleData = res.data.wait_hand
              // 销售
              this.saleList[0].nums = res.data.sales_statistics.yesterDayOrderNum
              this.saleList[1].nums = res.data.sales_statistics.yesterDayOrderMoney
              this.saleList[2].nums = res.data.sales_statistics.monthOrderNum
              this.saleList[3].nums = res.data.sales_statistics.monthOrderMoney
              // 客户
              this.customerData = res.data.user_data
              // 订单
              this.orderData = res.data.order_data
            break;
            case 'sales_profit':
              this.opinion = res.data.opinion
              this.opinionData = res.data.opinionData
              this.$nextTick(() => {
                this.drawPie("pieReport");
              })
            break;
            case 'order_sum_statistics':
              this.dateList = res.data.cateGroup
              this.lineData = res.data.series
              this.$nextTick(() => {
                this.drawCross('crossReport');
              })
            break;
          }
        })
      },
      // 切换日期
      getChangeValue(){
        console.log(this.monthValue)
      },
      // 饼图
      drawPie(id) {
        this.chartsPie = this.$echarts.init(document.getElementById(id));
        this.chartsPie.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{a}<br/>{b}:{c} ({d}%)"
          },
          legend: {
            bottom: 10,
            left: "center",
            data: this.opinion
          },
          series: [
            {
              name: "详情",
              type: "pie",
              radius: "65%",
              center: ["50%", "50%"],
              avoidLabelOverlap: false,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                },
                color: function(params) {
                  //自定义颜色
                  var colorList = ["#52CCA3", "#F8C328"];
                  return colorList[params.dataIndex];
                }
              },
              data: this.opinionData
            }
          ]
        });
      },
      // 线图
      drawCross(id){
        this.chartsCross = this.$echarts.init(document.getElementById(id));
        this.chartsCross.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['粉料订单', '原料订单']
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: this.dateList
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            // this.lineData
            {
              name: '粉料订单',
              type: 'line',
              stack: '总量',
              data: [120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210,220, 182, 191, 234, 290, 330, 310,280,290,300]
            },
            {
              name: '原料订单',
              type: 'line',
              stack: '总量',
              data: [100, 182, 191, 300, 290, 330, 310,220, 182, 191, 234, 290, 330, 310,220, 182, 191, 234, 290, 330, 310,220, 182, 191, 234, 290, 330, 310,300,290,280]
            }
          ],
          color: ['#52CCA3','#6D93FF','#000000']
        })
      },
      // 跳转
      navTo(type,index,nums){
        let query
        switch(type){
          case 1:
            switch(index){
              case 0:
                query = {type: 2}
                break;
              case 1:
                query = {type: 3}
                break;
            }
            if(nums === 0){}else{
              this.$router.push({
                path: '/purchase/order/goodsOrder',
                query
              })
            }
            break;
          case 2:
            switch(index){
              case 0:
                query = {type: 2}
                break;
              case 1:
                query = {type: 3}
                break;
            }
            if(nums === 0){}else{
              this.$router.push({
                path: '/purchase/order/powderOrder',
                query
              })
            }
            break;
          case 3:
            switch(index){
              case 0:
                if(nums === 0){}else{
                  this.$router.push({ path: '/purchase/store/storeList' })
                }
                break;
              case 1:
                if(this.wHandleData.waitPayOrderType == 0){}else if(this.wHandleData.waitPayOrderType == 1){
                  query = {type: 2}
                  this.$router.push({
                    path: '/purchase/order/goodsOrder',
                    query
                  })
                }else if(this.wHandleData.waitPayOrderType == 2){
                  query = {type: 2}
                  this.$router.push({
                    path: '/purchase/order/powderOrder',
                    query
                  })
                }
                break;
              case 2:
                query = {type: 3}
                if(this.wHandleData.waitSendType == 0){}else if(this.wHandleData.waitSendType == 1){
                  this.$router.push({
                    path: '/purchase/order/goodsOrder',
                    query
                  })
                }else if(this.wHandleData.waitSendType == 2){
                  this.$router.push({
                    path: '/purchase/order/powderOrder',
                    query
                  })
                }
                break;
              case 3:
                if(nums === 0){}else{
                  query = {type: 6}
                  this.$router.push({
                    path: '/purchase/order/goodsOrder',
                    query
                  })
                }
                break;
            }
            break;
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
  .i-top-main{
    display: flex;
    justify-content: space-between;
    .i-t-m-item{
      width: 19%;
      height: 120px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #FFF;
      border-radius: 4px;
      box-shadow: 0 1px 4px rgba(0,0,0,.08);
      .i-t-m-i-mains{
        width: 82%;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .i-t-m-i-m-icon{
          width: 24%;
        }
        .i-t-m-i-m-fonts{
          width: 66%;
          height: 70px;
          .i-t-m-i-m-f-nums{
            height: 36px;
            line-height: 36px;
            font-size: 24px;
            font-weight: 600;
          }
          .i-t-m-i-m-f-fonts{
            height: 34px;
            font-size: 14px;
            line-height: 34px;
            color: rgba(51,51,51,.5);
          }
        }
      }
    }
  }
  .i-mid-main{
    display: flex;
    justify-content: space-between;
    .i-m-m-left{
      width: 59.5%;
      .i-m-m-l-data{
        background-color: #FFF;
        border-radius: 4px;
        box-shadow: 0 1px 4px rgba(0,0,0,.08);
        .i-m-m-l-d-title{
          height: 50px;
          border-bottom: 1px solid #EEEEEE;
          display: flex;
          .i-m-m-l-d-t-icon{
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            .i-m-m-l-d-t-i-mains{
              width: 10px;
              height: 10px;
              background-color: #3CB371;
              border-radius: 50%;
            }
          }
          .i-m-m-l-d-t-name{
            height: 50px;
            line-height: 50px;
            font-size: 18px;
            font-weight: 600;
          }
        }
        .i-m-m-l-d-mains{
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          .i-m-m-l-d-m-item{
            width: 20%;
            cursor: pointer;
            .i-m-m-l-d-m-i-top{
              height: 60px;
              line-height: 70px;
              font-size: 22px;
              text-align: center;
              color: #3CB371;
              font-weight: 600;
            }
            .i-m-m-l-d-m-i-bom{
              height: 40px;
              text-align: center;
              font-size: 14px;
              color: rgba(51,51,51,.5);
            }
          }
        }
      }
    }
    .i-m-m-right{
      width: 39.25%;
      .i-m-m-r-info{
        background-color: #FFF;
        border-radius: 4px;
        box-shadow: 0 1px 4px rgba(0,0,0,.08);
        overflow: hidden;
        .i-m-m-r-i-top{
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          img{
            width: 50px;
            height: 50px;
          }
        }
        .i-m-m-r-i-customer{
          background-image: linear-gradient(to right, #38D274 , #33A968);
        }
        .i-m-m-r-i-order{
          background-image: linear-gradient(to right, #F8C926 , #F99636);
        }
        .i-m-m-r-i-bom{
          display: flex;
          justify-content: center;
          .i-m-m-r-i-b-item{
            width: 40%;
            height: 80px;
            text-align: center;
            .i-m-m-r-i-b-i-top{
              height: 40px;
              line-height: 40px;
              font-size: 20px;
              font-weight: 600;
            }
            .i-m-m-r-i-b-i-fonts{
              font-size: 14px;
              color: rgba(51,51,51,.5);
            }
          }
        }
      }
      .i-m-m-r-canvas{
        // height: 316px;
        border-radius: 4px;
        box-shadow: 0 1px 4px rgba(0,0,0,.08);
        background-color: #FFF;
        .i-m-m-r-c-top{
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #EEEEEE;
          .i-m-m-l-d-title{
            height: 50px;
            display: flex;
            .i-m-m-l-d-t-icon{
              width: 50px;
              height: 50px;
              display: flex;
              align-items: center;
              justify-content: center;
              .i-m-m-l-d-t-i-mains{
                width: 10px;
                height: 10px;
                background-color: #3CB371;
                border-radius: 50%;
              }
            }
            .i-m-m-l-d-t-name{
              height: 50px;
              line-height: 50px;
              font-size: 18px;
              font-weight: 600;
            }
          }
          .i-m-m-r-c-t-right{
            display: flex;
            align-items: center;
            .i-m-m-r-c-t-r-left{
              font-size: 14px;
              color: rgba(51,51,51,.5);
            }
            .i-m-m-r-c-t-r-right{
              margin: 0 20px 0 10px;
            }
          }
        }
        .i-m-m-r-c-canvas{
          height: 266px;
          display: flex;
          align-items: center;
          justify-content: center;
          .i-m-m-r-c-c-mains{
            width: 90%;
            height: 220px;
          }
        }
      }
    }
  }
  .i-bom-main{
    height: 400px;
    background-color: #FFF;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,0,0,.08);
    .i-m-m-r-c-top{
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #EEEEEE;
      .i-m-m-l-d-title{
        height: 50px;
        display: flex;
        .i-m-m-l-d-t-icon{
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          .i-m-m-l-d-t-i-mains{
            width: 10px;
            height: 10px;
            background-color: #3CB371;
            border-radius: 50%;
          }
        }
        .i-m-m-l-d-t-name{
          height: 50px;
          line-height: 50px;
          font-size: 18px;
          font-weight: 600;
        }
      }
      .i-m-m-r-c-t-right{
        display: flex;
        align-items: center;
        .i-m-m-r-c-t-r-left{
          font-size: 14px;
          color: rgba(51,51,51,.5);
        }
        .i-m-m-r-c-t-r-right{
          margin: 0 20px 0 10px;
        }
      }
    }
    .i-bom-m-canvas{
      width: 98%;
      height: 330px;
      margin: 10px auto 0;
    }
  }
  .margin{
    margin-top: 16px;
  }
</style>