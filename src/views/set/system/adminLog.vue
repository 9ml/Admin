<template>
  <div>
    <el-row class="table-mains">
      <el-col class="tm-top" :xl="19" :lg="17"></el-col>
      <el-col :xl="4" :lg="6" class="tm-top">
        <el-input placeholder="请输入操作名称搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-input>
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
            label="操作"
            prop="title"
            width="300"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="操作人员"
            prop="admin_user"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="操作说明"
            prop="desc"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="操作时间"
            width="160"
            prop="time"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="请求类型"
            prop="request_type"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="请求接口"
            prop="request_url"
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
  import { adminLogList } from '@/api/set';
  export default {
    data() {
      return {
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
      tableData(){
        this.listLoading = true
        let params = {
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords
        }
        adminLogList(params).then(res=>{
          this.getData = res.data
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
<style lang="scss" scoped>

</style>