<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="5" :lg="6">
        类型筛选：
        <el-select v-model="calssValue" filterable @change="getChoseValue" placeholder="请选择状态">
          <el-option
            v-for="item in classList"
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
        <el-input placeholder="请输入标题搜索" v-model="keyWords" clearable @clear="clear" class="input-with-select">
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
            label="分类名称"
            prop="name"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="分类图片"
            prop="name"
            width="120"
            align="center"
          >
            <div slot-scope="scope">
              <el-popover
                placement="left"
                trigger="click"
              >
                <el-image
                  style="width:500px;height:400px;"
                  :src="scope.row.cate_urls"
                  fit="scale-down"
                ></el-image>
                <el-button slot="reference" size="small" type="info" circle>
                  <i class="el-icon-picture-outline-round" style="font-size: 22px;"></i>
                </el-button>
              </el-popover>
            </div>
          </el-table-column>
          <el-table-column
            label="分类标题"
            prop="title"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="短标题"
            prop="subtitle"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="排序"
            prop="weight"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="类型"
            prop="ctype_text"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="启用"
            prop="name"
            width="150"
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
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="openED(2,scope.row)">编辑</el-button>
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
      width="40%"
    >
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          上传图片：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <uplodImg
            :uploadPicUrl="viewImage"
            @uploadSuccess="upload"
          ></uplodImg>
        </el-col>
        <el-col class="ed-m-tips" :span="1">
          <el-tooltip class="item" effect="dark" content="推荐上传的分类图片尺寸为：678px * 160px" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          分类类型：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-select v-model="typeValue" placeholder="请选择分类类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          分类名称：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写分类名称"
            v-model="className"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          分类标题：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写分类标题"
            v-model="classTitle"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          短标题：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写短标题"
            v-model="subTitle"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          分类排序：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写分类排序"
            v-model="classSort"
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
            v-model="classUse"
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
  </div>
</template>
<script>
  import { cateList, addCate , updateCate , delCate , userGroup , bannerUserStatus } from '@/api/purchase';
  import uplodImg from "@/components/uplodImg.vue";
  export default {
    components: { uplodImg },
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
        // 分类列表
        classList: [],
        // 所选分类
        calssValue: '',
        // 展示图
        viewImage: '',
        // 发送图
        postImage: '',
        // 类型
        typeList: [
          {
            value: 1,
            label: '原料'
          }, {
            value: 2,
            label: '粉料'
          }
        ],
        // 所选类型
        typeValue: '',
        // 分类名称
        className: '',
        // 分类标题
        classTitle: '',
        // 短标题
        subTitle: '',
        // 分类排序
        classSort: '',
        // 启用状态
        classUse: true,
        // 编辑 Id
        getRowId: ''
      }
    },
    created() {
      this.getClass();
      this.tableData();
    },
    methods: {
      // 获取分类
      getClass(){
        let params = {
          type: 'cate'
        }
        userGroup(params).then(res=>{
          if(res){
            res.data.ctype[0].name = '全部'
            this.calssValue = res.data.ctype[0].id
            this.classList = res.data.ctype
          }
        })
      },
      // 清空搜索框
      clear(){
        this.tableData()
      },
      // 筛选数据
      getChoseValue(){
        this.tableData()
      },
      // 启用状态
      useChange(i){
        let status = i.isUse ? 1 : 0
        ,   data = {
          type: 'productCate',
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
          ctype: this.calssValue,
          keyword: this.keyWords
        }
        cateList(params).then(res=>{
          res.data.data.forEach(i=>{
            switch(i.status){
              case 1 :
                i.isUse = true
                break;
              default :
                i.isUse = false
            }
          });
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
            this.openTitle = '新增产品分类'
            this.getRowId = ''
            this.viewImage = ''
            this.postImage = ''
            this.typeValue = ''
            this.className = ''
            this.classTitle = ''
            this.subTitle = ''
            this.classSort = ''
            this.classUse = true
            break;
          case 2 :
            this.openTitle = '编辑产品分类'
            this.getRowId = data.id
            this.viewImage = data.cate_urls
            this.postImage = data.cate_url
            this.typeValue = data.ctype
            this.className = data.name
            this.classTitle = data.title
            this.subTitle = data.subtitle
            this.classSort = data.weight
            this.classUse = data.isUse
            break;
        }
      },
      // 上传图片
      upload(data){
        if(data.uploadPicImg){
          this.viewImage = data.uploadPicUrl
          this.postImage = data.uploadPicImg
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success'
          });
        }
      },
      // 确定
      handleSure(){
        if(!this.postImage){
          return this.$message({
            message: '请上传分类图片',
            type: 'warning'
          })
        }else if(!this.typeValue){
          return this.$message({
            message: '请选择轮分类类型',
            type: 'warning'
          })
        }else if(!this.className){
          return this.$message({
            message: '请填写分类名称',
            type: 'warning'
          })
        }else if(!this.classTitle){
          return this.$message({
            message: '请填写分类标题',
            type: 'warning'
          })
        }else if(!this.subTitle){
          return this.$message({
            message: '请填写短标题',
            type: 'warning'
          })
        }else if(!this.classSort){
          return this.$message({
            message: '请填写分类排序',
            type: 'warning'
          })
        }
        let data;
        switch(this.openType){
          case 1:
            // 添加
            data = {
              name: this.className,
              title: this.classTitle,
              ctype: this.typeValue,
              subtitle: this.subTitle,
              cate_url: this.postImage,
              weight: this.classSort,
              status: this.classUse ? 1 : 0
            }
            addCate(data).then(res=>{
              if(res){
                this.handleTips('添加成功');
              }
            });
            break;
          case 2:
            // 编辑
            data = {
              id: this.getRowId,
              name: this.className,
              title: this.classTitle,
              ctype: this.typeValue,
              subtitle: this.subTitle,
              cate_url: this.postImage,
              weight: this.classSort,
              status: this.classUse ? 1 : 0
            }
            updateCate(data).then(res=>{
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
        this.$confirm('确定删除此分类吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: idx
          }
          delCate(data).then(res=>{
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
