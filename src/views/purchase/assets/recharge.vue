<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="5" :lg="6">
        状态筛选：
        <el-select v-model="stateValue" filterable @change="getChoseValue" placeholder="请选择状态">
          <el-option
            v-for="item in stateList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
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
    <el-row class="table-mains">
      <el-col class="tm-top" :xl="18" :lg="15"></el-col>
      <el-col :xl="4" :lg="6" class="tm-top">
        <el-input placeholder="请输入用户名搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-input>
      </el-col>
      <el-col :xl="2" :lg="3" class="tm-top">
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
          :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}"
        >
          <el-table-column
            label="用户名"
            prop="name"
            align="center"
          >
            <div slot-scope="scope">
              <span v-if="scope.row.user">
                {{scope.row.user.nickname || '账户已被删除'}}
              </span>
              <span v-else>账户已被删除</span>
            </div>
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="name"
            align="center"
          >
            <div slot-scope="scope">
              <span v-if="scope.row.user">
                {{scope.row.user.mobilePhone || '暂无信息'}}
              </span>
              <span v-else>暂无信息</span>
            </div>
          </el-table-column>
          <el-table-column
            label="充值金额"
            prop="mount"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="充值方式"
            prop="pay_type"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="充值时间"
            prop="trade_time"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="状态"
            prop="trade_status"
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
  import { rechargeRecord } from '@/api/purchase';
  export default {
    data() {
      return {
        // 状态列表
        stateList: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '成功'
          },
          {
            value: 2,
            label: '失败'
          }
        ],
        // 所选状态
        stateValue: 0,
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
        limit: 10
      }
    },
    created() {
      this.tableData()
    },
    methods: {
      // 导出
      exportTable(){
        this.tableData(1)
      },
      // 清空搜索框
      clear(){
        this.tableData()
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
        let getTime = this.choseTimeValue || []
        let params = {
          trade_status: this.stateValue,
          start_time: getTime[0],
          end_time: getTime[1],
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords,
          export: type || ''
        }
        rechargeRecord(params).then(res=>{
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
<style lang="scss" scoped>

</style>
