<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="5" :lg="6">
        地区：
        <el-cascader
          v-model="areaValue"
          ref="myCascader"
          :options="areaList"
          @change="handleAreaChange"
          placeholder="请选择省/市/区"
          clearable
          filterable
          :props="{ checkStrictly: true }"
        ></el-cascader>
      </el-col>
      <el-col class="sl-t-item" :xl="5" :lg="6">
        微信：
        <el-select v-model="weChatValue" filterable @change="handleChange(1)" placeholder="请选择微信状态">
          <el-option
            v-for="item in weChatList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="sl-t-item" :xl="5" :lg="6">
        留存：
        <el-select v-model="stayValue" filterable @change="handleChange(1)" placeholder="请选择留存类型">
          <el-option
            v-for="item in stayList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="sl-t-item" :xl="5" :lg="6">
        当月：
        <el-select v-model="monthValue" filterable @change="handleChange(1)" placeholder="请选择当月消费">
          <el-option
            v-for="item in monthList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="table-mains">
      <el-col class="tm-top" style="justify-content: flex-start;" :offset="1" :span="22">
        用户等级：
        <uLevel
          :uLData="getData.userLevelNumList"
          @uLChange="uLChange">
        </uLevel>
      </el-col>
      <el-col class="tm-top" style="justify-content: flex-start;" :offset="1" :xl="17" :lg="14">
      </el-col>
      <el-col :xl="1" :lg="2" v-if="userInfo.is_export === 0" class="tm-top"></el-col>
      <el-col :xl="4" :lg="6" class="tm-top">
        <el-input placeholder="请输入关键字搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-input>
      </el-col>
      <el-col :xl="2" :lg="3" class="tm-top" v-if="userInfo.is_export === 1">
        <el-button
          type="primary"
          @click="exportTable"
          icon="el-icon-download">
          导出
        </el-button>
      </el-col>
      <el-col class="tm-mains" :span="24">
        <el-table
          :data="getData.data"
          empty-text="暂无数据"
          style="width: 100%"
          v-loading="listLoading"
          @sort-change="getSortBy"
          :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}">
          <el-table-column
            label="用户信息"
            prop="goods_name"
            width="100"
            align="center">
            <div slot-scope="scope">
              <el-image
                style="width:40px;height:40px;border-radius: 4px;"
                fit="cover"
                :src="scope.row.avatar || uDefaultHeader"
              ></el-image>
              <el-tooltip class="item" effect="dark" :content="scope.row.nickname" placement="top">
                <span class="hiddenFonts" style="font-size:12px;color:#BBBBBB;">
                  {{scope.row.nickname}}
                </span>
              </el-tooltip>
            </div>
          </el-table-column>
          <el-table-column
            label="真实姓名"
            prop="name"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="phone"
            width="110"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="地区"
            prop="district"
            align="center"
          >
            <div slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.district" placement="top">
                <span class="hiddenFonts">{{scope.row.district}}</span>
              </el-tooltip>
            </div>
          </el-table-column>
          <!-- <el-table-column
            label="详细地址"
            prop="address"
            align="center"
          >
            <div slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.address" placement="top">
                <span class="hiddenFonts">{{scope.row.address}}</span>
              </el-tooltip>
            </div>
          </el-table-column> -->
          <el-table-column
            label="追随时间"
            width="100"
            sortable="custom"
            prop="follow_day"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="微信"
            width="80"
            prop="is_add_text"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="用户等级"
            width="80"
            prop="user_label"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="最后下单时间"
            width="160"
            sortable="custom"
            prop="last_time"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="上月消费"
            width="100"
            sortable="custom"
            prop="last_month"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="本月消费"
            width="100"
            sortable="custom"
            prop="this_month"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="累积消费"
            width="100"
            sortable="custom"
            prop="all_price"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="流失天数"
            width="100"
            sortable="custom"
            prop="loss_day"
            align="center"
          >
            <span slot-scope="scope" :class="scope.row.className">{{scope.row.loss_day}}</span>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handles(1,scope.row)">订单</el-button>
              <el-button
                size="mini"
                type="warning"
                @click="handles(2,scope.row)">周期</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="table-pages" v-if="getData.page && getData.page.data_count > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next"
          :total="getData.page.data_count">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 用户订单 -->
    <el-dialog
      :title="doTitle"
      :visible.sync="dialogOrder"
      top="4%"
      width="60%">
      <el-row class="table-mains">
        <el-col class="tm-top" style="justify-content: flex-start;" :offset="1" :span="23">
          产品：
          <el-radio-group v-model="productScreenValue" @change="handleChange(2)">
            <el-radio-button v-for="(s,s_idx) in productScreenList" :label="s.id" :key="s_idx">{{s.name}}</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col class="tm-mains" :span="24">
          <el-table
            :data="uOrderData.data"
            empty-text="暂无数据"
            style="width: 100%"
            v-loading="uListLoading"
            :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}">
            <el-table-column
              label="商品件数"
              prop="nums"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="商品名称"
              prop="things"
              align="center"
            >
              <div slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.things" placement="top">
                  <span class="hiddenFonts">
                    {{scope.row.things}}
                  </span>
                </el-tooltip>
              </div>
            </el-table-column>
            <el-table-column
              label="实付金额"
              prop="payprices"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="付款方式"
              prop="paystatus"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="下单时间"
              width="160"
              prop="time"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="买家备注"
              prop="remark1"
              align="center"
            >
              <div slot-scope="scope">
                <el-tooltip class="item" effect="dark" v-if="scope.row.remark1" :content="scope.row.remark1" placement="top">
                  <span class="hiddenFonts">
                    {{scope.row.remark1}}
                  </span>
                </el-tooltip>
                <span v-else>无</span>
              </div>
            </el-table-column>
            <el-table-column
              label="卖家备注"
              prop="remark2"
              align="center"
            >
              <div slot-scope="scope">
                <el-tooltip class="item" effect="dark" v-if="scope.row.remark2" :content="scope.row.remark2" placement="top">
                  <span class="hiddenFonts">
                    {{scope.row.remark2}}
                  </span>
                </el-tooltip>
                <span v-else>无</span>
              </div>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="24" class="table-pages" v-if="uOrderData.page && uOrderData.page.data_count > 0">
          <el-pagination
            @size-change="handleUOrderSizeChange"
            @current-change="handleUOrderCurrentChange"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="10"
            layout="total, sizes, prev, pager, next"
            :total="uOrderData.page.data_count">
          </el-pagination>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogOrder = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 周期 -->
    <el-dialog
      :title="dcTitle"
      :visible.sync="dialogCanvas"
      destroy-on-close
      custom-class="overThis"
      top="4%"
      width="60%">
      <el-row class="sl-top">
        <el-col class="sl-t-item" style="justify-content: flex-end;" :offset="1" :span="22">
          年份查询：
          <el-select v-model="yearValue" filterable @change="handleChange(3)" placeholder="请选择查询的年份">
            <el-option
              v-for="item in yearList"
              :key="item.id"
              :label="item.id"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="24" class="canvas-item">
          <div class="c-i-mains" id="uPayCanvas"></div>
          <div class="c-i-mains" id="uOrderCanvas"></div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogCanvas = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { areaList , customerClue , userOrder , userCycle } from '@/api/operate'
  import uLevel from '@/components/userLevel'
  import { localRead } from '@/utils/local'
  export default {
    components: { uLevel },
    data() {
      return {
        // 省市区数据
        areaList : [],
        // 所选省市区(value)
        areaValue: [],
        // 所选省市区(label)
        labelValue: [],
        // 微信
        weChatList: [
          {
            id: 0,
            name: '全部'
          },
          {
            id: 2,
            name: '已加'
          },
          {
            id: 1,
            name: '未加'
          }
        ],
        // 所选微信
        weChatValue: 0,
        // 留存
        stayList: [
          {
            id: 0,
            name: '全部'
          },
          {
            id: 1,
            name: '新用户'
          },
          {
            id: 2,
            name: '2020'
          }
        ],
        // 所选留存
        stayValue: 0,
        // 当月
        monthList: [
          {
            id: 0,
            name: '全部'
          },
          {
            id: 1,
            name: '≥ 1000'
          },
          {
            id: 2,
            name: '≥ 500'
          },
          {
            id: 3,
            name: '≥ 300'
          },
          {
            id: 4,
            name: '≥ 100'
          },
          {
            id: 5,
            name: '< 100'
          }
        ],
        // 所选当月
        monthValue: 0,
        // 表格数据
        getData: [],
        // 关键字
        keyWords: '',
        // 表格加载
        listLoading: true,
        // 页码
        page: 1,
        // 数量
        limit: 10,
        // 所选人数
        userLevelNumValue: 0,
        // 订单弹窗
        dialogOrder: false,
        // 订单弹窗标题
        doTitle: '',
        // 行数据
        getRowData: '',
        // 产品筛选
        productScreenList: [
          {
            id: 0,
            name: '全部'
          },
          {
            id: 1,
            name: '牛肉'
          },
          {
            id: 2,
            name: '羊肉'
          },
          {
            id: 3,
            name: '鸡肉'
          },
          {
            id: 4,
            name: '百味鲜'
          },
          {
            id: 5,
            name: '鸡宝'
          },
          {
            id: 6,
            name: '番茄酱'
          },
          {
            id: 7,
            name: '辣椒粉'
          },
          {
            id: 8,
            name: '汤料'
          }
        ],
        // 所选筛选
        productScreenValue: 0,
        // 订单数据
        uOrderData: '',
        // 订单表格加载
        uListLoading: true,
        // 订单页码
        oPage: 1,
        // 订单数量
        oLimit: 10,
        // 周期统计
        dialogCanvas: false,
        // 周期统计标题
        dcTitle: '',
        // 年份列表
        yearList: [],
        // 所选年份
        yearValue: '',
        // 排序字段
        sortWords: 'last_time',
        // 排序类型
        sortType: 2,
        // 默认头像
        uDefaultHeader: require('@/assets/icon/icon_default_header.png')
      }
    },
    created() {
      this.userInfo = JSON.parse(localRead('user'))
      this.getAreaList()
      this.tableData()
    },
    methods: {
      // 等级切换
      uLChange(data){
        this.userLevelNumValue = data
        this.tableData()
      },
      // 导出
      exportTable(){
        this.tableData(1)
      },
      // 排序
      getSortBy(i){
        this.sortWords = i.prop
        if(i.order == 'ascending'){
          this.sortType = 1
        }else{
          this.sortType = 2
        }
        this.tableData()
      },
      // 选择地区
      handleAreaChange(){
        this.labelValue = this.$refs['myCascader'].getCheckedNodes().length === 0 ? [] : this.$refs['myCascader'].getCheckedNodes()[0].pathLabels
        this.tableData();
      },
      handleChange(type){
        switch(type){
          case 0:
            this.tableData()
            break;
          case 1:
            this.tableData()
            break;
          case 2:
            this.getUserDataList()
            break;
          case 3:
            this.getUserCycleList()
            break;
        }
      },
      // 清空搜索框
      clear(){
        this.tableData()
      },
      // 获取类型
      getAreaList(){
        areaList().then(res=>{
          if(res){
            this.areaList = res.data 
          }
        })
      },
      // 搜索
      handleSearch(){
        if(!this.keyWords){
          return this.$message({
            message: '搜索内容不能为空',
            type: 'warning'
          });
        }
        this.tableData();
      },
      // 获取表格数据
      tableData(type){
        this.listLoading = true
        let areaList = this.labelValue
        let params = {
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords,
          provinceName: areaList[0] || '',
          cityName: areaList[1] || '',
          areaName: areaList[2] || '',
          is_adds: this.weChatValue,
          user_status: 0,
          platform_type: 'clue',
          marks: this.stayValue,
          month_money: this.monthValue,
          user_level: this.userLevelNumValue,
          sort_type: this.sortWords,
          sort_value: this.sortType,
          export: type || ''
        }
        customerClue(params).then(res=>{
          if(type){
            window.open(res.data.param.export_url)
          }else{
            let uList = []
            for(let i in res.data.userLevelInfo){
              if(i == '全部'){
                uList.unshift({
                  id: 0,
                  name: '全部',
                  nums: res.data.userLevelInfo[i]
                })
              }else if(i == 'VIP'){
                uList.push({
                  id: i,
                  name: i + '类',
                  nums: res.data.userLevelInfo[i],
                  icon: require('@/assets/icon/icon_vip.png'),
                  icon_ac: require('@/assets/icon/icon_vip.png')
                })
              }else if(i == 'A'){
                uList.push({
                  id: i,
                  name: i + '类',
                  nums: res.data.userLevelInfo[i],
                  icon: require('@/assets/icon/icon_a.png'),
                  icon_ac: require('@/assets/icon/icon_a_ac.png')
                })
              }else if(i == 'B'){
                uList.push({
                  id: i,
                  name: i + '类',
                  nums: res.data.userLevelInfo[i],
                  icon: require('@/assets/icon/icon_b.png'),
                  icon_ac: require('@/assets/icon/icon_b_ac.png')
                })
              }else{
                uList.push({
                  id: i,
                  name: i + '类',
                  nums: res.data.userLevelInfo[i]
                })
              }
            }
            res.data.data.forEach(v=>{
              if(v.loss_day >= 100){
                v.className = 'colors-a'
              }else if(v.loss_day > 0 && v.loss_day < 100){
                v.className = 'colors-b'
              }else{
                v.className = ''
              }
            })
            res.data.userLevelNumList = uList
            this.getData = res.data
          }
          this.listLoading = false
        });
      },
      // 每条页数
      handleSizeChange(data){
        this.page = 1
        this.limit = data
        this.tableData()
      },
      // 分页
      handleCurrentChange(data){
        this.page = data
        this.tableData()
      },
      // 订单每条页数
      handleUOrderSizeChange(data){
        this.opage = 1
        this.olimit = data
        this.getUserDataList()
      },
      // 订单分页
      handleUOrderCurrentChange(data){
        this.opage = data
        this.getUserDataList()
      },
      handles(type,data){
        switch(type){
          case 1:
            this.productScreenValue = 0
            this.oPage = 1
            this.oLimit = 10
            this.getRowData = data
            this.doTitle = '用户 (' + data.name + ') 订单详情'
            this.getUserDataList()
            this.dialogOrder = true
          break;
          case 2:
            this.dcTitle = '用户 (' + data.name + ') 周期统计'
            this.yearValue = new Date().getFullYear() * 1
            this.getRowData = data
            if(this.yearList.length === 0){
              for(let i = 2015;i <= this.yearValue;i++){
                this.yearList.unshift({
                  id: i
                })
              }
            }
            this.getUserCycleList()
          break;
        }
      },
      // 获取用户周期
      getUserCycleList(){
        let params = {
          uid: this.getRowData.id,
          year: this.yearValue
        }
        userCycle(params).then(res=>{
          if(res){
            this.dialogCanvas = true
            this.$nextTick(() => {
              this.drawCanvas('uPayCanvas',res.data.prices,'消费金额','#52CCA3')
            })
            this.$nextTick(() => {
              this.drawCanvas('uOrderCanvas',res.data.nums,'下单频率','#FF6600')
            })
          }
        })
      },
      // 获取用户订单
      getUserDataList(){
        this.uListLoading = true
        let params = {
          uid: this.getRowData.id,
          prods: this.productScreenValue,
          phone: this.getRowData.phone,
          page: this.oPage,
          limit: this.oLimit
        }
        userOrder(params).then(res=>{
          if(res){
            this.uOrderData = res.data
            this.uListLoading = false
          }
        })
      },
      // 折线图
      drawCanvas(id,data,fonts,color){
        this.chartsCross = this.$echarts.init(document.getElementById(id));
        this.chartsCross.setOption({
          title: {
              text: this.yearValue + '年 ('+this.getRowData.name+') 用户'+ fonts +'折线统计图'
          },
          tooltip: {
              trigger: 'axis'
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name: fonts,
                  type: 'line',
                  stack: '总量',
                  data: data
              }
          ],
          color: [ color ]
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .canvas-item{
    .c-i-mains{
      height: 270px;
    }
  }
  .colors-a{
    color: #FD5151;
  }
  .colors-b{
    color: #E28A0C;
  }
</style>