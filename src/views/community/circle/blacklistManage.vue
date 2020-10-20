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
        <el-input placeholder="请输入用户昵称搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
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
            label="用户昵称"
            prop="name"
            align="center"
          >
            <div slot-scope="scope">
              <span v-if="scope.row.user && scope.row.user.nickname">{{scope.row.user.nickname}}</span>
              <span v-else>账户已被删除</span>
            </div>
          </el-table-column>
          <el-table-column
            label="操作人员"
            prop="admin_name"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="禁言原因"
            prop="reason"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="禁言时间"
            prop="term"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="操作时间"
            prop="create_time"
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
                @click="handleDel(scope.row.id)">移除</el-button>
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
          禁言用户：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-select style="width:60%;" v-model="userValue" filterable placeholder="请选择要禁言的用户">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.nickname"
              :value="item.id">
              <span class="hiddenFonts" style="float: left">{{ item.nickname }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.mobilePhone || '无' }}</span>
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          禁言期限：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-select style="width:60%;" v-model="forbiddenWordsValue" filterable placeholder="请选择要禁言期限">
            <el-option
              v-for="item in forbiddenWordsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          禁言原因：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            type="textarea"
            placeholder="请填写禁言原因"
            v-model="forbiddenWordsReason"
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
  import { userGroup } from '@/api/purchase';
  import { blackList , addBlackList , updateBlackList , delBlackList } from '@/api/community';
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
        // 用户列表
        userList: [],
        // 所选用户
        userValue: '',
        // 禁言期限
        forbiddenWordsList: [
          {
            id: 1,
            name: '3天'
          },
          {
            id: 2,
            name: '10天'
          },
          {
            id: 3,
            name: '30天'
          },
          {
            id: 4,
            name: '永久'
          }
        ],
        // 所选期限
        forbiddenWordsValue: '',
        // 禁言原因
        forbiddenWordsReason: '',
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
      // 获取用户列表
      getUserList(){
        let params = {
          type: 'users'
        }
        userGroup(params).then(res=>{
          if(res){
            this.userList = res.data.users
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
      tableData(){
        this.listLoading = true
        let params = {
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords
        }
        blackList(params).then(res=>{
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
        this.openType = type
        switch(type){
          case 1 :
            this.getUserList();
            this.openTitle = '新增禁言用户'
            this.getRowId = ''
            this.userValue = ''
            this.forbiddenWordsValue = ''
            this.forbiddenWordsReason = ''
            break;
          case 2 :
            this.openTitle = '编辑禁言用户'
            this.getRowId = data.id
            this.userValue = data.uid
            this.forbiddenWordsValue = data.term_type
            this.forbiddenWordsReason = data.reason
            break;
        }
        this.dialogVisible = true
      },
      // 确定
      handleSure(){
        if(!this.userValue){
          return this.$message({
            message: '请选择禁言用户',
            type: 'warning'
          })
        }else if(!this.forbiddenWordsValue){
          return this.$message({
            message: '请选择禁言期限',
            type: 'warning'
          })
        }else if(!this.forbiddenWordsReason){
          return this.$message({
            message: '请填写禁言原因',
            type: 'warning'
          })
        }
        let data;
        switch(this.openType){
          case 1:
            // 添加
            data = {
              uid: this.userValue,
              term_type: this.forbiddenWordsValue,
              reason: this.forbiddenWordsReason
            }
            addBlackList(data).then(res=>{
              if(res){
                this.handleTips('添加成功');
              }
            });
            break;
          case 2:
            // 编辑
            data = {
              id: this.getRowId,
              uid: this.userValue,
              term_type: this.forbiddenWordsValue,
              reason: this.forbiddenWordsReason
            }
            updateBlackList(data).then(res=>{
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
        this.$confirm('确定从禁言列表中移除此用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: idx
          }
          delBlackList(data).then(res=>{
            if(res){
              this.handleTips('移除成功');
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
