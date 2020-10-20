<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="5" :lg="6">
        类型筛选：
        <el-select v-model="stateValue" filterable @change="getChoseValue" placeholder="请选择状态">
          <el-option
            v-for="item in stateList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="table-mains">
      <el-col class="tm-top" :xl="18" :lg="15"></el-col>
      <el-col :xl="4" :lg="6" class="tm-top">
        <el-input placeholder="请输入类型搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
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
            label="获得积分"
            prop="integral"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="积分说明"
            prop="content"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="获得时间"
            prop="create_time"
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
  import { assetsTypes , integralList } from '@/api/purchase';
  export default {
    data() {
      return {
        // 类型列表
        stateList: [],
        // 所选类型
        stateValue: '',
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
      this.getStateList()
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
      // 获取类型
      getStateList(){
        let params = {
          type: 'integral_type'
        }
        assetsTypes(params).then(res=>{
          if(res){
            this.stateList = res.data.integral_type
            this.stateValue = res.data.integral_type[0].id
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
        let params = {
          page: this.page,
          limit: this.limit,
          sign_type: this.stateValue,
          keyword: this.keyWords,
          export: type || ''
        }
        integralList(params).then(res=>{
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