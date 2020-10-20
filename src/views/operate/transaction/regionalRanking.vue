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
          :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}">
          <el-table-column
            label="排名"
            width="120"
            prop="name"
            align="center"
          >
            <div slot-scope="scope">
              {{scope.$index + 1}}
            </div>
          </el-table-column>
          <el-table-column
            label="省份"
            prop="province"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="单量(单)"
            sortable="custom"
            prop="volume"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="客户(人)"
            sortable="custom"
            prop="number"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="客单价(元)"
            sortable="custom"
            prop="avg_price"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="生鲜(元)"
            sortable="custom"
            prop="fresh"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="干货(元)"
            sortable="custom"
            prop="dried_food"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="总金额(元)"
            sortable="custom"
            prop="money"
            align="center"
          >
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
  </div>
</template>
<script>
  import { regionalRanking } from '@/api/operate'
  import { localRead } from '@/utils/local'
  export default {
    data() {
      return {
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
      this.tableData()
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
      // 获取表格数据
      tableData(type){
        this.listLoading = true
        let params = {
          start_time: this.startTime,
          end_time: this.endTime,
          page: this.page,
          limit: this.limit,
          sort_type: this.sortWords,
          sort_value: this.sortType,
          export: type || ''
        }
        regionalRanking(params).then(res=>{
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
      }
    }
  }
</script>
<style lang="scss">
  
</style>
