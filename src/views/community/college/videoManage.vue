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
        <el-input placeholder="请输入标题搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
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
                <el-form-item class="t-e-item" label="视频标题：">
                  <span>{{props.row.title}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="视频分类：">
                  <span v-if="props.row.type_name" style="color:#3CB371;">#{{props.row.type_name}}#</span>
                  <span v-else>无</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="视频封面：">
                  <el-image
                    style="width:300px;heigth:300px;"
                    :src="props.row.fileimgs"
                    fit="cover"
                  >
                    <div slot="placeholder" class="image-slot">
                      加载中<span class="dot">...</span>
                    </div>
                  </el-image>
                </el-form-item>
                <el-form-item class="t-e-item" label="视频：">
                  <video :src="props.row.fileurls" controls width="50%" height="350px">您的浏览器不支持 video 标签。</video>
                </el-form-item>
                <el-form-item class="t-e-item" label="点赞数量：">
                  <span>{{props.row.like}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="评论数量：">
                  <span>{{props.row.reply}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="排序：">
                  <span>{{props.row.weight}}</span>
                </el-form-item>
                <el-form-item class="t-e-item" label="更新时间：">
                  <span>{{props.row.create_time}}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="视频标题"
            prop="name"
            align="center"
          >
            <span slot-scope="scope" class="hiddenFonts">{{scope.row.title}}</span>
          </el-table-column>
          <el-table-column
            label="视频分类"
            prop="name"
            width="150"
            align="center"
          >
            <div slot-scope="scope">
              <span v-if="scope.row.type_name" style="color:#3CB371;">#{{scope.row.type_name}}#</span>
              <span v-else>无</span>
            </div>
          </el-table-column>
          <el-table-column
            label="视频封面"
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
                  :src="scope.row.fileimgs"
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
              <el-button size="small" type="info" circle @click="viewVideo(scope.row.fileurls)">
                <i class="el-icon-video-play" style="font-size: 22px;"></i>
              </el-button>
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
            label="排序"
            prop="weight"
            width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="更新时间"
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
    <!-- 添加弹窗 -->
    <el-dialog
      :title="openTitle"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          视频分类：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-select v-model="vClassValue" placeholder="请选择视频分类">
            <el-option
              v-for="item in vClassList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          视频标题：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请输入视频标题"
            type="textarea"
            v-model="vTitle"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          上传封面：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="6">
          <uplodImg
            :uploadPicUrl="viewImage"
            @uploadSuccess="uploadImage"
          ></uplodImg>
        </el-col>
        <el-col class="ed-m-name" :span="4">
          上传视频：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="7">
          <uplodVideo
            v-if="dialogVisible"
            :uploadVideo="playVideoUrl || ''"
            @uploadVideoA="uploadVideo"
          ></uplodVideo>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          视频排序：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请输入视频排序"
            v-model="vSort"
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
  import { userGroup } from '@/api/purchase';
  import { videoList , addVideo , updateVideo , delVideo } from '@/api/community';
  import uplodImg from "@/components/uplodImg.vue";
  import uplodVideo from "@/components/uplodVideo.vue";
  export default {
    components: { uplodImg , uplodVideo },
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
        // 视频分类
        vClassList: [],
        // 所选分类
        vClassValue: '',
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
        // 视频弹窗
        videoDialog: false,
        // 视频路径
        getVideoUrl: '',
        // 弹窗
        dialogVisible: false,
        // 弹窗类型
        openType: 0,
        // 弹窗标题
        openTitle: '',
        // 视频名称
        vTitle: '',
        // 展示封面
        viewImage: '',
        // 封面图
        vImage: '',
        // 展示视频
        playVideoUrl: '',
        // 视频路径
        vUrl: '',
        // 视频排序
        vSort: '',
        // 编辑 Id
        getRowId: ''
      }
    },
    created() {
      this.getVClassList();
      this.tableData();
    },
    methods: {
      // 清空搜索框
      clear(){
        this.tableData()
      },
      // 获取视频分类
      getVClassList(){
        let params = {
          type: "video_type"
        }
        userGroup(params).then(res=>{
          if(res){
            this.vClassList = res.data.video_type
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
          page: this.page,
          limit: this.limit,
          start_time: getTime[0],
          end_time: getTime[1],
          keyword: this.keyWords
        }
        videoList(params).then(res=>{
          this.getData = res.data
          this.listLoading = false
        });
      },
      // 视频弹窗
      viewVideo(url){
        this.videoDialog = true
        this.getVideoUrl = url
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
            this.openTitle = '新增视频'
            this.getRowId = ''
            this.vClassValue = ''
            this.vTitle = ''
            this.vImage = ''
            this.viewImage = ''
            this.vUrl = ''
            this.playVideoUrl = ''
            this.vSort = ''
            break;
          case 2 :
            this.openTitle = '编辑视频'
            this.getRowId = data.id
            this.vClassValue = data.cid
            this.vTitle = data.title
            this.vImage = data.fileimg
            this.viewImage = data.fileimgs
            this.vUrl = data.fileurl
            this.playVideoUrl = data.fileurls
            this.vSort = data.weight
            break;
        }
      },
      // 上传图片
      uploadImage(data){
        if(data.uploadPicImg && data.uploadPicUrl){
          this.vImage = data.uploadPicImg
          this.viewImage = data.uploadPicUrl
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success'
          });
        }
      },
      // 上传视频
      uploadVideo(data){
        if(data.uploadPicImg && data.uploadVideo){
          this.vUrl = data.uploadPicImg
          this.playVideoUrl = data.uploadVideo
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success'
          });
        }
      },
      // 确定
      handleSure(){
        if(!this.vClassValue){
          return this.$message({
            message: '请选择视频分类',
            type: 'warning'
          })
        }else if(!this.vTitle){
          return this.$message({
            message: '视频标题不能为空',
            type: 'warning'
          })
        }else if(!this.vImage){
          return this.$message({
            message: '请上传视频封面',
            type: 'warning'
          })
        }else if(!this.vUrl){
          return this.$message({
            message: '请上传视频',
            type: 'warning'
          })
        }else if(!this.vSort){
          return this.$message({
            message: '请填写视频排序',
            type: 'warning'
          })
        }
        let data;
        switch(this.openType){
          case 1:
            // 添加
            data = {
              title: this.vTitle,
              fileimg: this.vImage,
              fileurl: this.vUrl,
              cate: this.vClassValue,
              weight: this.vSort
            }
            addVideo(data).then(res=>{
              if(res){
                this.handleTips('添加成功');
              }
            });
            break;
          case 2:
            // 编辑
            data = {
              id: this.getRowId,
              title: this.vTitle,
              fileimg: this.vImage,
              fileurl: this.vUrl,
              cate: this.vClassValue,
              weight: this.vSort
            }
            updateVideo(data).then(res=>{
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
        this.$confirm('确定删除此视频吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: idx
          }
          delVideo(data).then(res=>{
            if(res){
              this.handleTips('删除成功');
            }
          });
        }).catch(() => {
          // 取消
        });
      },
      // 数据筛选
      getChoseValue(){
        this.tableData()
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
