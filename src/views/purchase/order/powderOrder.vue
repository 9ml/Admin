<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="7" :lg="10">
        时间筛选：
        <el-date-picker
          v-model="choseTimeValue"
          @change="getChoseValue"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"  
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-tabs type="border-card" v-model="activeName" @tab-click="tabChange">
          <el-tab-pane label="全部" name="1">
            <pTable
              :tableData="getData"
              :listLoading="listLoading"
              :lList="lList"
              :areaList="areaList"
              @sendSearchKey="search"
              @tSizeChange="sizeChange"
              @tPageChange="pageChange"
              @isExport="isExport"></pTable>
          </el-tab-pane>
          <el-tab-pane label="待付款" name="2">
            <pTable
              :tableData="getData"
              :listLoading="listLoading"
              :lList="lList"
              :areaList="areaList"
              @sendSearchKey="search"
              @tSizeChange="sizeChange"
              @tPageChange="pageChange"
              @isExport="isExport"></pTable>
          </el-tab-pane>
          <el-tab-pane label="待发货" name="3">
            <pTable
              :tableData="getData"
              :listLoading="listLoading"
              :lList="lList"
              :areaList="areaList"
              @sendSearchKey="search"
              @tSizeChange="sizeChange"
              @tPageChange="pageChange"
              @isExport="isExport"></pTable>
          </el-tab-pane>
          <el-tab-pane label="待收货" name="4">
            <pTable
              :tableData="getData"
              :listLoading="listLoading"
              :lList="lList"
              :areaList="areaList"
              @sendSearchKey="search"
              @tSizeChange="sizeChange"
              @tPageChange="pageChange"
              @isExport="isExport"></pTable>
          </el-tab-pane>
          <el-tab-pane label="已完成" name="5">
            <pTable
              :tableData="getData"
              :listLoading="listLoading"
              :lList="lList"
              :areaList="areaList"
              @sendSearchKey="search"
              @tSizeChange="sizeChange"
              @tPageChange="pageChange"
              @isExport="isExport"></pTable>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { pOrder , logisticsList , provincesList } from '@/api/purchase';
  import pTable from "@/components/powderTable.vue";
  export default {
    components: { pTable },
    data() {
      return {
        // 选择标签
        activeName: '1',
        // 时间快捷选项
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        // 所选时间
        choseTimeValue: [],
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
        // 数量
        nums: 0,
        // id
        idx: '',
        // 物流公司字典
        lList: [],
        // 全国省市区字典
        areaList: [],
        // 用户id
        userId: ''
      }
    },
    created() {
      let getType = this.$route.query.type || '1'
      this.userId = this.$route.query.uid || ''
      this.activeName = getType + ''
      this.tableData(this.activeName)
      this.getLogisticsCompany()
      this.getAreaList()
    },
    methods: {
      // 导出数据
      isExport(){
        this.tableData(this.activeName,1)
      },
      // 物流公司
      getLogisticsCompany(){
        logisticsList().then(res=>{
          if(res){
            this.lList = res.data
          }
        })
      },
      getAreaList(){
        provincesList().then(res=>{
          this.areaList = res.data
        });
      },
      // 切换状态
      tabChange(){
        this.tableData(this.activeName)
      },
      // 搜索
      search(data){
        this.keyWords = data
        this.tableData(this.activeName)
      },
      // 获取表格数据
      tableData(type,types){
        this.listLoading = true
        let getTime = this.choseTimeValue || []
        let params = {
          type: type,
          start_time: getTime[0],
          end_time: getTime[1],
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords,
          uid: this.userId,
          export: types || ''
        }
        pOrder(params).then(res=>{
          if(types){
            window.open(res.data.param.export_url)
          }else{
            res.data.data.forEach(v=>{
              if(v.status_text == '已完成' || v.status_text == '已评价' || v.status_text == '已取消' || v.status_text == '已退款'){
                v.status_type = 'info'
              }else{
                v.status_type = 'warning'
              }
              v.rowspan = 1
            })
            // 双层循环
            for (let i = 0; i < res.data.data.length; i++) {
              for (let j = i + 1; j < res.data.data.length; j++) {
                if (res.data.data[i].id === res.data.data[j].id) {
                  res.data.data[i].rowspan++
                  res.data.data[j].rowspan--
                }
              }
              i = i + res.data.data[i].rowspan - 1
            }
            this.getData = res.data
          }
          this.listLoading = false
        });
      },
      // 时间筛选
      getChoseValue(){
        this.tableData(this.activeName)
      },
      // 每页条数
      sizeChange(data){
        this.page = data.page
        this.limit = data.limit
        this.tableData(this.activeName)
      },
      // 分页
      pageChange(data){
        this.page = data
        this.tableData(this.activeName)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
