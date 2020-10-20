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
        <el-input placeholder="请输入名称搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
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
            label="角色名称"
            prop="role_name"
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
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="openED(2,scope.row)">编辑</el-button>
                <el-button
                size="mini"
                type="warning"
                @click="roleMore(scope.row)">权限</el-button>
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
    <!-- 新增 / 修改弹窗 -->
    <el-dialog
      :title="openTitle"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          角色名称：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写角色名称"
            v-model="roleName"
            clearable
          >
          </el-input>
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
    <!-- 权限弹窗 -->
    <el-dialog
      :title="rTitleName"
      :visible.sync="dialogRole"
      width="40%"
    >
      <el-tree
        ref="tree"
        :data="roleLists.auth"
        show-checkbox
        node-key="id"
        highlight-current
        :props="defaultProps"
        :default-checked-keys="roleLists.checks"
        @check-change="handleCheckChange"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogRole = false">取 消</el-button>
        <el-button type="primary" @click="sureRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { bannerUserStatus } from '@/api/purchase';
  import { roleList , addRole , updateRole , delRole , getRoleList , updateGetRoleList } from '@/api/set';
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
        roleName: '',
        // 是否启用
        isUse: true,
        // 编辑 Id
        getRowId: '',
        // 权限弹窗
        dialogRole: false,
        // 权限弹窗标题
        rTitleName: '',
        // 权限列表
        roleLists: [],
        // 树组件配置项
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 所有选中的节点
        pickOnArray: []
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
      // 切换状态
      useChange(i){
        let status = i.isUse ? 1 : 0
        ,   data = {
          type: 'adminRole',
          id: i.id,
          field: 'is_display',
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
          keyword: this.keyWords
        }
        roleList(params).then(res=>{
          res.data.data.forEach(i=>{
            if(i.is_display === 1){
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
            this.openTitle = '新增角色'
            this.getRowId = ''
            this.roleName = ''
            this.isUse = true
            break;
          case 2 :
            this.openTitle = '编辑角色'
            this.getRowId = data.id
            this.roleName = data.role_name
            this.isUse = data.isUse
            break;
        }
      },
      // 确定
      handleSure(){
        if(!this.roleName){
          return this.$message({
            message: '请填写角色名称',
            type: 'warning'
          })
        }
        let data;
        switch(this.openType){
          case 1:
            // 添加
            data = {
              role_name: this.roleName,
              status: this.isUse ? 1 : 0
            }
            addRole(data).then(res=>{
              if(res){
                this.handleTips('添加成功');
              }
            });
            break;
          case 2:
            // 编辑
            data = {
              id: this.getRowId,
              role_name: this.roleName,
              status: this.isUse ? 1 : 0
            }
            updateRole(data).then(res=>{
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
        this.dialogRole = false
        this.getRowId = ''
        this.$notify({
          title: '成功',
          message: msg,
          type: 'success'
        });
        this.tableData();
      },
      // 删除
      handleDel(idx){
        this.$confirm('确定删除此角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: idx
          }
          delRole(data).then(res=>{
            if(res){
              this.handleTips('删除成功');
            }
          });
        }).catch(() => {
          // 取消
        });
      },
      // 权限
      roleMore(data){
        this.getRowId = data.id
        let params = {
          id: data.id
        }
        getRoleList(params).then(res=>{
          if(res){
            this.rTitleName = '修改 ' + data.role_name + ' 权限'
            this.roleLists = res.data
            this.dialogRole = true
          }
        })
      },
      renderContent(h, { node, data, store }) {
        let classname = "";
        if (node.level === 3) {
          classname = "levelname";
        }
        // 由于项目中有二级菜单也有三级菜单，就要在此做出判断。
        if (node.level === 2 && node.childNodes.length === 0) {
          classname = "levelname";
        }
        return <p class={classname}>{node.label}</p>;
      },
      handleCheckChange() {
        this.pickOnArray = []
        let res = this.$refs.tree.getCheckedNodes();
        res.forEach(item => {
          this.pickOnArray.push(item.id);
        });
      },
      sureRole(){
        let data = {
          id: this.getRowId,
          rules: this.pickOnArray.toString()
        }
        updateGetRoleList(data).then(res=>{
          if(res){
            this.handleTips('操作成功')
          }
        })
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
