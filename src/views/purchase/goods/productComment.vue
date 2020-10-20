<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="5" :lg="6">
        类型筛选：
        <el-select v-model="stateValue" filterable @change="getChoseValue" placeholder="请选择类型">
          <el-option
            v-for="item in stateList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
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
        <el-input placeholder="请输入评价内容搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
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
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="table-expand">
                <el-form-item class="t-e-item" label="用户昵称：">
                  <span v-if="props.row.user && props.row.user.nickname">{{ props.row.user.nickname }}</span>
                  <span v-else>账户已被删除</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="评价内容：">
                  <span>{{props.row.content}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="评价图片：">
                  <div class="imageDesc" style="width:60%;" v-if="props.row.assess_img.length !== 0">
                    <div class="id-item"
                      v-for="(i,i_idx) in props.row.assess_img"
                      :key="i_idx"
                    >
                      <el-image
                        style="width: 100%;heigth:150px;"
                        :src="i"
                        fit="cover"
                        :preview-src-list="props.row.assess_img"
                      >
                        <div slot="placeholder" class="image-slot">
                          加载中<span class="dot">...</span>
                        </div>
                      </el-image>
                    </div>
                  </div>
                  <div v-else>无</div>
                </el-form-item>
                <el-form-item class="t-e-item" label="评价星级：">
                  <span>{{props.row.goods_start}}星</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="评价商品：">
                  <span v-if="props.row.product">{{props.row.product.goods_name}}</span>
                  <span v-else>暂无商品信息</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="商品图片：">
                  <div v-if="props.row.product">
                    <el-image
                      style="width: 300px;heigth:300px;"
                      :src="props.row.product.goodImg"
                      fit="cover"
                    >
                      <div slot="placeholder" class="image-slot">
                        加载中<span class="dot">...</span>
                      </div>
                    </el-image>
                  </div>
                  <div v-else>暂无商品信息</div>
                </el-form-item>
                <el-form-item class="t-e-item" label="评价回复：">
                  <span v-if="props.row.reply_status === 1">{{props.row.reply}}</span>
                  <span v-else>未回复</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="评价时间：">
                  <span>{{props.row.createtime}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="用户名"
            prop="name"
            align="center"
          >
            <div slot-scope="scope" class="hiddenFonts">
              <span v-if="scope.row.user">
                {{scope.row.user.nickname || '账户已被删除'}}
              </span>
              <span v-else>账户已被删除</span>
            </div>
          </el-table-column>
          <el-table-column
            label="评价内容"
            prop="content"
            align="center"
          >
            <span slot-scope="scope" class="hiddenFonts">
              {{scope.row.content || '用户未填写评价'}}
            </span>
          </el-table-column>
          <el-table-column
            label="评价图片"
            prop="name"
            align="center"
            width="120"
          >
            <div slot-scope="scope">
              <el-button v-if="scope.row.assess_img.length !== 0" @click="viewImage(scope.row.assess_img)" slot="reference" size="small" type="info" circle>
                <i class="el-icon-picture-outline-round" style="font-size: 22px;"></i>
              </el-button>
              <span v-else>无</span>
            </div>
          </el-table-column>
          <el-table-column
            label="评价星级"
            prop="name"
            align="center"
            width="100"
          >
            <span slot-scope="scope">
              {{scope.row.goods_start+'星'}}
            </span>
          </el-table-column>
          <el-table-column
            label="评价商品"
            prop="name"
            align="center"
          >
            <div slot-scope="scope" class="hiddenFonts">
              <span v-if="scope.row.product">
                {{scope.row.product.goods_name}}
              </span>
              <span v-else>
                暂无商品信息
              </span>
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
                placement="left"
                trigger="click"
                v-if="scope.row.product"
              >
                <el-image
                  style="width:500px;height:400px;"
                  :src="scope.row.product.goodImg"
                  fit="scale-down"
                ></el-image>
                <el-button slot="reference" size="small" type="info" circle>
                  <i class="el-icon-picture-outline-round" style="font-size: 22px;"></i>
                </el-button>
              </el-popover>
              <span v-else>
                暂无商品信息
              </span>
            </div>
          </el-table-column>
          <el-table-column
            label="评价回复"
            prop="name"
            align="center"
          >
            <div slot-scope="scope">
              <span v-if="scope.row.reply_status == 0">未回复</span>
              <span class="hiddenFonts" v-else>
                {{scope.row.reply}}
              </span>
            </div>
          </el-table-column>
          <el-table-column
            label="评价时间"
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
                :disabled="scope.row.reply_status == 1"
                @click="handles(1,scope.row)">回复</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handles(0,scope.row)">删除</el-button>
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
    <!-- 图片弹窗 -->
    <el-dialog
      title="评价图片"
      :visible.sync="dialogImage"
      width="50%"
      center
    >
      <el-row>
        <el-col :span="24" class="imageDesc">
          <div class="id-item"
            v-for="(i,i_idx) in imageList"
            :key="i_idx"
          >
            <el-image
              style="width: 100%;heigth:150px;"
              :src="i"
              fit="cover"
              :preview-src-list="imageList"
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogImage = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 回复弹窗 -->
    <el-dialog
      :title="openTitle"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          评价内容：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            type="textarea"
            disabled
            v-model="commentValue"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          回复内容：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            type="textarea"
            placeholder="请填写回复内容"
            v-model="replayValue"
            clearable
          >
          </el-input>
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
  import { commentList , replayComment , delComment } from '@/api/purchase';
  export default {
    data() {
      return {
        // 状态列表
        stateList: [
          {
            value: 2,
            label: '全部'
          },
          {
            value: 0,
            label: '未回复'
          },
          {
            value: 1,
            label: '已回复'
          }
        ],
        // 所选状态
        stateValue: 2,
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
        limit: 10,
        // 图片弹窗
        dialogImage: false,
        // 评论图片列表
        imageList: [],
        // 回复标题
        openTitle: '',
        // 回复弹窗
        dialogVisible: false,
        // 评价内容
        commentValue: '',
        // 回复内容
        replayValue: '',
        // 获取id
        getIdx: ''
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
          product: '',
          status: this.stateValue,
          start_time: getTime[0],
          end_time: getTime[1],
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords
        }
        commentList(params).then(res=>{
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
      },
      // 查看评论图片
      viewImage(list){
        this.imageList = list
        this.dialogImage = true
      },
      // 操作
      handles(type,i){
        this.getIdx = i.id
        switch(type){
          case 0:
            this.$confirm('确定删除此条评论吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleDel(i.id)
            }).catch(() => {
              // 取消
            });
            break;
          case 1:
            this.replayValue = ''
            if(i.user.nickname){
              this.openTitle = '回复'+i.user.nickname
            }else{
              this.openTitle = '回复'
            }
            if(i.content){
              this.commentValue = i.content
            }else{
              this.commentValue = '用户未填写评论'
            }
            this.dialogVisible = true
            break;
        }
      },
      // 删除评论
      handleDel(idx){
        let data = {
          id : idx
        }
        delComment(data).then(res=>{
          if(res){
            this.handleTips('删除成功');
          }
        });
      },
      // 确定回复
      handleSure(){
        if(!this.replayValue){
          return this.$message({
            message: '回复内容不能为空',
            type: 'warning'
          })
        }
        let data = {
          id: this.getIdx,
          content: this.replayValue
        }
        replayComment(data).then(res=>{
          if(res){
            this.handleTips('回复成功')
          }
        })
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
      }
    }
  }
</script>
<style lang="scss" scoped>
  .imageDesc{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    .id-item{
      width: 30%;
      height: 150px;
      overflow: hidden;
      border: 1px solid #FFF;
    }
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
