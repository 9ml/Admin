<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="5" :lg="7">
        分类：
        <el-select v-model="calssValue" @change="getChoseValue" filterable placeholder="请选择用户等级">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="sl-t-item" :xl="5" :lg="7">
        上架：
        <el-select v-model="shelfValue" @change="getChoseValue" filterable placeholder="请选择用户标签">
          <el-option
            v-for="item in shelfList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="sl-t-item " :xl="5" :lg="7">
        库存：
        <el-select v-model="stockValue" @change="getChoseValue" filterable placeholder="请选择用户标签">
          <el-option
            v-for="item in stockList"
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
        <el-button
          type="success"
          icon="el-icon-upload2"
          @click="handleUpOrDown(true)"
        >
          批量上架
        </el-button>
        <el-button
          type="warning"
          icon="el-icon-download"
          @click="handleUpOrDown(false)"
        >
          批量下架
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
          @selection-change="selectChange"
        >
          <el-table-column
            type="selection"
            align="center"
            width="60"
          >
          </el-table-column>
          <el-table-column
            label="ID"
            prop="id"
            width="60"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="粉料名称"
            prop="name"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.goods_name}}</span>
          </el-table-column>
          <el-table-column
            label="粉料图片"
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
                  :src="scope.row.goodImgs"
                  fit="scale-down"
                ></el-image>
                <el-button slot="reference" size="small" type="info" circle>
                  <i class="el-icon-picture-outline-round" style="font-size: 22px;"></i>
                </el-button>
              </el-popover>
            </div>
          </el-table-column>
          <el-table-column
            label="分类"
            prop="name"
            width="120"
            align="center"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.cate.name}}</span>
          </el-table-column>
          <el-table-column
            label="价格(元)"
            prop="name"
            width="120"
            align="center"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.goods_price}} / 100g</span>
          </el-table-column>
          <el-table-column
            label="库存(斤)"
            prop="goods_storage"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="排序"
            prop="sort"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="上架"
            prop="name"
            width="80"
          >
            <div slot-scope="scope">
              <el-switch
                v-model="scope.row.is_on_sale"
                @change="useChange(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </div>
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="createtime"
            width="160"
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
      :close-on-click-modal="false"
      width="50%"
    >
      <el-tabs v-model="activeName" type="border-card" :before-leave="getTab">
        <el-tab-pane label="基本信息" name="first">
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              粉料分类：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-select v-model="powderClass" placeholder="请选择粉料分类">
                <el-option
                  v-for="item in classList"
                  v-if="item.name !== '全部'"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              运费模板：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-select v-model="freightValue" placeholder="请选择运费模板">
                <el-option
                  v-for="item in freightList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              粉料名称：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-input
                placeholder="请填写粉料名称"
                v-model="powderName"
                clearable
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              粉料售价：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-input
                placeholder="请填写售价"
                v-model="powderPrice"
                clearable
              >
                <template slot="prepend">每100g</template>
                <template slot="append">元</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              粉料成本价：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-input
                placeholder="请填写成本价"
                v-model="powderCost"
                clearable
              >
                <template slot="prepend">每100g</template>
                <template slot="append">元</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              粉料库存：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-input
                placeholder="请填写粉料库存"
                v-model="powderStock"
                clearable
              >
                <template slot="append">斤</template>
              </el-input>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              粉料排序：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-input
                placeholder="请填写粉料排序"
                v-model="powderSort"
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              是否上架：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-switch
                v-model="powderUse"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </el-col>
          </el-row>
          <el-row class="ed-item ed-center">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeTab('second')">下 一 步</el-button>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="附加信息" name="second">
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              封面图片：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <uplodImg
                :uploadPicUrl="vCoverImage"
                @uploadSuccess="uploadCover"
              ></uplodImg>
            </el-col>
            <!-- <el-col class="ed-m-tips" :span="1">
              <el-tooltip class="item" effect="dark" content="推荐上传的轮播图片尺寸为：681px * 258px" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-col> -->
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              详情图片：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <uplodImg
                :uploadPicUrl="vDetailsImage"
                @uploadSuccess="uploadDetails"
              ></uplodImg>
            </el-col>
            <!-- <el-col class="ed-m-tips" :span="1">
              <el-tooltip class="item" effect="dark" content="推荐上传的轮播图片尺寸为：681px * 258px" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-col> -->
          </el-row>
          <el-row class="ed-item ed-center">
            <el-button @click="changeTab('first')">上 一 步</el-button>
            <el-button type="primary" @click="handleSure">确 认</el-button>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
  import { powderList , bannerUserStatus , addPowder , updatePowder , delPowder , userGroup , batchHandle } from '@/api/purchase';
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
        // 商品分类
        classList: [],
        // 所选分类
        calssValue: '',
        // 上架列表
        shelfList: [],
        // 所选上架
        shelfValue: '',
        // 库存列表
        stockList: [],
        // 所选库存
        stockValue: '',
        // 运费模板
        freightList: [],
        // 所选运费
        freightValue: '',
        // 选中便签
        activeName: 'first',
        // 粉料分类
        powderClass: '',
        // 粉料名称
        powderName: '',
        // 粉料售价
        powderPrice: '',
        // 粉料成本价
        powderCost: '',
        // 粉料库存
        powderStock: '',
        // 粉料排序
        powderSort: '',
        // 粉料上架
        powderUse: true,
        // 编辑 Id
        getRowId: '',
        // 封面图（上传）
        pCoverImage: '',
        // 封面图（预览）
        vCoverImage: '',
        // 详情图（上传）
        pDetailsImage: '',
        // 详情图（预览）
        vDetailsImage: '',
        // 多选列表
        getSelectList: []
      }
    },
    created() {
      this.getScreenList();
      this.getFreightList();
      this.tableData();
    },
    methods: {
      // 获取筛选列表
      getScreenList(){
        let params = {
          type: 'product_tl'
        }
        userGroup(params).then(res=>{
          for(let key in res.data){
            res.data[key].forEach((i,i_idx)=>{
              if(i_idx === 0){
                i.name = '全部'
              }
            })
          }
          this.classList = res.data.type
          this.calssValue = res.data.type[0].id
          this.shelfList = res.data.is_on_sale
          this.shelfValue = res.data.is_on_sale[0].id
          this.stockList = res.data.stock
          this.stockValue = res.data.stock[0].id
        })
      },
      // 获取运费模板
      getFreightList(){
        let params = {
          type: 'freight_template'
        }
        userGroup(params).then(res=>{
          if(res){
            this.freightList = res.data.template_id
          }
        })
      },
      // 清空搜索框
      clear(){
        this.tableData()
      },
      // 启用状态
      useChange(i){
        let status = i.is_on_sale ? 1 : 0
        ,   data = {
          type: 'product',
          id: i.id,
          field: 'is_on_sale',
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
          type: this.calssValue,
          is_on_sale: this.shelfValue,
          stock: this.stockValue,
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords
        }
        powderList(params).then(res=>{
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
      // 筛选
      getChoseValue(){
        this.tableData()
      },
      // 弹窗
      openED(type,data){
        this.dialogVisible = true
        this.activeName = 'first'
        this.openType = type
        switch(type){
          case 1 :
            this.openTitle = '新增粉料'
            this.powderClass = ''
            this.freightValue = ''
            this.powderName = ''
            this.powderPrice = ''
            this.powderCost = ''
            this.powderStock = ''
            this.powderSort = ''
            this.vCoverImage = ''
            this.pCoverImage = ''
            this.vDetailsImage = ''
            this.pDetailsImage = ''
            this.powderUse = true
            break;
          case 2 :
            this.openTitle = '编辑粉料'
            this.getRowId = data.id
            this.powderClass = data.gc_id
            this.freightValue = data.template_id
            this.powderName = data.goods_name
            this.powderPrice = data.goods_price
            this.powderCost = data.goods_cost
            this.powderStock = data.goods_storage
            this.powderSort = data.goods_weight
            this.vCoverImage = data.goodImgs
            this.pCoverImage = data.goodImg
            this.vDetailsImage = data.goods_contents
            this.pDetailsImage = data.goods_content
            this.powderUse = data.is_on_sale
            break;
        }
      },
      // 上传封面图
      uploadCover(data){
        if(data.uploadPicImg){
          this.vCoverImage = data.uploadPicUrl
          this.pCoverImage = data.uploadPicImg
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success'
          });
        }
      },
      // 上传详情图
      uploadDetails(data){
        if(data.uploadPicImg){
          this.vDetailsImage = data.uploadPicUrl
          this.pDetailsImage = data.uploadPicImg
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success'
          });
        }
      },
      // 确定
      handleSure(){
        if(!this.pCoverImage){
          return this.$message({
            message: '请上传封面图',
            type: 'warning'
          })
        }else if(!this.pDetailsImage){
          return this.$message({
            message: '请上传详情图',
            type: 'warning'
          })
        }
        let data;
        switch(this.openType){
          case 1:
            // 添加
            data = {
              goods_name: this.powderName,
              goods_price: this.powderPrice,
              goods_cost: this.powderCost,
              gc_id: this.powderClass,
              goods_storage: this.powderStock,
              goodImg: this.pCoverImage,
              goods_content: this.pDetailsImage,
              specs: '以斤论价',
              brand: '伊穆家园',
              template_id: this.freightValue,
              is_on_sale: this.powderUse ? 1 : 0,
              sort: this.powderSort
            }
            addPowder(data).then(res=>{
              if(res){
                this.handleTips('添加成功');
              }
            });
            break;
          case 2:
            // 编辑
            data = {
              id: this.getRowId,
              goods_name: this.powderName,
              goods_price: this.powderPrice,
              goods_cost: this.powderCost,
              gc_id: this.powderClass,
              goods_storage: this.powderStock,
              goodImg: this.pCoverImage,
              goods_content: this.pDetailsImage,
              specs: '以斤论价',
              brand: '伊穆家园',
              template_id: this.freightValue,
              is_on_sale: this.powderUse ? 1 : 0,
              sort: this.powderSort
            }
            updatePowder(data).then(res=>{
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
        this.$confirm('确定删除此粉料商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: idx
          }
          delPowder(data).then(res=>{
            if(res){
              this.handleTips('删除成功');
            }
          });
        }).catch(() => {
          // 取消
        });
        
      },
      // 切换tab
      changeTab(type){
        switch(type){
          case 'second':
            this.inputCheck(res=>{
              if(res){
                this.activeName = type
              }
            })
            break;
          default:
            this.activeName = type
        }
      },
      getTab(news,olds){
        if(news == 'second'){
          let types = false;
          this.inputCheck(res=>{
            if(res){
              types = true
            }
          })
          return types
        }
      },
      // 校验输入框
      inputCheck(result){
        if(!this.powderClass){
          return this.$message({
            message: '请选择粉料分类',
            type: 'warning'
          })
        }else if(!this.freightValue){
          return this.$message({
            message: '请选择运费模板',
            type: 'warning'
          })
        }else if(!this.powderName){
          return this.$message({
            message: '请填写粉料名称',
            type: 'warning'
          })
        }else if(!this.powderPrice){
          return this.$message({
            message: '请填写粉料售价',
            type: 'warning'
          })
        }else if(!this.powderCost){
          return this.$message({
            message: '请填写粉料成本价',
            type: 'warning'
          })
        }else if(!this.powderStock){
          return this.$message({
            message: '请填写粉料库存',
            type: 'warning'
          })
        }else if(!this.powderSort){
          return this.$message({
            message: '请填写粉料排序',
            type: 'warning'
          })
        }
        result(true)
      },
      // 表格多选
      selectChange(value){
        let getList = []
        value.map(i=>{
          getList.push(i.id)
        })
        this.getSelectList = getList
      },
      // 上架 / 下架
      handleUpOrDown(type){
        if(this.getSelectList.length === 0){
          return this.$message({
            message: '请先选择商品',
            type: 'warning'
          })
        }
        let data = {
          type: 'online',
          field: 'is_on_sale',
          ids: this.getSelectList,
          value: type ? 1 : 0
        }
        batchHandle(data).then(res=>{
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
  .ed-center{
    display: flex;
    justify-content: center;
  }
</style>
