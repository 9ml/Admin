<template>
  <div>
    <el-row class="table-mains">
      <el-col class="tm-mains" :span="24">
        <el-table
          :data="getData.data"
          empty-text="暂无数据"
          style="width: 100%"
          v-loading="listLoading"
          :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}">
          <el-table-column
            label="名称"
            prop="name"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="说明"
            prop="describe"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="数值"
            prop="value"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handles(scope.row)">编辑</el-button>
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
    <el-dialog
      title="修改设置"
      :visible.sync="dialogVisible"
      width="45%">
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="5">
          {{inputTitle}}：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="17">
          <el-input
            placeholder="请填写要修改的值"
            v-model="updateValue"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { currencyInfo , updateCurrency } from '@/api/set';
  export default {
    data() {
      return {
        // 表格数据
        getData: [],
        // 表格加载
        listLoading: true,
        // 页数
        page: 1,
        // 条数
        limit: 10,
        // 弹窗
        dialogVisible: false,
        // input标题
        inputTitle: '',
        // 修改值
        updateValue: '',
        // 修改id
        getRowId: ''
      }
    },
    created() {
      this.tableData();
    },
    methods: {
      // 获取表格数据
      tableData(){
        this.listLoading = true
        currencyInfo().then(res=>{
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
      },
      // 弹窗
      handles(data){
        this.dialogVisible = true
        this.inputTitle = data.name
        this.getRowId = data.id
        this.updateValue = data.value
      },
      // 确定
      handleSure(){
        if(!this.updateValue){
          return this.$message({
            message: '对应值不能为空',
            type: 'warning'
          })
        }
        let getList = this.getData.data
        getList.forEach(i=>{
          if(i.id == this.getRowId){
            i.value = this.updateValue
          }
        })
        let data = {
          base_info: getList
        }
        updateCurrency(data).then(res=>{
          if(res){
            this.handleTips('修改成功');
          }
        })
      },
      // 操作提示
      handleTips(msg){
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: msg,
          type: 'success'
        });
        this.tableData();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .ed-item{
    margin-bottom: 20px;
    .ed-m-name{
      line-height: 40px;
      text-align: right;
    }
    .ed-m-mains{
      line-height: 40px;
    }
    .ed-m-tips{
      text-align: center;
      line-height: 40px;
      cursor: pointer;
    }
  }
</style>
