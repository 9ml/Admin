<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="5" :lg="6">
        分类筛选：
        <el-select v-model="classValue" filterable @change="getChoseValue" placeholder="请选择分类">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.label"
            :value="item.id">
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
        <el-input placeholder="请输入帖子标题搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
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
                <el-form-item class="t-e-item" label="帖子标题：">
                  <span>{{props.row.title}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="帖子内容：">
                  <span>{{props.row.content}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="帖子分类：">
                  <span v-if="props.row.type_name" style="color:#3CB371;">#{{props.row.type_name}}#</span>
                  <span v-else>无</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="帖子图片：" v-if="props.row.imgs.length !== 0">
                  <div class="imageDesc" style="width:60%;">
                    <div class="id-item"
                      v-for="(i,i_idx) in props.row.imgs"
                      :key="i_idx"
                    >
                      <el-image
                        style="width: 100%;heigth:150px;"
                        :src="i"
                        fit="cover"
                        :preview-src-list="props.row.imgs"
                      >
                        <div slot="placeholder" class="image-slot">
                          加载中<span class="dot">...</span>
                        </div>
                      </el-image>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item class="t-e-item" label="帖子视频：" v-if="props.row.fileUrl">
                  <video :src="props.row.fileUrl" controls width="50%" height="350px">您的浏览器不支持 video 标签。</video>
                </el-form-item>
                <el-form-item class="t-e-item" label="点赞数量：">
                  <span>{{props.row.like}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="评论数量：">
                  <span>{{props.row.reply}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="发帖时间：">
                  <span>{{props.row.create_time}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="用户名"
            width="150"
            prop="name"
            align="center"
          >
            <div slot-scope="scope">
              <span v-if="scope.row.user">
                {{scope.row.user.nickname || '账户已被删除'}}
              </span>
              <span v-else>账户已被删除</span>
            </div>
          </el-table-column>
          <el-table-column
            label="帖子标题"
            prop="name"
            align="center"
          >
            <span slot-scope="scope" class="hiddenFonts">
              {{scope.row.title}}
            </span>
          </el-table-column>
          <el-table-column
            label="帖子内容"
            prop="name"
            align="center"
          >
            <span slot-scope="scope" class="hiddenFonts">
              {{scope.row.content}}
            </span>
          </el-table-column>
          <el-table-column
            label="帖子分类"
            width="150"
            prop="mount"
            align="center"
          >
            <div slot-scope="scope">
              <span v-if="scope.row.type_name" style="color:#3CB371;">
                #{{scope.row.type_name}}#
              </span>
              <span v-else>无</span>
            </div>
          </el-table-column>
          <el-table-column
            label="图片/视频"
            prop="mount"
            width="100"
            align="center"
          >
            <div slot-scope="scope">
              <el-button size="small" type="info" circle @click="openDesc(1,scope.row)" v-if="scope.row.imgs.length !== 0 || scope.row.fileUrl">
                <i v-if="scope.row.imgs.length !== 0" class="el-icon-picture-outline-round" style="font-size: 22px;"></i>
                <i v-else class="el-icon-video-play" style="font-size: 22px;"></i>
              </el-button>
              <span v-else>
                无
              </span>
            </div>
          </el-table-column>
          <el-table-column
            label="点赞数量"
            prop="like"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="评论数量"
            prop="reply"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="发帖时间"
            prop="create_time"
            width="160"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                v-if="scope.row.status === 1"
                @click="openDesc(0,scope.row)">封贴</el-button>
              <el-button
                size="mini"
                type="warning"
                v-else
                @click="openDesc(0,scope.row)">解封</el-button>
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
    <!-- 视频 / 图片弹窗 -->
    <el-dialog
      :title="titleIAndV"
      :visible.sync="dialogIAndV"
      width="50%"
      center
    >
      <el-row>
        <el-col :span="24" v-if="titleIAndV == '帖子视频'">
          <video :src="getDesc" controls width="100%" height="500px" v-if="dialogIAndV">您的浏览器不支持 video 标签。</video>
        </el-col>
        <el-col v-else :span="24" class="imageDesc">
          <div class="id-item"
            v-for="(i,i_idx) in getDesc"
            :key="i_idx"
          >
            <el-image
              style="width: 100%;heigth:150px;"
              :src="i"
              fit="cover"
              :preview-src-list="getDesc"
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogIAndV = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { userGroup } from '@/api/purchase';
  import { postList , sealPost } from '@/api/community';
  export default {
    data() {
      return {
        // 分类列表
        classList: [],
        // 所选分类
        classValue: 0,
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
        // 视频 / 图片弹窗
        dialogIAndV: false,
        // 视频 / 图片弹窗标题
        titleIAndV: '',
        // 获取数据
        getDesc: ''
      }
    },
    created() {
      this.getClassList();
      this.tableData();
    },
    methods: {
      clear(){
        this.tableData()
      },
      // 获取分类
      getClassList(){
        let params = {
          type: "card_label_all"
        }
        userGroup(params).then(res=>{
          if(res){
            res.data.card_label_all[0].label = '全部'
            this.classValue = res.data.card_label_all[0].id
            this.classList = res.data.card_label_all
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
        let getTime = this.choseTimeValue || []
        let params = {
          cid: this.classValue,
          start_time: getTime[0],
          end_time: getTime[1],
          page: this.page,
          limit: this.limit,
          keyword: this.keyWords
        }
        postList(params).then(res=>{
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
      /**
       * 详情弹窗
       * type
       *  0: 封贴
       *  1: 查看视频 / 图片
       * data
       *  数据
       */
      openDesc(type,data){
        switch(type){
          case 0:
            let msg = data.status === 1 ? '封贴后此帖子在用户端不可见,是否继续?' : '解封后此帖子将在用户端可见,是否继续?'
            this.$confirm(msg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handles(data);
            }).catch(() => {
              // 取消          
            });
            break;
          case 1:
            if(data.fileUrl){
              this.titleIAndV = '帖子视频'
              this.getDesc = data.fileUrl
            }else{
              this.titleIAndV = '帖子图片'
              this.getDesc = data.imgs
            }
            this.dialogIAndV = true
            break;
        }
      },
      // 操作
      handles(i){
        let data = {
          id: i.id,
          status: i.status === 1 ? 0 : 1
        }
        sealPost(data).then(res=>{
          if(res){
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success'
            });
            this.tableData()
          }
        })
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
</style>