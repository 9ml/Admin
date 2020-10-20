<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="7" :lg="10">
        时间筛选：
        <el-date-picker
          v-model="choseTimeValue"
          @change="getChoseValue"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"  
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row class="table-mains">
      <el-col class="tm-top" :xl="19" :lg="17"></el-col>
      <el-col :xl="4" :lg="6" class="tm-top">
        <el-input placeholder="请输入搜索内容" clearable @clear="clear" v-model="keyWords" class="input-with-select">
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
            label="商品名称"
            prop="goods_name"
            align="center"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.goods_name}}</span>
          </el-table-column>
          <el-table-column
            label="商品图片"
            prop="name"
            width="150"
            align="center"
          >
            <div slot-scope="scope">
              <el-popover
                placement="left"
                trigger="click"
              >
                <el-image
                  style="width:500px;height:400px;"
                  :src="scope.row.goodImg"
                  fit="scale-down"
                ></el-image>
                <el-button slot="reference" size="small" type="info" circle>
                  <i class="el-icon-picture-outline-round" style="font-size: 22px;"></i>
                </el-button>
              </el-popover>
            </div>
          </el-table-column>
          <el-table-column
            label="商品价格"
            prop="goods_price"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="成本价格"
            prop="goods_cost"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="商品销量"
            prop="sum_goods_num"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="总销金额"
            prop="sum_total"
            width="150"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="利润金额"
            prop="sum_profit"
            width="150"
            align="center"
          >
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
  import { dataList } from '@/api/purchase';
  export default {
    data() {
      return {
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
        // 表格数据
        getData: [],
        // 关键字
        keyWords: '',
        // 表格加载
        listLoading: true,
        // 页码
        page: 1,
        // 数量
        limit: 10
      }
    },
    created() {
      this.tableData()
    },
    methods: {
      // 清空搜索框
      clear(){
        this.tableData()
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
        let getTime = this.choseTimeValue || []
        let params = {
          data_type: "product_raw",
          start_time: getTime[0],
          end_time: getTime[1],
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords
        }
        dataList(params).then(res=>{
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
      // 数据筛选
      getChoseValue(){
        this.tableData()
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
