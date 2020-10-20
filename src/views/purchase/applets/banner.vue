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
            label="ID"
            prop="id"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="图片"
            prop="name"
            width="200"
          >
            <el-image
              slot-scope="scope"
              :src="scope.row.bImgs"
              fit="cover"
            ></el-image>
          </el-table-column>
          <el-table-column
            label="标题"
            prop="title"
            width="200"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="排序"
            prop="weight"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="链接"
            prop="link"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="类型"
            prop="type_text"
            width="200"
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
            :uploadPicUrl="bannerImage"
            @uploadSuccess="upload"
          ></uplodImg>
        </el-col>
        <el-col class="ed-m-tips" :span="1">
          <el-tooltip class="item" effect="dark" content="推荐上传的轮播图片尺寸为：681px * 258px" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          轮播类型：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-select v-model="bannerType" placeholder="请选择轮播图类型">
            <el-option
              v-for="item in bannerTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          轮播标题：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写轮播图标题"
            v-model="bannerName"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          轮播链接：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写轮播图链接"
            v-model="bannerLink"
            clearable
          >
          </el-input>
        </el-col>
        <el-col class="ed-m-tips" :span="1">
          <el-tooltip class="item" effect="dark" content="内部链接请填写具体商品ID,外部链接请填写链接地址" placement="top">
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          轮播排序：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写轮播图排序"
            v-model="bannerSort"
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
            v-model="bannerUse"
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
  import { bannerList, bannerUserStatus , addBanner , updateBanner , delBanner } from '@/api/purchase';
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
        // 轮播图
        bannerImage : '',
        // 轮播类型
        bannerTypeList: [
          {
            value: 1,
            label: '原料'
          }, {
            value: 2,
            label: '粉料'
          }
        ],
        // 所选类型
        bannerType: '',
        // 轮播名称
        bannerName: '',
        // 轮播链接
        bannerLink: '',
        // 轮播排序
        bannerSort: '',
        // 轮播启用
        bannerUse: true,
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
      // 启用状态
      useChange(i){
        let status = i.isUse ? 1 : 0
        ,   data = {
          type: 'bannerYl',
          id: i.id,
          field: 'is_show',
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
        bannerList(params).then(res=>{
          res.data.data.forEach(i=>{
            switch(i.is_show){
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
            this.openTitle = '新增轮播图'
            this.getRowId = ''
            this.bannerImage = ''
            this.postImage = ''
            this.bannerType = ''
            this.bannerName = ''
            this.bannerLink = ''
            this.bannerSort = ''
            this.bannerUse = true
            break;
          case 2 :
            this.openTitle = '编辑轮播图'
            this.getRowId = data.id
            this.bannerImage = data.bImgs
            this.postImage = data.bImg
            this.bannerType = data.type_id
            this.bannerName = data.title
            this.bannerLink = data.links
            this.bannerSort = data.weight
            this.bannerUse = data.isUse
            break;
        }
      },
      // 上传图片
      upload(data){
        if(data.uploadPicImg){
          this.bannerImage = data.uploadPicUrl
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
            message: '请上传轮播图',
            type: 'warning'
          })
        }else if(!this.bannerType){
          return this.$message({
            message: '请选择轮播图类型',
            type: 'warning'
          })
        }else if(!this.bannerName){
          return this.$message({
            message: '请填写轮播图名称',
            type: 'warning'
          })
        }else if(!this.bannerLink){
          return this.$message({
            message: '请填写轮播图链接',
            type: 'warning'
          })
        }else if(!this.bannerSort){
          return this.$message({
            message: '请填写轮播图排序',
            type: 'warning'
          })
        }
        let data;
        switch(this.openType){
          case 1:
            // 添加
            data = {
              title: this.bannerName,
              bImg: this.postImage,
              weight: this.bannerSort,
              type_id: this.bannerType,
              link: this.bannerLink,
              is_show: this.bannerUse ? 1 : 0
            }
            addBanner(data).then(res=>{
              if(res){
                this.handleTips('添加成功');
              }
            });
            break;
          case 2:
            // 编辑
            data = {
              id: this.getRowId,
              title: this.bannerName,
              bImg: this.postImage,
              weight: this.bannerSort,
              type_id: this.bannerType,
              link: this.bannerLink,
              is_show: this.bannerUse ? 1 : 0
            }
            updateBanner(data).then(res=>{
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
        this.$confirm('确定删除此轮播图吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: idx
          }
          delBanner(data).then(res=>{
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
