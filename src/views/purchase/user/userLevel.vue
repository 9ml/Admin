<template>
  <div>
    <el-row class="table-mains">
      <el-col class="tm-top" style="justify-content: flex-start;" :xl="19" :lg="17">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left:20px;"
          @click="openED(1)"
        >
          新增
        </el-button>
      </el-col>
      <el-col :xl="4" :lg="6" class="tm-top">
        <el-input placeholder="请输入等级搜索" v-model="keyWords" clearable @clear="clear" class="input-with-select">
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
            label="等级名称"
            prop="level_name"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="说明"
            prop="desc"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="价值金额"
            prop="price"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="消费累积"
            prop="amount"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="优惠折扣"
            prop="discount"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="openED(2,scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDel(scope.row.level_id)">删除</el-button>
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
      :title="openTitle"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          等级名称：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请输入等级名称"
            v-model="levelName"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          等级说明：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            type="textarea"
            placeholder="请输入等级说明"
            v-model="levelDesc"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          价值金额：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请输入价值金额"
            v-model="levelPrice"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          消费累积：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请输入消费累积"
            v-model="levelPay"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          优惠折扣：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请输入优惠折扣"
            v-model="levelDiscount"
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
  import { userLevelList, addUserLevel , updateUserLevel , delUserLevel } from '@/api/purchase';
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
        // 关键字
        keyWords: '',
        // 弹窗
        dialogVisible: false,
        // 弹窗类型
        openType: 0,
        // 弹窗标题
        openTitle: '',
        // 等级名称
        levelName: '',
        // 等级说明
        levelDesc: '',
        // 价值金额
        levelPrice: '',
        // 消费累积
        levelPay: '',
        // 优惠折扣
        levelDiscount: '',
        // 编辑 Id
        getRowId: ''
      }
    },
    created() {
      this.tableData();
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
        userLevelList(params).then(res=>{
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
      openED(type,data){
        this.dialogVisible = true
        this.openType = type
        switch(type){
          case 1 :
            this.openTitle = '新增用户等级'
            this.getRowId = ''
            this.levelName = ''
            this.levelDesc = ''
            this.levelPrice = ''
            this.levelPay = ''
            this.levelDiscount = ''
            break;
          case 2 :
            this.openTitle = '编辑用户等级'
            this.getRowId = data.level_id
            this.levelName = data.level_name
            this.levelDesc = data.desc
            this.levelPrice = data.price
            this.levelPay = data.amount
            this.levelDiscount = data.discount
            break;
        }
      },
      // 确定
      handleSure(){
        if(!this.levelName){
          return this.$message({
            message: '请填写等级名称',
            type: 'warning'
          })
        }else if(!this.levelDesc){
          return this.$message({
            message: '请填写等级说明',
            type: 'warning'
          })
        }else if(!this.levelPrice){
          return this.$message({
            message: '请填写价值金额',
            type: 'warning'
          })
        }else if(!this.levelPay){
          return this.$message({
            message: '请填写消费累积',
            type: 'warning'
          })
        }else if(!this.levelDiscount){
          return this.$message({
            message: '请填写优惠折扣',
            type: 'warning'
          })
        }
        let data;
        switch(this.openType){
          case 1:
            // 添加
            data = {
              name: this.levelName,
              desc: this.levelDesc,
              price: this.levelPrice,
              amount: this.levelPay,
              discount: this.levelDiscount
            }
            addUserLevel(data).then(res=>{
              if(res){
                this.handleTips('添加成功');
              }
            });
            break;
          case 2:
            // 编辑
            data = {
              id: this.getRowId,
              name: this.levelName,
              desc: this.levelDesc,
              price: this.levelPrice,
              amount: this.levelPay,
              discount: this.levelDiscount
            }
            updateUserLevel(data).then(res=>{
              if(res){
                this.handleTips('编辑成功');
              }
            })
            break;
        }
        
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
      },
      // 删除
      handleDel(idx){
        this.$confirm('确定删除此条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: idx
          }
          delUserLevel(data).then(res=>{
            if(res){
              this.handleTips('删除成功');
            }
          });
        }).catch(() => {
          // 取消
        });
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
