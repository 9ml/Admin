<template>
  <div class="app-container">
    <el-row>
      <el-col class="oi-top" :span="24">
        <div class="oi-t-item box-shadow">
          <div class="oi-t-i-mains">
            <div class="oi-t-i-m-info">
              <div class="oi-t-i-m-i-title">
                今日支付金额
              </div>
              <div class="oi-t-i-m-i-nums">
                ￥ <countTo :startVal='0' :decimals="2" :endVal='todayPrice' :duration='2000'></countTo>
              </div>
            </div>
            <div class="oi-t-i-m-icon">
              <img src="@/assets/icon/icon_operate_money.png" alt="" srcset="">
            </div>
          </div>
        </div>
        <div class="oi-t-item box-shadow">
          <div class="oi-t-i-mains oi-t-i-order">
            <div class="oi-t-i-m-info">
              <div class="oi-t-i-m-i-title">
                今日客单量
              </div>
              <div class="oi-t-i-m-i-nums">
                <countTo :startVal='0' :endVal='todayOrder' :duration='2000'></countTo> 单
              </div>
            </div>
            <div class="oi-t-i-m-icon">
              <img src="@/assets/icon/icon_operate_order.png" alt="" srcset="">
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="oi-top" :span="24">
        <div class="oi-t-item oi-t-bom box-shadow">
          <div class="oi-t-b-mains" id="pOrderCanvas"></div>
        </div>
        <div class="oi-t-item oi-t-bom box-shadow">
          <div class="oi-t-b-mains">
            <div class="oi-t-b-m-title">
              产品销售排行
            </div>
            <el-table
              :data="tableData"
              empty-text="暂无数据"
              style="width: 100%"
              v-loading="listLoading"
              :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}">
              <el-table-column
                label="排行"
                prop="name"
                width="80"
                align="center">
                <span slot-scope="scope">
                  <span :class="scope.row.className">{{scope.$index + 1}}</span>
                </span>
              </el-table-column>
              <el-table-column
                label="商品名称"
                prop="content"
                align="center">
                <span slot-scope="scope">
                  <span class="hiddenFonts">{{scope.row.content}}</span>
                </span>
              </el-table-column>
              <el-table-column
                label="销量"
                prop="value"
                width="100"
                align="center">
                <span slot-scope="scope">
                  <span :class="scope.row.className">{{scope.row.value}}</span>
                </span>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import countTo from 'vue-count-to';
  import { operateData } from '@/api/index';
  export default {
    components: { countTo },
    data() {
      return {
        // 今日销售金额
        todayPrice: 0,
        // 今日单量
        todayOrder: 0,
        // 订单排行柱状图
        poCharts: null,
        // 省份
        pList: [],
        // 数值
        vList: [],
        // 产品销售排行
        tableData: [],
        // 表格加载
        listLoading: true
      }
    },
    created() {
      this.getToDayPrice()
    },
    mounted() {
      
    },
    methods: {
      // 今日支付金额
      getToDayPrice(){
        this.listLoading = true
        let params = {
          data_type: 'index'
        }
        operateData(params).then(res=>{
          if(res){
            this.todayPrice = res.data.sum_today_pay[0].value
            this.todayOrder = res.data.sum_today_num[0].value
            res.data.in_hot_goods.forEach((o,_o)=>{
              if(_o === 0){
                o.className = 'color-a'
              }else if(_o === 1){
                o.className = 'color-b'
              }else if(_o === 2){
                o.className = 'color-c'
              }else{
                o.className = ''
              }
            })
            this.tableData = res.data.in_hot_goods
            res.data.in_province_top10.forEach(v=>{
              this.pList.unshift(v.content)
              this.vList.unshift(v.value)
            })
            this.$nextTick(() => {
              this.drawCanvas("pOrderCanvas");
            })
            this.listLoading = false
          }
        })
      },
      drawCanvas(id){
        this.poCharts = this.$echarts.init(document.getElementById(id));
        this.poCharts.setOption({
          title: {
            text: '销售额排行',
            subtext: '全国前十省份(当月)'
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}: {c}(元)"
          },
          legend: {
            
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: this.pList
          },
          series: [
            {
              type: 'bar',
              data: this.vList,
              barCategoryGap: '40%',
              // itemStyle: {
              // 	emphasis: {
              // 		barBorderRadius: 7
              // 	},
              // 	normal: {
              // 		barBorderRadius: 7,
              // 		label: {
              // 			show: true,
              // 			position: 'right',
              // 			textStyle: {
              // 				color: '#FFF',
              // 				fontSize: 12
              // 			}
              // 		},
              // 		color: function (params) {
              // 			var colorList = ['#9e27ac', '#8127E7', '#4B43E7', '#1F84D1', '#2EC9CF', '#3CB371', '#E8BB7A', '#E28A0C', '#FD5151'];
              // 			return colorList[params.dataIndex]
              // 		}
              // 	}
              // }
					  }
          ],
          color: ['#52CCA3']
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .oi-top{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .oi-t-item{
      width: 49.2%;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .oi-t-i-mains{
        width: 94%;
        height: 170px;
        background-color: #52CCA3;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        .oi-t-i-m-info{
          width: 90%;
          height: 140px;
          .oi-t-i-m-i-title{
            height: 60px;
            line-height: 60px;
            font-size: 24px;
            font-weight: bold;
            color: #FFFFFF;
          }
          .oi-t-i-m-i-nums{
            height: 80px;
            font-size: 36px;
            font-weight: bold;
            color: #FFFFFF;
          }
        }
        .oi-t-i-m-icon{
          width: 150px;
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: 1;
          img{
            width: 100%;
          }
        }
      }
      .oi-t-i-order{
        background-color: #6D93FF;
      }
    }
    .oi-t-bom{
      height: 550px;
      .oi-t-b-mains{
        width: 94%;
        height: 520px;
        .oi-t-b-m-title{
          font-size: 18px;
          font-weight: bolder;
          color: #333333;
          margin-bottom: 20px;
        }
      }
    }
  }
  .color-a{
    color: #F44436;
    font-weight: bolder;
    font-size: 18px;
  }
  .color-b{
    color: #FF9800;
    font-weight: bolder;
    font-size: 18px;
  }
  .color-c{
    color: #06A9F4;
    font-weight: bolder;
    font-size: 18px;
  }
</style>