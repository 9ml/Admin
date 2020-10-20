<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="5" :lg="5">
        等级：
        <el-select v-model="uLevelValue" @change="getChoseValue" filterable placeholder="请选择用户等级">
          <el-option
            v-for="item in uLevelList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="sl-t-item" :xl="5" :lg="5">
        会员：
        <el-select v-model="isVipValue" @change="getChoseValue" filterable placeholder="请选择是否会员">
          <el-option
            v-for="item in isValueList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="sl-t-item" :xl="5" :lg="5">
        标签：
        <el-select v-model="uTagValue" @change="getChoseValue" filterable placeholder="请选择用户标签">
          <el-option
            v-for="item in uTagList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="sl-t-item" :xl="7" :lg="8">
        注册时间：
        <el-date-picker
          clearable
          v-model="choseTimeValue"
          @change="getChoseValue"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row class="table-mains">
      <el-col class="tm-top" :xl="18" :lg="15"></el-col>
      <el-col :xl="4" :lg="6" class="tm-top">
        <el-input placeholder="请输入用户昵称搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
          :data="getData.data"
          empty-text="暂无数据"
          style="width: 100%"
          v-loading="listLoading"
          :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item class="t-e-item" label="用户ID：">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="用户头像：">
                  <el-image
                    :src="props.row.headImg"
                    style="width:60px;height:60px;border-radius:50%;"
                  ></el-image>
                </el-form-item>
                <el-form-item class="t-e-item" label="用户昵称：">
                  <span>{{ props.row.nickname }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="手机号码：">
                  <span>{{ props.row.mobilePhone }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="用户余额：">
                  <span>{{ props.row.balance }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="用户积分：">
                  <span>{{ props.row.integral }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="交易金额：">
                  <span>{{ props.row.week_money }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="会员等级：">
                  <span>{{ props.row.level.level_name }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="用户标签：">
                  <span>{{ props.row.label }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="注册时间：">
                  <span>{{ props.row.createtime }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="ID"
            prop="id"
            width="80"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="用户昵称"
            prop="name"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.nickname}}</span>
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="mobilePhone"
            width="120"
          >
            <span slot-scope="scope">{{scope.row.mobilePhone || '无'}}</span>
          </el-table-column>
          <el-table-column
            label="余额"
            prop="balance"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="积分"
            prop="integral"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="交易金额"
            prop="week_money"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="会员等级"
            prop="userlevel"
            width="170">
            <div slot-scope="scope">
              <el-select v-model="scope.row.userlevel" size="small" @change="handleUpdate(1,scope.row)" placeholder="修改会员等级">
                <el-option
                  v-for="item in scope.row.levelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-table-column>
          <el-table-column
            label="用户标签"
            prop="userlevel"
            width="170">
            <div slot-scope="scope">
              <el-select v-model="scope.row.tagId" size="small" @change="handleUpdate(2,scope.row)" placeholder="修改用户标签">
                <el-option
                  v-for="item in scope.row.tagList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </div>
          </el-table-column>
          <el-table-column
            label="注册时间"
            prop="createtime"
            align="center"
            width="160">
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-popover
                placement="left"
                trigger="hover">
                <el-button size="mini" type="success" @click="tableHandle(2,scope.row,'/purchase/order/goodsOrder')">原料订单</el-button>
                <el-button size="mini" type="info" @click="tableHandle(2,scope.row,'/purchase/order/powderOrder')">粉料订单</el-button>
                <el-button
                  slot="reference"
                  type="warning"
                  size="mini">订单</el-button>
              </el-popover>
              <el-button
                size="mini"
                type="primary"
                style="margin-left:10px;"
                @click="tableHandle(1,scope.row)">详情</el-button>
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
    <!-- 详情 -->
    <el-dialog
      title="用户详情"
      :visible.sync="descDialog"
      top="3%"
      width="60%">
      <el-row>
        <el-col :span="24">
          <el-tabs type="border-card">
            <el-tab-pane label="收货地址">
              <el-row>
                <el-col :span="24">
                    <el-table
                      :data="userAddressData.data"
                      empty-text="暂无数据"
                      style="width: 100%"
                      v-loading="userAddressTableLoading"
                      :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}"
                    >
                      <el-table-column
                        label="收货人"
                        prop="username"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        label="手机号"
                        prop="telphone"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        label="地址"
                        prop="address"
                        align="center"
                      >
                      </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="24" class="table-pages" v-if="userAddressData.page && userAddressData.page.data_count > 0">
                  <el-pagination
                    @size-change="handleSizeChangeUserAddress"
                    @current-change="handleCurrentChangeUserAddress"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next"
                    :total="userAddressData.page.data_count">
                  </el-pagination>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="充值记录">
              <el-row>
                <el-col :span="24">
                    <el-table
                      :data="userRechargeData.data"
                      empty-text="暂无数据"
                      style="width: 100%"
                      v-loading="userRechargeTableLoading"
                      :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}"
                    >
                      <el-table-column
                        label="充值金额"
                        prop="mount"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        label="充值平台"
                        prop="pay_type"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        label="充值时间"
                        prop="trade_time"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        label="状态"
                        prop="trade_status"
                        align="center"
                      >
                      </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="24" class="table-pages" v-if="userRechargeData.page && userRechargeData.page.data_count > 0">
                  <el-pagination
                    @size-change="handleSizeChangeUserRecharge"
                    @current-change="handleCurrentChangeUserRecharge"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next"
                    :total="userRechargeData.page.data_count">
                  </el-pagination>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="消费记录">
              <el-row>
                <el-col :span="24">
                    <el-table
                      :data="userConsumeData.data"
                      empty-text="暂无数据"
                      style="width: 100%"
                      v-loading="userConsumeTableLoading"
                      :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}"
                    >
                      <el-table-column
                        label="消费金额"
                        prop="mount"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        label="消费方式"
                        prop="pay_type"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        label="消费时间"
                        prop="trade_time"
                        align="center"
                      >
                      </el-table-column>
                      <el-table-column
                        label="状态"
                        prop="trade_status"
                        align="center"
                      >
                      </el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="24" class="table-pages" v-if="userConsumeData.page && userConsumeData.page.data_count > 0">
                  <el-pagination
                    @size-change="handleSizeChangeUserConsume"
                    @current-change="handleCurrentChangeUserConsume"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next"
                    :total="userConsumeData.page.data_count">
                  </el-pagination>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="descDialog = false">取 消</el-button> -->
        <el-button type="primary" @click="descDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { userList, userGroup , updateUserLevelAndTag , userAddress , userRechargeDetails , userConsumeDetails } from '@/api/purchase';
  export default {
    data() {
      return {
        // 用户等级
        uLevelList : [],
        // 所选用户等级
        uLevelValue : '',
        // 是否会员
        isValueList: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '是'
          },
          {
            value: 2,
            label: '否'
          }
        ],
        // 所选会员
        isVipValue: 0,
        // 用户标签
        uTagList: [],
        // 所选标签
        uTagValue: '',
        // 时间快捷选项
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        // 所选时间
        choseTimeValue: [],
        // 排序ID
        sortId: '',
        // 时间排序
        sortTime: '',
        // 余额排序
        sortBalance: '',
        // 积分排序
        sortIntegral: '',
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
        // 详情弹窗
        descDialog: false,
        // 用户id
        descUserId: '',
        // 用户地址信息
        userAddressData: [],
        // 用户地址页码
        userAddressPage: 1,
        // 用户地址查询数
        userAddressLimit: 10,
        // 用户列表加载
        userAddressTableLoading: true,
        // 充值记录
        userRechargeData: [],
        // 充值记录页码
        userRechargePage: 1,
        // 充值记录查询数
        userRechargeLimit: 10,
        // 充值记录列表加载
        userRechargeTableLoading: true,
        // 消费记录
        userConsumeData: [],
        // 消费记录页码
        userConsumePage: 1,
        // 消费记录查询数
        userConsumeLimit: 10,
        // 消费记录列表加载
        userConsumeTableLoading: true
      }
    },
    created() {
      this.getUserGroup();
      this.tableData();
    },
    methods: {
      // 导出
      exportTable(){
        this.tableData(1)
      },
      // 清空搜索框
      clear(){
        this.tableData()
      },
      // 选择下拉框
      getChoseValue(){
        this.tableData();
      },
      // 修改用户等级 / 标签
      handleUpdate(type,info){
        let data;
        switch(type){
          case 1:
            data = {
              id: info.id,
              userlevel: info.userlevel
            }
            break;
          case 2:
            data = {
              id: info.id,
              label: info.tagId
            }
            break;
        }
        updateUserLevelAndTag(data).then(res=>{
          if(res){
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success'
            });
          }
        })
      },
      // 用户标签组
      getUserGroup(){
        let params = {
          type: 'member'
        }
        userGroup(params).then(res=>{
          res.data.label[0].name = '全部'
          res.data.level[0].name = '全部'
          this.uLevelValue = res.data.level[0].id
          this.uTagValue = res.data.label[0].id
          this.uLevelList = res.data.level
          this.uTagList = res.data.label
        });
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
      tableData(type){
        this.listLoading = true
        let getTimeList = this.choseTimeValue || []
        let params = {
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords,
          id: this.sortId,
          createtime: this.sortTime,
          balance: this.sortBalance,
          integral: this.sortIntegral,
          level: this.uLevelValue,
          label: this.uTagValue,
          start_time: getTimeList[0] || '',
          end_time: getTimeList[1] || '',
          export: type || ''
        }
        userList(params).then(res=>{
          if(type){
            window.open(res.data.param.export_url)
          }else{
            res.data.data.forEach(i => {
              i.levelList = res.data.level;
              i.tagList = res.data.label;
              i.tagList.forEach(j=>{
                if(j.name == i.label){
                  i.tagId = j.id
                }
              });
            });
            this.getData = res.data
          }
          this.listLoading = false
        });
      },
      // 操作
      tableHandle(type,data,url){
        switch(type){
          case 1:
            this.descDialog = true
            this.descUserId = data.id
            this.getUserAddress()
            this.getUserRecharge()
            this.getUserConsume()
          break;
          case 2:
            let query = {
              uid: data.id
            }
            this.$router.push({
              path: url,
              query
            })
          break;
        }
      },
      // 获取用户地址
      getUserAddress(){
        this.userAddressTableLoading = true
        let params = {
          uid: this.descUserId,
          page: this.userAddressPage,
          limit: this.userAddressLimit
        }
        userAddress(params).then(res=>{
          if(res){
            this.userAddressData = res.data
            this.userAddressTableLoading = false
          }
        })
      },
      // 获取用户充值记录
      getUserRecharge(){
        this.userRechargeTableLoading = true
        let params = {
          uid: this.descUserId,
          page: this.userRechargePage,
          limit: this.userRechargeLimit
        }
        userRechargeDetails(params).then(res=>{
          if(res){
            this.userRechargeData = res.data
            this.userRechargeTableLoading = false
          }
        });
      },
      // 获取用户消费记录
      getUserConsume(){
        this.userConsumeTableLoading = true
        let params = {
          uid: this.descUserId,
          page: this.userConsumePage,
          limit: this.userConsumeLimit
        }
        userConsumeDetails(params).then(res=>{
          console.log(res)
          if(res){
            this.userConsumeData = res.data
            this.userConsumeTableLoading = false
          }
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
      // 用户地址分页
      handleSizeChangeUserAddress(data){
        this.userAddressPage = 1
        this.userAddressLimit = data
        this.getUserAddress()
      },
      handleCurrentChangeUserAddress(data){
        this.userAddressPage = data
        this.getUserAddress()
      },
      // 用户充值记录分页
      handleSizeChangeUserRecharge(data){
        this.userRechargePage = 1
        this.userRechargeLimit = data
        this.getUserRecharge()
      },
      handleCurrentChangeUserRecharge(data){
        this.userRechargePage = data
        this.getUserRecharge()
      },
      handleSizeChangeUserConsume(data){
        this.userConsumePage = 1
        this.userConsumeLimit = data
        this.getUserConsume()
      },
      handleCurrentChangeUserConsume(data){
        this.userConsumePage = data
        this.getUserConsume()
      },
    }
  }
</script>
<style lang="scss" scoped>
  
</style>
