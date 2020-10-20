<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="5" :lg="6">
        审核状态：
        <el-select v-model="auditValue" @change="handleChange" filterable placeholder="请选择审核状态">
          <el-option
            v-for="item in auditStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col class="sl-t-item" :xl="5" :lg="6">
        地区筛选：
        <el-cascader
          v-model="areaValue"
          :options="areaList"
          @change="handleChange"
          placeholder="请选择省/市/区"
          clearable
          filterable
          :props="{ checkStrictly: true }"
        ></el-cascader>
      </el-col>
    </el-row>
    <el-row class="table-mains">
      <el-col class="tm-top" :xl="18" :lg="15"></el-col>
      <el-col :xl="4" :lg="6" class="tm-top">
        <el-input placeholder="请输入店铺名称搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
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
          :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item class="t-e-item" label="店铺名称：">
                  <span>{{ props.row.store_name }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="申请人：">
                  <span>{{ props.row.user_name }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="手机号：">
                  <span>{{ props.row.user_phone }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="身份证号：">
                  <span>{{ props.row.id_card }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="店铺地址：">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="营业时间：">
                  <span>{{ props.row.bus_time }}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="身份证照：">
                  <el-image
                    style="width: 200px;"
                    :src="props.row.idcard_url"
                    fit="cover"
                    @click="viewImage(props.row.idcard_url)"
                    :preview-src-list="getUrlList"
                  >
                    <div slot="placeholder" class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </el-image>
                </el-form-item>
                <el-form-item class="t-e-item" label="营业执照：">
                  <el-image
                    style="width: 200px;"
                    :src="props.row.bus_license"
                    fit="cover"
                    @click="viewImage(props.row.bus_license)"
                    :preview-src-list="getUrlList"
                  >
                    <div slot="placeholder" class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </el-image>
                </el-form-item>
                <el-form-item class="t-e-item" label="店铺门脸：">
                  <el-image
                    style="width: 200px;"
                    :src="props.row.storeImg"
                    fit="cover"
                    @click="viewImage(props.row.storeImg)"
                    :preview-src-list="getUrlList"
                  >
                    <div slot="placeholder" class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </el-image>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="店铺名称"
            prop="store_name"
            width="200"
          >
          </el-table-column>
          <el-table-column
            label="申请人"
            prop="user_name"
            width="120"
          >
          </el-table-column>
          <el-table-column
            label="手机号"
            prop="user_phone"
            width="150"
          >
          </el-table-column>
          <el-table-column
            label="身份证号"
            prop="id_card"
            width="200"
          >
          </el-table-column>
          <el-table-column
            label="店铺地址"
            prop="name"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.address}}</span>
          </el-table-column>
          <el-table-column
            label="营业时间"
            prop="bus_time"
            width="140"
          >
          </el-table-column>
          <el-table-column
            label="审核状态"
            prop="name"
            width="140"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.check_type"
                disable-transitions>{{scope.row.check_fonts}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <div v-if="scope.row.check_status === 0">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handle(scope.row.id,true)">同意</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handle(scope.row.id,false)">拒绝</el-button>
              </div>
              <div v-else>
                <el-tag type="info">已审核</el-tag>
              </div>
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
  </div>
</template>
<script>
  import { provincesList, storeList , storeExamine } from '@/api/purchase';
  export default {
    data() {
      return {
        // 审核状态
        auditStatus : [
          {
            value : 5,
            label : '全部'
          },
          {
            value : 0,
            label : '未审核'
          },
          {
            value : 1,
            label : '同意入驻'
          },
          {
            value : 2,
            label : '拒绝入驻'
          }
        ],
        // 所选审核状态
        auditValue : 5,
        // 表格数据
        getData : [],
        // 表格加载
        listLoading : true,
        // 省市区数据
        areaList : [],
        // 所选省市区
        areaValue: [],
        // 页数
        page : 1,
        // 条数
        limit : 10,
        // 关键字
        keyWords : '',
        // 预览图片
        getUrlList : []
      }
    },
    created() {
      this.getProvincesData();
      this.tableData();
    },
    mounted() {
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('el-image__inner')) {
          let _srcList = this.getUrlList
          this.$set(this, 'getUrlList', [])
          this.$nextTick(() => {
            this.$set(this, 'getUrlList', _srcList)
          })
        }
      }, false)
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
      // 获取地区数据
      getProvincesData(){
        provincesList().then(res=>{
          this.areaList = res.data;
        });
      },
      // 选择地区
      handleChange(){
        this.tableData();
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
        let params = {
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords,
          check_status: this.auditValue,
          province: this.areaValue[0] ? this.areaValue[0] : '',
          city: this.areaValue[1] ? this.areaValue[1] : '',
          area: this.areaValue[2] ? this.areaValue[2] : '',
          export: type || ''
        }
        storeList(params).then(res=>{
          if(type){
            window.open(res.data.param.export_url)
          }else{
            res.data.data.forEach(i => {
              if(i.user && i.user.mobilePhone){
                i.user_phone = i.user.mobilePhone
              }else{
                i.user_phone = '无'
              }
              switch(i.check_status){
                case 0 :
                  i.check_fonts = '未审核'
                  i.check_type = 'warning'
                  break;
                case 1 :
                  i.check_fonts = '同意入驻'
                  i.check_type = ''
                  break;
                case 2 :
                  i.check_fonts = '拒绝入驻'
                  i.check_type = 'danger'
                  break;
              }
            });
            this.getData = res.data
          }
          this.listLoading = false
        });
      },
      // 操作
      handle(idx,type){
        let postData = {}
        if(type){
          this.$confirm('确认同意此店铺的入驻吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            postData = {
              id : idx,
              edit_type : 'check_agree',
              reason : ''
            }
            this.delRequest(postData,'店铺入驻审核成功')
          }).catch(() => {
            // 取消
          });
        }else{
          this.$prompt('请输入拒绝原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S/,
            inputErrorMessage: '拒绝原因不能为空'
          }).then(({ value }) => {
            postData = {
              id : idx,
              edit_type : 'check_refuse',
              reason : value
            }
            this.delRequest(postData,'拒绝店铺入驻成功')
          }).catch(() => {
            // 取消       
          });
        }
      },
      // 入驻接口
      delRequest(data,info){
        storeExamine(data).then(res=>{
          if(res){
            this.$notify({
              title: '成功',
              message: info,
              type: 'success'
            });
            this.tableData();
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
      // 预览图片
      viewImage(url){
        this.getUrlList = []
        this.getUrlList.push(url);
      }
    }
  }
</script>
<style lang="scss" scoped>
  
</style>
