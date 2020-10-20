<template>
  <div>
    <el-row class="table-mains">
      <el-col class="tm-top" :xl="18" :lg="15"></el-col>
      <el-col :xl="4" :lg="6" class="tm-top">
        <el-input placeholder="请输入搜索内容" clearable @clear="handleSearch(false)" v-model="keyWords" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch(true)">搜索</el-button>
        </el-input>
      </el-col>
      <el-col :xl="2" :lg="3" class="tm-top">
        <el-button
          type="primary"
          @click="exportTable"
          icon="el-icon-download">
          导出
        </el-button>
      </el-col>
      <el-col class="tm-mains" :span="24">
        <el-table
          :data="tableData.data"
          empty-text="暂无数据"
          style="width: 100%"
          border
          v-loading="listLoading"
          :span-method="objectSpanMethod"
          :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}">
          <el-table-column
            label="商品名称"
            prop="goods_name"
            align="center"
          >
            <div slot-scope="scope">
              <el-image
                style="width:40px;height:40px;"
                fit="cover"
                :src="scope.row.goods_image"
              ></el-image>
              <el-tooltip class="item" effect="dark" :content="scope.row.goods_name" placement="top">
                <span class="hiddenFonts">
                  {{scope.row.goods_name}}
                </span>
              </el-tooltip>
            </div>
          </el-table-column>
          <el-table-column
            label="商品组合"
            prop="attr_name"
            width="160"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="单价"
            prop="goods_price"
            width="120"
            align="center"
          >
            <span slot-scope="scope" style="color:#FF0000;">￥{{scope.row.goods_price}}</span>
          </el-table-column>
          <el-table-column
            label="购买数量"
            prop="goods_num"
            width="120"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="买家信息"
            prop="order_soup_num"
            align="center"
          >
            <div slot-scope="scope">
              <span>{{scope.row.user.nickname || '此账号已被删除'}}</span><br>
              <span>{{scope.row.user.mobilePhone || '无'}}</span>
            </div>
          </el-table-column>
          <el-table-column
            label="订单总价"
            width="120"
            prop="order_amount"
            align="center"
          >
            <span slot-scope="scope" style="color:#FF0000;">￥ {{scope.row.order_amount}}</span>
          </el-table-column>
          <el-table-column
            label="订单状态"
            width="100"
            prop="status_text"
            align="center"
          >
            <div slot-scope="scope">
              <el-tag :type="scope.row.status_type">{{scope.row.status_text}}</el-tag>
            </div>
          </el-table-column>
          <el-table-column
            label="物流信息"
            width="160"
            prop="name"
            align="center"
          >
            <div slot-scope="scope">
              <div v-if="scope.row.express_company && scope.row.expressno">
                <span>{{scope.row.express_company}}</span><br>
                <span>{{scope.row.expressno}}</span>
              </div>
              <div v-else>暂无物流信息</div>
            </div>
          </el-table-column>
          <el-table-column
            label="下单时间"
            width="160"
            prop="create_time"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handles(1,scope.row)"
              >详情</el-button>
              <el-button
                size="mini"
                type="warning"
                @click="handles(2,scope.row)"
                v-if="scope.row.order_state == 0"
              >改价</el-button>
              <el-button
                size="mini"
                type="warning"
                @click="handles(3,scope.row)"
                v-else-if="scope.row.order_state == 1"
              >发货</el-button>
              <el-button
                size="mini"
                type="warning"
                @click="handles(4,scope.row)"
                v-if="scope.row.order_state == 2 || scope.row.order_state == 3 || scope.row.order_state == 4"
              >物流</el-button>
              <el-button
                size="mini"
                type="success"
                style="margin-top:10px;"
                @click="handles(5,scope.row)"
                v-if="scope.row.order_state == 2"
              >确认收货</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" class="table-pages" v-if="tableData.page && tableData.page.data_count > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next"
          :total="tableData.page.data_count">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 订单详情 -->
    <el-dialog
      title="订单详情"
      :visible.sync="dialogDesc"
      width="60%"
      top="2%">
      <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="基本信息" name="desc">
          <el-form label-position="left" inline class="table-expand">
            <el-divider content-position="left">订单信息</el-divider>
            <el-row>
              <el-col :offset="1" :span="22">
                <el-form-item class="t-e-item" label="订单编号：">
                  <span>{{orderData.order_no}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="订单状态：">
                  <span>{{orderData.status_text}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" v-if="orderData.user" label="下单用户：">
                  <span>{{orderData.user.nickname}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" v-if="orderData.user" label="手机号码：">
                  <span>{{orderData.user.mobilePhone}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="商品总价：">
                  <span style="color:#FF0000;">￥ {{orderData.goods_amount}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="会员折扣：">
                  <span style="color:#FF0000;">{{orderData.order_sale / 10}}折 </span>
                </el-form-item>
                <el-form-item class="t-e-item" label="运费价格：">
                  <span style="color:#FF0000;">￥ {{orderData.shipping_price}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="支付价格：">
                  <span style="color:#FF0000;">￥ {{orderData.order_amount}}</span>
                  <el-tooltip class="item" effect="dark" content="支付价格 = 商品总价 * 会员折扣 + 运费价格" placement="right">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item class="t-e-item" label="获得积分：">
                  <span>{{orderData.integral}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="订单备注：">
                  <span>{{orderData.remark || '无'}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="下单时间：">
                  <span>{{orderData.create_time}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-divider content-position="left">地址信息</el-divider>
            <el-row v-if="orderData.order_address">
              <el-col :offset="1" :span="22">
                <el-form-item class="t-e-item" label="收货人：">
                  <span>{{orderData.order_address.username}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="收货电话：">
                  <span>{{orderData.order_address.telphone}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="收货地址：">
                  <span>{{orderData.order_address.address}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="订单商品" name="goods">
          <el-table
            :data="orderData.goods"
            empty-text="暂无数据"
            style="width: 100%"
            :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}"
          >
            <el-table-column
              label="商品名称"
              prop="goods_name"
              align="center"
            >
              <div slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.goods_name" placement="top">
                  <span class="hiddenFonts">
                    {{scope.row.goods_name}}
                  </span>
                </el-tooltip>
              </div>
            </el-table-column>
            <el-table-column
              label="商品图片"
              prop="name"
              width="120"
              align="center"
            >
              <div slot-scope="scope">
                <el-popover
                  placement="right"
                  trigger="click"
                >
                  <el-image
                    style="width:500px;height:400px;"
                    :src="scope.row.goods_image"
                    fit="scale-down"
                  ></el-image>
                  <el-button slot="reference" size="small" type="info" circle>
                    <i class="el-icon-picture-outline-round" style="font-size: 22px;"></i>
                  </el-button>
                </el-popover>
              </div>
            </el-table-column>
            <el-table-column
              label="商品组合"
              align="center"
              prop="attr_name"
            >
            </el-table-column>
            <el-table-column
              label="单价"
              align="center"
              prop="goods_price"
            >
              <span slot-scope="scope" style="color:#FF0000;">￥{{scope.row.goods_price}}</span>
            </el-table-column>
            <el-table-column
              label="购买数量"
              prop="goods_num"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="总价"
              prop="totalPrice"
              align="center"
            >
              <span slot-scope="scope" style="color:#FF0000;">￥ {{scope.row.totalPrice}}</span>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="物流追踪" name="logis">
          <el-divider v-if="!logisticsData" content-position="center">暂无物流信息</el-divider>
          <logistics v-else :logisticsData="logisticsData"></logistics>
        </el-tab-pane>
        <el-tab-pane label="日志记录" name="ologs">
          <el-table
            :data="logData"
            empty-text="暂无日志记录"
            style="width: 100%"
            :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}"
          >
            <el-table-column
              label="操作内容"
              align="center"
              prop="desc"
            >
              <span slot-scope="scope" class="hiddenFonts">{{scope.row.desc}}</span>
            </el-table-column>
            <el-table-column
              label="操作时间"
              align="center"
              width="180"
              prop="time"
            >
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 发货 / 改价 -->
    <el-dialog
      :title="dhTitle"
      :visible.sync="dialogHandles"
      fullscreen>
      <el-divider content-position="left">订单商品信息</el-divider>
      <el-row class="table-mains">
        <el-col class="tm-mains" :span="24">
          <el-table
            :data="orderData.goods"
            empty-text="暂无数据"
            :span-method="objectSpanMethodGoods"
            style="width: 100%"
            border
            :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}"
          >
            <el-table-column
              label="商品名称"
              prop="goods_name"
              align="center"
            >
              <div slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.goods_name" placement="top">
                  <span class="hiddenFonts">
                    {{scope.row.goods_name}}
                  </span>
                </el-tooltip>
              </div>
            </el-table-column>
            <el-table-column
              label="商品图片"
              prop="name"
              width="120"
              align="center"
            >
              <div slot-scope="scope">
                <el-popover
                  placement="right"
                  trigger="click"
                >
                  <el-image
                    style="width:500px;height:400px;"
                    :src="scope.row.goods_image"
                    fit="scale-down"
                  ></el-image>
                  <el-button slot="reference" size="small" type="info" circle>
                    <i class="el-icon-picture-outline-round" style="font-size: 22px;"></i>
                  </el-button>
                </el-popover>
              </div>
            </el-table-column>
            <el-table-column
              label="商品组合"
              align="center"
              prop="attr_name"
            >
            </el-table-column>
            <el-table-column
              label="商品单价"
              align="center"
              prop="goods_price"
            >
              <span slot-scope="scope" style="color:#FF0000;">￥{{scope.row.goods_price}}</span>
            </el-table-column>
            <el-table-column
              label="购买数量"
              prop="goods_num"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="商品合计"
              prop="goodsAmount"
              align="center"
            >
              <span slot-scope="scope" style="color:#FF0000;">￥ {{scope.row.goodsAmount}}</span>
            </el-table-column>
            <el-table-column
              label="会员折扣"
              prop="orderSale"
              align="center"
            >
              <span slot-scope="scope" style="color:#FF0000;">{{scope.row.orderSale / 10}} 折</span>
            </el-table-column>
            <el-table-column
              label="运费价格"
              prop="freight"
              align="center"
            >
              <span slot-scope="scope" style="color:#FF0000;">￥ {{scope.row.freight}}</span>
            </el-table-column>
            <el-table-column
              label="订单合计"
              prop="orderAmount"
              align="center"
            >
              <span slot-scope="scope" style="color:#FF0000;">￥ {{scope.row.orderAmount}}</span>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row v-if="orderData.order_address">
        <el-divider content-position="left">收货人信息</el-divider>
        <el-col :offset="1" :span="22">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item class="t-e-item" label="收货人：">
              <span>{{orderData.order_address.username}}</span>
            </el-form-item>
            <el-form-item class="t-e-item" label="手机号：">
              <span>{{orderData.order_address.telphone}}</span>
            </el-form-item>
            <el-form-item class="t-e-item" label="收货地址：">
              <span>{{orderData.order_address.address}}</span>
              <el-button
                type="warning"
                size="small"
                style="margin-left:100px;"
                @click="uAddress"
              >修改</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div v-if="dhTitle === '订单发货'">
        <el-divider content-position="left">填写物流信息</el-divider>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="2">
            物流公司：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="21">
            <el-select v-model="lValue" filterable placeholder="请选择物流公司">
              <el-option
                v-for="item in lList"
                :key="item.company"
                :label="item.company"
                :value="item.company">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="2">
            物流单号：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="10">
            <el-input
              placeholder="请填写物流单号"
              v-model="lNums"
              clearable
            >
            </el-input>
          </el-col>
          <el-col class="dis-center" style="margin-top:40px;" :span="24">
            <el-button
              style="margin-right:20px;"
              @click="dialogHandles = false"
            >取 消</el-button>
            <el-button
              type="primary"
              @click="sureHandles('send_goods')"
            >发 货</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="dhTitle === '订单改价'">
        <el-divider content-position="left">填写更改价格</el-divider>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="2">
            更改价格：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="10">
            <el-input
              placeholder="请填写更改价格"
              v-model="uPrice"
              clearable
            >
            </el-input>
          </el-col>
          <el-col class="dis-center" style="margin-top:40px;" :span="24">
            <el-button
              style="margin-right:20px;"
              @click="dialogHandles = false"
            >取 消</el-button>
            <el-button
              type="primary"
              @click="sureHandles('order_amount')"
            >改 价</el-button>
          </el-col>
        </el-row>
      </div>
      <el-dialog
        width="50%"
        title="修改地址"
        :visible.sync="dialogUAddress"
        append-to-body>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            收货人：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              placeholder="请填写收货人姓名"
              v-model="rGoodsUser"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            手机号：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              placeholder="请填写收货人手机号"
              v-model="rGoodsPhone"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            收货地址：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-cascader
              style="width:100%;"
              v-model="areaValue"
              :options="areaList"
              placeholder="请选择省/市/区"
              filterable
            ></el-cascader>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            详细地址：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              placeholder="请填写详细地址"
              v-model="rGoodsAddress"
              type="textarea"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogUAddress = false">取 消</el-button>
          <el-button type="primary" @click="sureHandles('edit_address')">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <el-dialog
      width="50%"
      top="2%"
      title="物流信息"
      :visible.sync="dialogLogistics">
      <logistics :logisticsData="logisticsData"></logistics>
    </el-dialog>
  </div>
</template>

<script>
  import { gOrder , oHandleGoods , userAddress , orderLogistics , orderLog } from '@/api/purchase';
  import logistics from "@/components/logistics.vue";
  export default {
    components: { logistics },
    props: ['tableData', 'listLoading' , 'lList' , 'areaList'],
    data() {
      return {
        // 选中标签
        activeName: 'desc',
        // 关键字
        keyWords: '',
        // 详情弹窗
        dialogDesc: false,
        // 订单详情
        orderData: '',
        // 订单物流
        logisticsData: '',
        // 订单日志
        logData: [],
        // 操作弹窗
        dialogHandles: false,
        // 操作弹窗标题
        dhTitle: '',
        // 所选物流公司
        lValue: '',
        // 物流单号
        lNums: '',
        // 订单id
        getRowId: '',
        // 弹窗类型
        getRowType: '',
        // 改价
        uPrice: '',
        // 修改地址弹窗
        dialogUAddress: false,
        // 收货人
        rGoodsUser: '',
        // 收货手机号
        rGoodsPhone: '',
        // 详细地址
        rGoodsAddress: '',
        // 所选省市区
        areaValue: [],
        // 物流弹窗
        dialogLogistics: false
      }
    },
    watch: {
      tableData(news,olds){
        this.tableData = news
      }
    },
    created() {
      
    },
    methods: {
      // 导出数据
      exportTable(){
        this.$emit('isExport')
      },
      // 合并列
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex > 3) {
          return {
            rowspan: row.rowspan,
            colspan: 1
          }
        }
      },
      objectSpanMethodGoods({ row, column, rowIndex, columnIndex }){
        if (columnIndex > 4) {
          return {
            rowspan: row.rowspan,
            colspan: 1
          }
        }
      },
      // 搜索
      handleSearch(type){
        if(type){
          if(!this.keyWords){
            return this.$message({
              message: '搜索内容不能为空',
              type: 'warning'
            });
          }
        }
        this.$emit('sendSearchKey',this.keyWords)
      },
      // 每页条数
      handleSizeChange(i){
        let data = {
          page: 1,
          limit: i
        }
        this.$emit('tSizeChange',data)
      },
      // 分页
      handleCurrentChange(i){
        this.$emit('tPageChange',i)
      },
      /**
       * 操作项
       * type:
       *  1. 订单详情
       *  2. 订单改价
       *  3. 订单发货
       *  4. 查看物流
       * data:
       *  数据
       */
      handles(type,data){
        this.getRowId = data.id
        this.getRowType = type
        switch(type){
          case 1:
            this.activeName = 'desc'
            this.getOrderData()
            this.getOrderLogisticsData(1)
            this.getOrderLogData()
          break;
          case 2:
            this.uPrice = data.order_amount
            this.dhTitle = '订单改价'
            this.getOrderData()
          break;
          case 3:
            this.dhTitle = '订单发货'
            this.getOrderData()
          break;
          case 4:
            this.getOrderLogisticsData(2)
          break;
          case 5:
            this.$confirm('确认此订单商品已被用户签收吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.sureHandles('confirm_receipt')
            }).catch(() => {
              // 取消
            });
          break;
        }
      },
      // 获取订单详情
      getOrderData(){
        let params = {
          order_id: this.getRowId
        }
        gOrder(params).then(res=>{
          if(res){
            res.data.goods.forEach(v=>{
              v.rowspan = 1
              v.goodsAmount = res.data.goods_amount
              v.orderAmount = res.data.order_amount
              v.freight = res.data.shipping_price
              v.orderSale = res.data.order_sale
              v.workPrice = res.data.working_price
            })
            // 双层循环
            for (let i = 0; i < res.data.goods.length; i++) {
              for (let j = i + 1; j < res.data.goods.length; j++) {
                if (res.data.goods[i].id === res.data.goods[j].id) {
                  res.data.goods[i].rowspan++
                  res.data.goods[j].rowspan--
                }
              }
              i = i + res.data.goods[i].rowspan - 1
            }
            this.orderData = res.data
            if(this.getRowType === 1){
              this.dialogDesc = true
            }else if(this.getRowType === 2 || this.getRowType === 3){
              this.dialogHandles = true
            }
          }
        })
      },
      // 操作
      sureHandles(type){
        let data, fonts, types
        switch(type){
          case 'send_goods':
            if(!this.lValue){
              return this.$message({
                message: '请先选择物流公司',
                type: 'warning'
              })
            }else if(!this.lNums){
              return this.$message({
                message: '请填写物流单号',
                type: 'warning'
              })
            }
            data = {
              edit_type: type,
              order_id: this.getRowId,
              expressno: this.lNums,
              express_company: this.lValue
            }
            fonts = '发货成功'
            types = 1
          break;
          case 'order_amount':
            if(!this.uPrice){
              return this.$message({
                message: '请填写更改价格',
                type: 'warning'
              })
            }
            data = {
              edit_type: type,
              order_id: this.getRowId,
              order_amount: this.uPrice
            }
            fonts = '改价成功'
            types = 1
          break;
          case 'edit_address':
            if(!this.rGoodsUser){
              return this.$message({
                message: '请填写收货人姓名',
                type: 'warning'
              })
            }else if(!this.rGoodsPhone){
              return this.$message({
                message: '请填写收货人手机号',
                type: 'warning'
              })
            }else if(this.areaValue.length === 0){
              return this.$message({
                message: '请选择收货地址',
                type: 'warning'
              })
            }else if(!this.rGoodsAddress){
              return this.$message({
                message: '请填写详细地址',
                type: 'warning'
              })
            }
            data = {
              edit_type: type,
              order_id: this.getRowId,
              address_type: 2,
              username: this.rGoodsUser,
              telphone: this.rGoodsPhone,
              address: this.rGoodsAddress,
              provinceid: this.areaValue[0] || '',
              cityid: this.areaValue[1] || '',
              areaid: this.areaValue[2] || ''
            }
            fonts = '修改成功'
            types = 2
          break;
          case 'confirm_receipt':
            data = {
              edit_type: type,
              order_id: this.getRowId
            }
            fonts = '确认收货成功'
            types = 3
          break;
        }
        oHandleGoods(data).then(res=>{
          if(res){
            this.handleTips(types,fonts)
          }
        })
      },
      // 操作提示
      handleTips(type,fonts){
        switch(type){
          case 1:
            this.dialogHandles = false
            this.$emit('sendSearchKey',this.keyWords)
          break;
          case 2:
            this.dialogUAddress = false
            this.getOrderData()
          break;
          case 3:
            this.$emit('sendSearchKey',this.keyWords)
          break;
        }
        this.$notify({
          title: '成功',
          message: fonts,
          type: 'success'
        });
      },
      // 修改地址
      uAddress(){
        this.rGoodsUser = this.orderData.order_address.username
        this.rGoodsPhone = this.orderData.order_address.telphone
        this.areaValue = this.orderData.order_address.city_id.map(String)
        this.rGoodsAddress = this.orderData.order_address.address_short
        this.dialogUAddress = true
      },
      // 物流信息
      getOrderLogisticsData(type){
        let params = {
          order_id: this.getRowId
        }
        orderLogistics(params).then(res=>{
          if(res.data.length === 0){
            if(type === 2){
              return this.$message({
                message: '未查询到物流信息',
                type: 'warning'
              })
            }
          }else{
            this.logisticsData = res.data
            this.dialogLogistics = type === 2 ? true : false
          }
        })
      },
      // 日志信息
      getOrderLogData(){
        let params = {
          order_id: this.getRowId
        }
        orderLog(params).then(res=>{
          if(res){
            this.logData = res.data
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dis-center{
    display: flex;
    align-items: center;
    justify-content: center;
  }
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