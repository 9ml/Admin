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
        <el-input placeholder="请输入评论内容搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
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
                  <span v-if="props.row.user && props.row.user.nickname">{{props.row.user.nickname}}</span>
                  <span v-else>用户已被删除</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="评论内容：">
                  <span>{{props.row.content}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="评论回复：">
                  <span>{{props.row.reful_content || '暂无回复'}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="视频标题：">
                  <span>{{props.row.video.title}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="视频封面：">
                  <el-image
                    style="width:300px;heigth:300px;"
                    :src="props.row.video.fileimg"
                    fit="cover"
                  >
                    <div slot="placeholder" class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </el-image>
                </el-form-item>
                <el-form-item class="t-e-item" label="视频：">
                  <video :src="props.row.video.fileurl" controls width="50%" height="350px">您的浏览器不支持 video 标签。</video>
                </el-form-item>
                <el-form-item class="t-e-item" label="评论时间：">
                  <span>{{props.row.create_time}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="用户昵称"
            prop="name"
            width="150"
            align="center"
          >
            <div slot-scope="scope">
              <span v-if="scope.row.user && scope.row.user.nickname">{{scope.row.user.nickname}}</span>
              <span v-else>此账户已被删除</span>
            </div>
          </el-table-column>
          <el-table-column
            label="评论内容"
            prop="content"
            align="center"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.content}}</span>
          </el-table-column>
          <el-table-column
            label="评论回复"
            prop="content"
            align="center"
          >
            <div slot-scope="scope">
              <span v-if="scope.row.reful_content" class="hiddenFonts">{{scope.row.reful_content}}</span>
              <span v-else class="hiddenFonts">暂无回复</span>
            </div>
          </el-table-column>
          <el-table-column
            label="视频标题"
            prop="content"
            align="center"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.video.title}}</span>
          </el-table-column>
          <el-table-column
            label="视频封面"
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
                  :src="scope.row.video.fileimg"
                  fit="scale-down"
                ></el-image>
                <el-button slot="reference" size="small" type="info" circle>
                  <i class="el-icon-picture-outline-round" style="font-size: 22px;"></i>
                </el-button>
              </el-popover>
            </div>
          </el-table-column>
          <el-table-column
            label="视频"
            prop="name"
            width="120"
            align="center"
          >
            <div slot-scope="scope">
              <el-button size="small" type="info" circle @click="viewVideo(scope.row.video.fileurl)">
                <i class="el-icon-video-play" style="font-size: 22px;"></i>
              </el-button>
            </div>
          </el-table-column>
          <el-table-column
            label="评论时间"
            prop="create_time"
            width="160"
            align="center"
          >
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
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
    <!-- 视频弹窗 -->
    <el-dialog
      title="视频播放"
      :visible.sync="videoDialog"
      width="40%"
      center
    >
      <div style="width:100%;">
        <video v-if="videoDialog" style="width:100%;" :src="getVideoUrl" controls autoplay></video>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="videoDialog = false">关 闭</el-button>
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
          回复内容：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            type="textarea"
            placeholder="请填写回复内容"
            v-model="replayData"
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
  import { commentList , replayComment , delComment } from '@/api/community';
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
        limit: 10,
        // 视频弹窗
        videoDialog: false,
        // 视频路径
        getVideoUrl: '',
        // 回复弹窗
        dialogVisible: false,
        // 弹窗标题
        openTitle: '回复',
        // 回复内容
        replayData: '',
        // 回复id
        replayId: ''
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
          fileid: "",
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
      // 视频弹窗
      viewVideo(url){
        this.videoDialog = true
        this.getVideoUrl = url
      },
      // 回复评论
      handles(type,data){
        switch(type){
          case 0:
            this.$confirm('确定删除此条评论吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.handleDel(data.id)
            }).catch(() => {
              // 取消
            });
            break;
          case 1:
            if(data.user && data.user.nickname){
              this.openTitle = '回复 ' + data.user.nickname
            }else{
              this.openTitle = '回复'
            }
            this.replayId = data.id
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
      // 回复
      handleSure(){
        if(!this.replayData){
          return this.$message({
            message: '回复内容不能为空',
            type: 'warning'
          })
        }
        let data = {
          id: this.replayId,
          content: this.replayData
        }
        replayComment(data).then(res=>{
          if(res){
            this.handleTips('回复成功');
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
      },
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
