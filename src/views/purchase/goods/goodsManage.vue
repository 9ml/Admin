<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :span="6">
        分类：
        <el-select v-model="calssValue" @change="getChoseValue" filterable placeholder="请选择商品分类">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="sl-t-item" :span="6">
        类型：
        <el-select v-model="typeValue" @change="getChoseValue" filterable placeholder="请选择商品类型">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="sl-t-item" :span="6">
        库存：
        <el-select v-model="stockValue" @change="getChoseValue" filterable placeholder="请选择库存类型">
          <el-option
            v-for="item in stockList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="sl-t-item" :span="6">
        上架：
        <el-select v-model="shelfValue" @change="getChoseValue" filterable placeholder="请选择是否上架">
          <el-option
            v-for="item in shelfList"
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
          :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}"
          style="width: 100%"
          v-loading="listLoading"
          @selection-change="selectChange">
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
            label="商品名称"
            prop="name"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.goods_name}}</span>
          </el-table-column>
          <el-table-column
            label="商品图片"
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
            label="库存"
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
            label="商品类型"
            prop="goods_weight"
            width="120"
            align="center"
          >
            <div slot-scope="scope">
              <el-select v-model="scope.row.pro_type" size="small" @change="handleUpdate(scope.row)">
                <el-option
                  v-for="item in scope.row.goodsType"
                  v-if="item.name !== '全部'"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
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
      top="4%"
      width="60%"
    >
      <el-tabs v-model="activeName" type="border-card" :before-leave="getTab">
        <el-tab-pane label="基本信息" name="first">
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              商品分类：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-select v-model="goodsClass" placeholder="请选择商品分类">
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
              商品类型：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-select v-model="goodsType" placeholder="请选择商品类型">
                <el-option
                  v-for="item in typeList"
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
              商品名称：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-input
                placeholder="请填写商品名称"
                v-model="goodsName"
                clearable
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              商品规格：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-input
                placeholder="请填写商品规格"
                v-model="goodsSpec"
                clearable
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              商品品牌：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-input
                placeholder="请填写商品品牌"
                v-model="goodsBrand"
                clearable
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              商品排序：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-input
                placeholder="请填写商品排序"
                v-model="goodsSort"
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
                v-model="goodsUse"
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
        <el-tab-pane label="组合信息" name="second">
          <el-row class="table-mains">
            <el-col class="tm-top" style="justify-content: flex-start;" :xl="19" :lg="17">
              <el-button
                type="primary"
                icon="el-icon-plus"
                style="margin-left:20px;"
                @click="handleCBT(1)"
              >
                新增组合
              </el-button>
              <el-tooltip class="item" effect="dark" content="若商品没有组合信息，组合名称写为 “默认” ，只添加一条数据作为商品基本信息。" placement="right">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </el-col>
            <el-col class="tm-mains" :span="24">
              <el-table
                :data="combinationList"
                style="width: 100%"
                empty-text="暂无数据"
                :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}"
              >
                <el-table-column
                  prop="attr_value"
                  label="组合名称"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="attr_cost_price"
                  label="成本价"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="attr_goods_mark_price"
                  label="划线价"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="attr_price"
                  label="售价"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="attr_storage"
                  label="库存"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="attr_weight"
                  label="重量"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="bonus_points"
                  label="赠送积分"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="操作"
                  width="160"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handleCBT(2,scope.row,scope.$index)">编辑</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      @click="delCBTRow(scope.row,scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row class="ed-item ed-center" style="margin-top:20px;">
            <el-button @click="backTab('first')">上 一 步</el-button>
            <el-button type="primary" @click="changeTab('third')">下 一 步</el-button>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="附加信息" name="third">
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              商品封面图(单图)：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <uplodImg
                :uploadPicUrl="vCoverImage"
                @uploadSuccess="uploadCover"
              ></uplodImg>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              商品展示图(多图)：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <el-row>
                <el-col class="ed-m-m-list" :span="24">
                  <div class="ed-m-m-item"
                    v-for="(item,index) in pShowImage"  :key="index"
                    v-dragging="{ item: item, list: pShowImage, group: 'item' }"
                  >
                    <el-image
                      style="width:150px;height:100px;"
                      :src="'http://res.ycw.emjiayuan.com/'+item"
                      fit="cover"
                      :preview-src-list="vShowImage"
                    >
                      <div slot="placeholder" class="image-slot">
                        加载中<span class="dot">...</span>
                      </div>
                    </el-image>
                  </div>
                </el-col>
              </el-row>
              <moreUplodImg
                :uploadPicUrl="vShowImage"
                @uploadSuccess="uploadShow"
              ></moreUplodImg>
            </el-col>
          </el-row>
          <el-row class="ed-item">
            <el-col class="ed-m-name" :span="4">
              商品详情图(单图)：
            </el-col>
            <el-col class="ed-m-mains" :offset="1" :span="18">
              <uplodImg
                :uploadPicUrl="vDetailsImage"
                @uploadSuccess="uploadDetails"
              ></uplodImg>
            </el-col>
          </el-row>
          <el-row class="ed-item ed-center" style="margin-top:20px;">
            <el-button @click="backTab('second')">上 一 步</el-button>
            <el-button type="primary" @click="handleSure">确 认</el-button>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        width="40%"
        :title="cbtTitle"
        :visible.sync="addCombination"
        :close-on-click-modal="false"
        append-to-body
      >
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            组合名称：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              placeholder="请填写组合名称"
              v-model="cbtName"
              clearable
            >
            </el-input>
          </el-col>
          <el-col class="ed-m-tips" :span="1">
            <el-tooltip class="item" effect="dark" content="若商品无组合信息，此处填为：“默认”" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            成本价：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              placeholder="请填写商品成本价"
              v-model="cbtCost"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            划线价：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              placeholder="请填写商品划线价"
              v-model="cbtLine"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            售价：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              placeholder="请填写商品售价"
              v-model="cbtPrice"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            库存：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              placeholder="请填写商品库存"
              v-model="cbtStock"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            重量：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              placeholder="请填写商品重量"
              v-model="cbtWeight"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            赠送积分：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              placeholder="请填写购买商品赠送积分"
              v-model="cbtIntegral"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCombination = false">取 消</el-button>
          <el-button type="primary" @click="handleCBTData">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
  import { goodsList, bannerUserStatus , addGoods , updateGoods , delGoods , userGroup , batchHandle , addCombination , updateCombination , delCombination } from '@/api/purchase';
  import uplodImg from "@/components/uplodImg.vue";
  import moreUplodImg from "@/components/moreUplodImg.vue";
  export default {
    components: { uplodImg , moreUplodImg },
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
        // 类型列表
        typeList: [],
        // 所选类型
        typeValue: '',
        // 选中便签
        activeName: 'first',
        // 上架列表
        shelfList: [],
        // 所选上架
        shelfValue: '',
        // 库存列表
        stockList: [],
        // 所选库存
        stockValue: '',
        // 多选列表
        getSelectList: [],
        // 所选商品分类
        goodsClass: '',
        // 所选商品类型
        goodsType: '',
        // 运费模板
        freightList: [],
        // 所选运费
        freightValue: '',
        // 商品名称
        goodsName: '',
        // 商品规格
        goodsSpec: '',
        // 商品品牌
        goodsBrand: '',
        // 是否上架
        goodsUse: true,
        // 商品排序
        goodsSort: '',
        // 组合列表
        combinationList: [],
        // 添加组合
        addCombination: false,
        // 组合标题
        cbtTitle: '',
        // 组合id
        cbtId: '',
        // 组合名称
        cbtName: '',
        // 成本价
        cbtCost: '',
        // 划线价
        cbtLine: '',
        // 售价
        cbtPrice: '',
        // 库存
        cbtStock: '',
        // 重量
        cbtWeight: '',
        // 积分
        cbtIntegral: '',
        // 组合操作类型
        cbtHandleType: '',
        // 组合编辑下标
        cbtHandleIndex: '',
        // 商品封面图(预览)
        vCoverImage: '',
        // 商品封面图(上传)
        pCoverImage: '',
        // 详情图（预览）
        vDetailsImage: '',
        // 详情图（上传）
        pDetailsImage: '',
        // 展示图（预览）
        vShowImage: [],
        // 展示图（上传）
        pShowImage: []
      }
    },
    created() {
      this.getScreenList();
      this.getFreightList();
    },
    mounted () {
      this.$dragging.$on('dragged', ({ value }) => {
        this.pShowImage = value.list
      })
    },
    methods: {
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
      // 获取筛选列表
      getScreenList(){
        let params = {
          type: 'product_yl'
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
          this.typeList = res.data.pro_type
          this.typeValue = res.data.pro_type[0].id
          this.tableData();
        })
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
      // 更新
      handleUpdate(i){
        let data = {
          type: 'product',
          id: i.id,
          field: 'pro_type',
          value: i.pro_type
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
          pro_type: this.typeValue,
          stock: this.stockValue,
          id: '',
          createtime: '',
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords
        }
        goodsList(params).then(res=>{
          res.data.data.forEach(i=>{
            i.goodsType = this.typeList
            i.pro_type = i.pro_type + ''
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
      // 筛选
      getChoseValue(){
        this.tableData()
      },
      // 弹窗
      openED(type,data){
        this.activeName = 'first'
        this.dialogVisible = true
        this.openType = type
        switch(type){
          case 1 :
            this.openTitle = '新增商品'
            this.getRowId = ''
            this.goodsClass = ''
            this.freightValue = ''
            this.goodsType = ''
            this.goodsName = ''
            this.goodsSpec = ''
            this.goodsBrand = ''
            this.goodsSort = ''
            this.combinationList = []
            this.pCoverImage = ''
            this.vCoverImage = ''
            this.pDetailsImage = ''
            this.vDetailsImage = ''
            this.pShowImage = []
            this.vShowImage = []
            this.goodsUse = true
            break;
          case 2 :
            this.pShowImage = []
            this.vShowImage = []
            data.image.forEach(i=>{
              this.pShowImage.push(i.goods_img)
              this.vShowImage.push(i.goods_imgs)
            });
            this.openTitle = '编辑商品'
            this.getRowId = data.id
            this.goodsClass = data.gc_id
            this.goodsType = data.pro_type
            this.goodsName = data.goods_name
            this.goodsSpec = data.specs
            this.goodsBrand = data.brand
            this.goodsSort = data.sort
            this.freightValue = data.template_id
            this.combinationList = data.attr
            this.pCoverImage = data.goodImg
            this.vCoverImage = data.goodImgs
            this.pDetailsImage = data.goods_content
            this.vDetailsImage = data.goods_contents
            this.goodsUse = data.is_on_sale
            break;
        }
      },
      // 确定
      handleSure(){
        if(!this.goodsClass){
          return this.$message({
            message: '请选择商品分类',
            type: 'warning'
          })
        }else if(!this.goodsType){
          return this.$message({
            message: '请选择商品类型',
            type: 'warning'
          })
        }else if(!this.freightValue){
          return this.$message({
            message: '请选择运费模板',
            type: 'warning'
          })
        }else if(!this.goodsName){
          return this.$message({
            message: '请填写商品名称',
            type: 'warning'
          })
        }else if(!this.goodsSpec){
          return this.$message({
            message: '请填写商品规格',
            type: 'warning'
          })
        }else if(!this.goodsBrand){
          return this.$message({
            message: '请填写商品品牌',
            type: 'warning'
          })
        }else if(this.combinationList.length === 0){
          return this.$message({
            message: '请添加商品组合，若商品无组合信息需要添加一条组合名称为 “默认” 的作为基本信息',
            type: 'warning'
          })
        }else if(!this.pCoverImage){
          return this.$message({
            message: '请上传封面图',
            type: 'warning'
          })
        }else if(this.pShowImage.length === 0){
          return this.$message({
            message: '请上传展示图',
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
              goods_name: this.goodsName,
              gc_id: this.goodsClass,
              goodImg: this.pCoverImage,
              goodImgMany: this.pShowImage,
              goods_content: this.pDetailsImage,
              goods_attr: this.combinationList,
              is_on_sale: this.goodsUse,
              specs: this.goodsSpec,
              brand: this.goodsBrand,
              template_id: this.freightValue,
              pro_type: this.goodsType,
              sort: this.goodsSort
            }
            addGoods(data).then(res=>{
              if(res){
                this.handleTips('添加成功');
              }
            });
            break;
          case 2:
            // 编辑
            data = {
              id: this.getRowId,
              goods_name: this.goodsName,
              gc_id: this.goodsClass,
              goodImg: this.pCoverImage,
              goodImgMany: this.pShowImage,
              goods_content: this.pDetailsImage,
              goods_attr: this.combinationList,
              is_on_sale: this.goodsUse,
              specs: this.goodsSpec,
              brand: this.goodsBrand,
              template_id: this.freightValue,
              pro_type: this.goodsType,
              sort: this.goodsSort
            }
            updateGoods(data).then(res=>{
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
        this.$confirm('确定删除此商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: idx
          }
          delGoods(data).then(res=>{
            if(res){
              this.handleTips('删除成功');
            }
          });
        }).catch(() => {
          // 取消
        });
      },
      // 直接切换
      getTab(news,olds){
        let types = false;
        this.inputCheck(news,res=>{
          if(res){
            types = true
          }
        })
        return types
      },
      // 切换tab
      changeTab(type){
        this.inputCheck(type,res=>{
          if(res){
            this.activeName = type
          }
        })
      },
      // tab返回
      backTab(type){
        this.activeName = type
      },
      inputCheck(type,result){
        switch(type){
          case 'first':
            result(true)
            break;
          case 'second':
            if(!this.goodsClass){
              return this.$message({
                message: '请选择商品分类',
                type: 'warning'
              })
            }else if(!this.goodsType){
              return this.$message({
                message: '请选择商品类型',
                type: 'warning'
              })
            }else if(!this.freightValue){
              return this.$message({
                message: '请选择运费模板',
                type: 'warning'
              })
            }else if(!this.goodsName){
              return this.$message({
                message: '请填写商品名称',
                type: 'warning'
              })
            }else if(!this.goodsSpec){
              return this.$message({
                message: '请填写商品规格',
                type: 'warning'
              })
            }else if(!this.goodsBrand){
              return this.$message({
                message: '请填写商品品牌',
                type: 'warning'
              })
            }
            result(true)
            break;
          case 'third':
            if(this.combinationList.length === 0){
              return this.$message({
                message: '请添加商品组合，若商品无组合信息需要添加一条组合名称为 “默认” 的作为基本信息',
                type: 'warning'
              })
            }
            result(true)
            break;
        }
      },
      // 组合弹窗
      handleCBT(type,data,index){
        this.cbtHandleType = type
        switch(type){
          case 1:
            this.cbtId = ''
            this.cbtName = ''
            this.cbtCost = ''
            this.cbtLine = ''
            this.cbtPrice = ''
            this.cbtStock = ''
            this.cbtWeight = ''
            this.cbtIntegral = ''
            this.cbtTitle = '新增组合'
            break;
          case 2:
            this.cbtHandleIndex = index
            this.cbtId = data.id
            this.cbtName = data.attr_value
            this.cbtCost = data.attr_cost_price
            this.cbtLine = data.attr_goods_mark_price
            this.cbtPrice = data.attr_price
            this.cbtStock = data.attr_storage
            this.cbtWeight = data.attr_weight
            this.cbtIntegral = data.bonus_points
            this.cbtTitle = '编辑组合'
            break;
        }
        this.addCombination = true
      },
      // 操作组合数据
      handleCBTData(){
        if(!this.cbtName){
          return this.$message({
            message: '请填写组合名称',
            type: 'warning'
          })
        }else if(!this.cbtCost){
          return this.$message({
            message: '请填写商品成本价',
            type: 'warning'
          })
        }else if(!this.cbtLine){
          return this.$message({
            message: '请填写商品划线价',
            type: 'warning'
          })
        }else if(!this.cbtLine){
          return this.$message({
            message: '请填写商品划线价',
            type: 'warning'
          })
        }else if(!this.cbtPrice){
          return this.$message({
            message: '请填写商品售价',
            type: 'warning'
          })
        }else if(!this.cbtStock){
          return this.$message({
            message: '请填写商品库存',
            type: 'warning'
          })
        }else if(!this.cbtWeight){
          return this.$message({
            message: '请填写商品重量',
            type: 'warning'
          })
        }else if(!this.cbtIntegral){
          return this.$message({
            message: '请填写赠送积分',
            type: 'warning'
          })
        }
        let data
        switch(this.cbtHandleType){
          case 1:
            data = {
              goods_id: this.getRowId,
              id: this.cbtId,
              attr_value: this.cbtName,
              attr_cost_price: this.cbtCost,
              attr_goods_mark_price: this.cbtLine,
              attr_price: this.cbtPrice,
              attr_storage: this.cbtStock,
              attr_weight: this.cbtWeight,
              bonus_points: this.cbtIntegral
            }
            addCombination(data).then(res=>{
              this.combinationList.push(res.data)
              if(res){
                this.dbtHandleTips('添加成功')
              }
            })
            break;
          case 2:
            data = {
              goods_id: this.getRowId,
              id: this.cbtId,
              attr_value: this.cbtName,
              attr_cost_price: this.cbtCost,
              attr_goods_mark_price: this.cbtLine,
              attr_price: this.cbtPrice,
              attr_storage: this.cbtStock,
              attr_weight: this.cbtWeight,
              bonus_points: this.cbtIntegral
            }
            updateCombination(data).then(res=>{
              if(res){
                this.combinationList[this.cbtHandleIndex].id = res.data.id
                this.combinationList[this.cbtHandleIndex].attr_value = res.data.attr_value
                this.combinationList[this.cbtHandleIndex].attr_cost_price = res.data.attr_cost_price
                this.combinationList[this.cbtHandleIndex].attr_goods_mark_price = res.data.attr_goods_mark_price
                this.combinationList[this.cbtHandleIndex].attr_price = res.data.attr_price
                this.combinationList[this.cbtHandleIndex].attr_storage = res.data.attr_storage
                this.combinationList[this.cbtHandleIndex].attr_weight = res.data.attr_weight
                this.combinationList[this.cbtHandleIndex].bonus_points = res.data.bonus_points
                this.dbtHandleTips('编辑成功')
              }
            })
            break;
        }
      },
      // 删除组合
      delCBTRow(i,idx){
        this.$confirm('确定删除此组合吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            goods_id: this.getRowId,
            id: i.id
          }
          delCombination(data).then(res=>{
            console.log(res)
            if(res){
              this.combinationList.splice(idx,1)
              this.dbtHandleTips('删除成功')
            }
          })
        }).catch(() => {
          // 取消
        });
      },
      // 组合操作提示
      dbtHandleTips(msg){
        this.addCombination = false
        this.$notify({
          title: '成功',
          message: msg,
          type: 'success'
        });
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
      // 上传展示图
      uploadShow(data){
        if(data.uploadPicImg){
          this.vShowImage.push(data.uploadPicUrl) 
          this.pShowImage.push(data.uploadPicImg)
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
    }
  }
</script>
<style lang="scss" scoped>
  .item{
    margin-left: 10px;
    cursor: pointer;
  }
  .sl-t-bom{
    margin-top: 10px;
  }
  .ed-item{
    margin-bottom: 20px;
    .ed-m-name{
      line-height: 40px;
      text-align: right;
    }
    .ed-m-mains{
      line-height: 40px;
      .ed-m-m-list{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .ed-m-m-item{
          margin-right: 10px;
          cursor: pointer;
        }
      }
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
