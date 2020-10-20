<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="5" :lg="6">
        角色：
        <el-select v-model="changeValue" filterable @change="getChoseValue" placeholder="请选择角色名称">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
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
        <el-input placeholder="请输入用户名称搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-input>
      </el-col>
      <el-col class="tm-mains" :span="24">
        <el-table
          :data="getData.data"
          empty-text="暂无数据"
          style="width: 100%"
          v-loading="listLoading"
          :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}">
          <el-table-column
            label="角色名称"
            prop="name"
            align="center"
          >
            <div slot-scope="scope">
              <span>{{scope.row.role.role_name}}</span>
            </div>
          </el-table-column>
          <el-table-column
            label="用户名称"
            prop="username"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="真实姓名"
            prop="realname"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="phone"
            width="160"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="是否超管"
            prop="is_super_text"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="启用状态"
            prop="name"
            align="center"
          >
            <div slot-scope="scope">
              <el-switch
                v-model="scope.row.isUse"
                @change="useChange(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </div>
          </el-table-column>
          <el-table-column
            label="负责区域"
            prop="pList"
            align="center"
            width="160"
          >
            <div slot-scope="scope">
              <span v-if="scope.row.pList.length === 0">无</span>
              <el-tooltip v-else class="item" effect="dark" :content="scope.row.pList.join(',')" placement="top">
                <span class="hiddenFonts">{{scope.row.pList.join(',')}}</span>
              </el-tooltip>
            </div>
          </el-table-column>
          <el-table-column
            label="最后登录时间"
            prop="last_logintime"
            align="center"
            width="160"
          >
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="openED(2,scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="warning"
                @click="setArea(scope.row)">区域</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDel(scope.row.id)">删除</el-button>
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
      width="40%">
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          角色名称：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-select v-model="rolesValue" filterable placeholder="请选择角色名称">
          <el-option
            v-for="item in rolesList"
            v-if="item.name != '全部'"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          手机号码：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写手机号码"
            v-model="userPhone"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          用户名称：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写用户名称"
            v-model="userName"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          真实姓名：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写真实姓名"
            v-model="realName"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          是否超管：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-switch
            v-model="isAdmin"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          是否启用：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-switch
            v-model="isUse"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑负责区域"
      :visible.sync="dialogsetArea"
      width="50%">
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          负责区域：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="19">
          <el-tree
            ref="tree"
            :data="rList"
            show-checkbox
            node-key="id"
            :props="defaultProps"
            :default-checked-keys="checkRList"
            @check-change="handleCheckChange">
          </el-tree>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogsetArea = false">取 消</el-button>
        <el-button type="primary" @click="sureSet">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { userGroup , bannerUserStatus } from '@/api/purchase';
  import { adminList , addAdmin , updateAdmin , delAdmin , freightRegion } from '@/api/set';
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
        // 角色名称
        rolesList: [],
        // 所选角色
        rolesValue: '',
        // 是否启用
        isUse: true,
        // 是否超管
        isAdmin: true,
        // 用户名称
        userName: '',
        // 真实姓名
        realName: '',
        // 编辑 Id
        getRowId: '',
        // 编辑配送区域弹窗
        dialogsetArea: false,
        // 默认项
        defaultProps: {
          children: 'provinces',
          label: 'name'
        },
        // 配送区域列表
        rList: [],
        // 选中节点
        checkRList: [],
        // 所选区域
        regionList: [],
        // 用户id
        userId: '',
        // 手机号
        userPhone: '',
        // 所选角色
        changeValue: ''
      }
    },
    created() {
      this.getRolesList();
      this.getRegionList();
    },
    methods: {
      getChoseValue(){
        this.tableData()
      },
      // 获取配送区域
      getRegionList(){
        freightRegion().then(res=>{
          if(res){
            this.rList = res.data
          }
        })
      },
      // 选择区域
      handleCheckChange() {
        let res = this.$refs.tree.getCheckedNodes();
        res.forEach((i,i_idx) => {
          if(!i.code){
            res.splice(i_idx,1)
          }
        });
        this.regionList = res
      },
      // 设置区域
      setArea(i){
        this.userId = i.id
        this.checkRList = i.power
        this.regionList = i.powers
        this.$nextTick(()=>{
          this.$refs.tree.setCheckedKeys(i.power)
        })
        this.dialogsetArea = true
      },
      // 确定设置
      sureSet(){
        if(this.regionList.length === 0){
          return this.$message({
            message: '请操作区域后再保存',
            type: 'warning'
          });
        }
        let data = {
          type: 'adminUser',
          id: this.userId,
          field: 'power',
          value: this.regionList
        }
        bannerUserStatus(data).then(res=>{
          if(res){
            this.handleTips('操作成功',2)
          }
        })
      },
      // 清空搜索框
      clear(){
        this.tableData()
      },
      getRolesList(){
        let params = {
          type: 'roles'
        }
        userGroup(params).then(res=>{
          if(res){
            this.changeValue = res.data.roles[0].id
            this.rolesList = res.data.roles
            this.tableData();
          }
        })
      },
      // 切换状态
      useChange(i){
        let status = i.isUse ? 1 : 0
        ,   data = {
          type: 'adminUser',
          id: i.id,
          field: 'status',
          value: status
        }
        bannerUserStatus(data).then(res=>{
          if(res){
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            });
            this.tableData();
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
          keyword: this.keyWords,
          roles: this.changeValue
        }
        adminList(params).then(res=>{
          res.data.data.forEach(i=>{
            i.pList = []
            if(i.powers){
              i.powers.forEach(v=>{
                i.pList.push(v.name)
              })
            }
            if(i.status === 1){
              i.isUse = true
            }else{
              i.isUse = false
            }
          })
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
            this.openTitle = '新增管理员'
            this.rolesValue = ''
            this.getRowId = ''
            this.userName = ''
            this.realName = ''
            this.regionList = ''
            this.userPhone = ''
            this.isUse = true
            this.isAdmin = true
            break;
          case 2 :
            this.openTitle = '编辑管理员'
            this.getRowId = data.id
            this.rolesValue = data.role_id
            this.userPhone = data.phone
            this.userName = data.username
            this.realName = data.realname
            this.isUse = data.isUse
            this.isAdmin = data.is_super === 1 ? true : false
            break;
        }
      },
      // 确定
      handleSure(){
        if(!this.rolesValue){
          return this.$message({
            message: '请选择角色名称',
            type: 'warning'
          })
        }else if(!this.userPhone){
          return this.$message({
            message: '请填写用户手机号',
            type: 'warning'
          })
        }else if(!this.userName){
          return this.$message({
            message: '请填写用户名称',
            type: 'warning'
          })
        }else if(!this.realName){
          return this.$message({
            message: '请填写真实姓名',
            type: 'warning'
          })
        }
        let data;
        switch(this.openType){
          case 1:
            // 添加
            data = {
              username: this.userName,
              realname: this.realName,
              phone: this.userPhone,
              role_id: this.rolesValue,
              is_super: this.isAdmin ? 1 : 0,
              status: this.isUse ? 1 : 0
            }
            addAdmin(data).then(res=>{
              if(res){
                this.handleTips('添加成功',1);
              }
            });
            break;
          case 2:
            // 编辑
            data = {
              id: this.getRowId,
              username: this.userName,
              realname: this.realName,
              phone: this.userPhone,
              password: '',
              role_id: this.rolesValue,
              is_super: this.isAdmin ? 1 : 0,
              status: this.isUse ? 1 : 0
            }
            updateAdmin(data).then(res=>{
              if(res){
                this.handleTips('编辑成功',1);
              }
            })
            break;
        }
        
      },
      // 操作提示
      handleTips(msg,type){
        switch(type){
          case 1:
            this.dialogVisible = false
          break;
          case 2:
            this.dialogsetArea = false
          break;
        }
        this.$notify({
          title: '成功',
          message: msg,
          type: 'success'
        });
        this.tableData();
      },
      // 删除
      handleDel(idx){
        this.$confirm('确定删除此管理员吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: idx
          }
          delAdmin(data).then(res=>{
            if(res){
              this.handleTips('删除成功',1);
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
