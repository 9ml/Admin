<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="8" :lg="14" :md="15">
        时间类型：
        <el-select v-model="typeValue" @change="changeTimeType" filterable placeholder="请选择时间类型">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-date-picker
          v-if="typeValue === 1"
          class="sl-t-margin"
          @change="getChoseDay"
          v-model="dateValue"
          type="date"
          placeholder="选择日期"
          value-format="timestamp">
        </el-date-picker>
        <el-date-picker
          v-else-if="typeValue === 2"
          class="sl-t-margin"
          @change="getChoseWeek"
          v-model="weekValue"
          type="week"
          format="yyyy 第 WW 周"
          :picker-options="{'firstDayOfWeek': 1}"
          placeholder="选择周"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-date-picker
          class="sl-t-margin"
          v-else
          @change="getChoseMonth"
          v-model="monthValue"
          type="month"
          placeholder="选择月"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
      <el-col class="sl-t-item" :xl="5" :lg="7" :md="9">
        所属战队：
        <el-select v-model="teamValue" filterable @change="getChoseValue" placeholder="请选择所属战队">
          <el-option
            v-for="item in teamList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="table-mains">
      <el-col class="tm-top" :xl="22" :lg="21" v-if="userInfo.is_export === 1"></el-col>
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
          :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}"
          :row-class-name="tableRowClassName">
          <el-table-column
            label="排名"
            width="120"
            prop="name"
            align="center">
            <div slot-scope="scope">
              <div v-if="scope.$index === 0">
                <el-image
                  style="width: 24px;height: 30px;"
                  :src="fImage"
                ></el-image>
              </div>
              <div v-else-if="scope.$index === 1">
                <el-image
                  style="width: 24px;height: 30px;"
                  :src="sImage"
                ></el-image>
              </div>
              <div v-else-if="scope.$index === 2">
                <el-image
                  style="width: 24px;height: 30px;"
                  :src="tImage"
                ></el-image>
              </div>
              <span v-else>{{scope.$index + 1}}</span>
            </div>
          </el-table-column>
          <el-table-column
            label="区域"
            prop="area"
            align="center"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.area}}</span>
          </el-table-column>
          <el-table-column
            label="下辖"
            prop="desc"
            align="center">
            <div slot-scope="scope">
              <el-tooltip class="item" v-if="scope.row.area == '第一大区' || scope.row.area == '第二大区'" effect="dark" :content="scope.row.desc" placement="top">
                <span class="hiddenFonts">{{scope.row.desc}}</span>
              </el-tooltip>
              <span v-else>{{scope.row.desc}}</span>
            </div>
          </el-table-column>
          <el-table-column
            label="经理"
            prop="user"
            align="center"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.user}}</span>
          </el-table-column>
          <el-table-column
            label="战斗指数"
            width="100"
            sortable="custom"
            prop="timeMoney"
            align="center"
          >
            <span slot-scope="scope" class="combat-index" @click="lookMore(scope.row)">{{scope.row.timeMoney}}</span>
          </el-table-column>
          <el-table-column
            label="回复率"
            sortable="custom"
            width="100"
            prop="reply_percentage"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="平均时长"
            sortable="custom"
            width="100"
            prop="avg_reply_time"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="客户(人)"
            sortable="custom"
            width="100"
            prop="number"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="客单价(元)"
            sortable="custom"
            width="120"
            prop="avg_price"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="生鲜(元)"
            sortable="custom"
            width="100"
            prop="fresh"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="干货(元)"
            sortable="custom"
            width="100"
            prop="dried_food"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="来单金额(元)"
            sortable="custom"
            width="130"
            prop="custom"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="总金额(元)"
            sortable="custom"
            width="120"
            prop="money"
            align="center"
          >
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :offset="1" :span="23" class="table-pages" style="justify-content: space-between;" v-if="getData.page && getData.page.data_count > 0">
        <div class="t-p-tips">
          <div class="t-p-t-item">
            回复率考核
            <el-popover
              placement="top"
              trigger="hover">
              [回复率] = 100%  正常<br>
              [回复率] >= 90%  战斗指数 * 0.9<br>
              [回复率] >= 80%  战斗指数 * 0.8<br>
              [回复率] < 80%   战斗指数为 0
              <i slot="reference" class="el-icon-info"></i>
            </el-popover>
          </div>
          <div class="t-p-t-item" style="margin-left:30px;">
            回复时长考核
            <el-popover
              placement="top"
              trigger="hover">
              [回复时长] <= 5分钟  战斗指数 + 25<br>
              [回复时长] <= 1小时  正常<br>
              [回复时长] <= 2小时  战斗指数 - 50<br>
              [回复时长] > 2小时   战斗指数 - 100
              <i slot="reference" class="el-icon-info"></i>
            </el-popover>
          </div>
        </div>
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
    <el-dialog
      :title="dcTitle"
      :visible.sync="dialogCanvas"
      destroy-on-close
      width="60%">
      <el-row>
        <el-col class="dc-canvas" :offset="2" :span="20">
          <div class="dc-c-all">
            <div class="dc-c-a-item">
              <span>战斗指数:</span><br>
              <span class="dc-c-a-nums">{{tmNums}}</span>
            </div>
            <div class="dc-c-a-item"
              v-for="(t,t_idx) in tmDetails"
              :key="t_idx"
            >
              <span>{{t.name}}:</span><br>
              <span class="dc-c-a-nums">{{t.value}}</span>
            </div>
          </div>
          <div class="dc-c-mains" id="tmCanvas"></div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogCanvas = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 周冠弹窗 -->
    <el-dialog
      :visible.sync="dialogWeek"
      custom-class="champion-main"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal="false">
      <el-row>
        <el-col class="c-m-mains" :span="24">
          <img style="width:450px;" v-if="dialogWeek" src="@/assets/icon/icon_champion_week.gif" alt="">
          <svg-icon class="c-m-m-icon" icon-class="close" @click="closeChampion(1)" />
          <div class="c-m-m-info">
            <transition name="el-zoom-in-center">
              <div v-if="isShowFonts">
                <div class="c-m-m-i-item">
                  周冠：<span v-html="championInfo.name"></span>
                </div>
              </div>
            </transition>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 月冠弹窗 -->
    <el-dialog
      :visible.sync="dialogMonth"
      custom-class="champion-main"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal="false">
      <el-row>
        <el-col class="c-m-mains" :span="24">
          <img style="width:450px;" v-if="dialogMonth" src="@/assets/icon/icon_champion_month.gif" alt="">
          <svg-icon class="c-m-m-icon" icon-class="close" @click="closeChampion(2)" />
          <div class="c-m-m-info">
            <transition name="el-zoom-in-center">
              <div v-if="isShowFonts">
                <div class="c-m-m-i-item">
                  月冠：<span v-html="championInfo.name"></span>
                </div>
              </div>
            </transition>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import { operateScreen , transactionRanking , wAMChampion } from '@/api/operate'
  import { localRead } from '@/utils/local'
  export default {
    data() {
      return {
        // 战队列表
        teamList: [],
        // 所选状态
        teamValue: '',
        // 时间类型
        typeList: [
          {
            id: 1,
            name: '自然日'
          },
          {
            id: 2,
            name: '自然周'
          },
          {
            id: 3,
            name: '自然月'
          }
        ],
        // 所选类型
        typeValue: 1,
        // 自然日
        dateValue: new Date(new Date().toLocaleDateString()).getTime(),
        // 自然周
        weekValue: '',
        // 自然月
        monthValue : '',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
        // 第一
        fImage: require('@/assets/icon/first.gif'),
        // 第二
        sImage: require('@/assets/icon/second.png'),
        // 第三
        tImage: require('@/assets/icon/third.png'),
        // 表格数据
        getData: [],
        // 关键字
        // keyWords: '',
        // 表格加载
        listLoading: true,
        // 页码
        page: 1,
        // 数量
        limit: 10,
        // 弹窗
        dialogCanvas: false,
        // 弹窗标题
        dcTitle: '',
        // 战斗指数
        tmNums: '',
        // 指数详情
        tmDetails: [
          {value: 0, name: '奖励提成'},
          {value: 0, name: '回复提成'},
          {value: 0, name: '周、月奖金'},
          {value: 0, name: '拉新提成'},
          {value: 0, name: '充值提成'},
          {value: 0, name: '来单提成'},
          {value: 0, name: '其他提成'}
        ],
        // 周冠弹窗
        dialogWeek: false,
        // 月冠弹窗
        dialogMonth: false,
        // 显示文字
        isShowFonts: false,
        // 冠军信息
        championInfo: '',
        // 排序类型
        sortType: '',
        // 排序字段
        sortWords: '',
        // 用户信息
        userInfo: ''
      }
    },
    created() {
      this.userInfo = JSON.parse(localRead('user'))
      this.getTeamList()
      this.getChampion(1)
    },
    mounted() {
      
    },
    methods: {
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
      // 关闭冠军弹窗
      closeChampion(type){
        type === 1 ? (this.dialogWeek = false , this.isShowFonts = false , this.getChampion(2)) : this.dialogMonth = false
      },
      // 获取周月冠数据
      getChampion(dateType){
        let param = {
          date_type: dateType
        }
        wAMChampion(param).then(res=>{
          if(res.data.is_pop === 0){
            if(dateType === 1){
              this.getChampion(2)
            }
          }else{
            if(dateType === 1){
              this.dialogWeek = true
              res.data.name = this.uName(res.data.name)
            }else{
              this.dialogMonth = true
              res.data.name = this.uName(res.data.name)
            }
            this.championInfo = res.data
            setTimeout(()=>{
              this.isShowFonts = true
            },3000)
          }
        })
      },
      // 校验名字
      uName(name){
        if(name.length === 2){
          name = name[0] + '&nbsp;&nbsp;&nbsp;' + name[1]
        }
        return name
      },
      // 导出
      exportTable(){
        this.tableData(1)
      },
      // 切换时间
      changeTimeType(){
        switch(this.typeValue){
          case 1:
            this.getChoseDay()
            break;
          case 2:
            if(this.weekValue){
              this.getChoseWeek();
            }
            break;
          case 3:
            if(this.monthValue){
              this.getChoseMonth();
            }
            break;
        }
      },
      // 扇形统计图
      drawCanvas(id,data){
        this.chartsCross = this.$echarts.init(document.getElementById(id));
        this.chartsCross.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            // orient: 'vertical',
            top: 'bottom',
            left: 'center',
            data: ['奖励提成', '回复提成', '周、月奖金', '拉新提成', '充值提成', '来单提成', '其他提成']
          },
          series: [
            {
              name: '战斗指数',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '16',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: true
              },
              data: data
            }
          ],
          color: ['#7D8FB3','#6D93FF','#A1E6CE','#52CCA3','#9580FF','#A2D0DB','#F2CCA3']
        })
      },
      // 查看战斗指数
      lookMore(data){
        this.dcTitle = '经理 ('+data.user+') 的战斗指数'
        this.tmNums = data.timeMoney
        this.tmDetails[0].value = data.team_order
        this.tmDetails[1].value = data.team_reply_bonus
        this.tmDetails[2].value = data.team_week_bonus
        this.tmDetails[3].value = data.team_add_number
        this.tmDetails[4].value = data.team_rechage
        this.tmDetails[5].value = data.customs
        this.tmDetails[6].value = data.other
        this.$nextTick(() => {
          this.drawCanvas('tmCanvas',this.tmDetails)
        })
        this.dialogCanvas = true
      },
      // 表格排名样式
      tableRowClassName({row, rowIndex}){
        if(rowIndex === 0){
          return 'first-row'
        }else if(rowIndex === 1 || rowIndex === 2){
          return 'next-row'
        }
      },
      // 自然日筛选
      getChoseDay(){
        this.startTime = this.dateValue / 1000
        this.endTime = this.dateValue / 1000 + 86400
        this.tableData()
      },
      // 自然周筛选
      getChoseWeek(){
        let d = new Date(this.weekValue)
        ,   t = Date.parse(d);
        this.startTime = (t / 1000) - 115200
        this.endTime = (t / 1000) + (86400 * 6) - 28800
        this.tableData()
      },
      // 自然月筛选
      getChoseMonth(){
        let d = new Date(this.monthValue)
        ,   t = Date.parse(d)
        ,   dList = this.monthValue.split('-');
        this.startTime = (t / 1000) - 28800
        this.endTime = (t / 1000) + (this.getMonthDay(dList[0],dList[1]) * 86400) - 28800
        this.tableData()
      },
      // 获取每月的天数
      getMonthDay(year,month){
        let days = new Date(year, month, 0).getDate()
        return days;
      },
      // 战队列表
      getTeamList(){
        let params = {
          type: 'team_type'
        }
        operateScreen(params).then(res=>{
          if(res){
            this.teamList = res.data.team_type
            this.teamValue = res.data.team_type[0].id
            this.tableData()
          }
        })
      },
      // 获取表格数据
      tableData(type){
        this.listLoading = true
        let params = {
          team_type: this.teamValue,
          start_time: this.startTime,
          end_time: this.endTime,
          sort_type: this.sortWords,
          sort_value: this.sortType,
          page: this.page,
          limit: this.limit,
          export: type || ''
        }
        transactionRanking(params).then(res=>{
          if(type){
            window.open(res.data.param.export_url)
          }else{
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
      // 数据筛选
      getChoseValue(){
        this.tableData()
      }
    }
  }
</script>
<style lang="scss">
  .champion-main{
    width: 500px;
    background-color: rgba(0,0,0,0);
    box-shadow: none;
    .c-m-mains{
      position: relative;
      text-align: center;
      .c-m-m-icon{
        color: #F60F17;
        font-size: 46px;
        position: absolute;
        right: -30px;
        top: 30px;
        z-index: 99;
        cursor: pointer;
      }
      .c-m-m-info{
        width: 100%;
        height: 100px;
        position: absolute;
        left: 0;
        top: 55%;
        z-index: 99;
        .c-m-m-i-item{
          height: 40px;
          line-height: 40px;
          font-size: 24px;
          font-weight: bold;
          color: #FFFFFF;
          text-align: center;
        }
      }
      // .c-m-m-one{
      //   top: 55%;
      // }
    }
  }
  .el-table {
    .first-row{
      background-image: linear-gradient(to right, #FFBD0B , #FD6801);
      font-size: 16px;
      font-weight: bold;
      color: #FFFFFF;
    }
    .next-row{
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    tbody tr:hover>td { 
      background-color:rgba(0,0,0,0) !important
    }
  }
  .combat-index{
    &:hover{
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .dc-canvas{
    .dc-c-all{
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .dc-c-a-item{
        .dc-c-a-nums{
          height: 50px;
          line-height: 50px;
          font-size: 24px;
          font-weight: bold;
        }
      }
    }
    .dc-c-mains{
      width: 700px;
      height: 300px;
      margin: 0 auto;
    }
  }
</style>
