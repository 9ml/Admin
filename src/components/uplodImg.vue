<template>
  <div>
    <el-upload
      class="upload-pic"
      :action="domain"
      :data="QiniuData"
      :on-remove="handleRemove"
      :on-error="uploadError"
      :on-success="uploadSuccess"
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      :limit="9"
      multiple
      :on-exceed="handleExceed"
      :file-list="fileList"
      :show-file-list="false"
      ref="foreignPersonUploadItem"
    >
      <div>
        <!-- <img v-if="uploadPicUrla" :src="uploadPicUrla" class="avatar" /> -->
        <el-image
          v-if="uploadPicUrla"
          :src="uploadPicUrla"
          fit="cover"
          style="width:150px;height:100px;"
        >
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
        <el-button v-else type="primary">选择图片<i class="el-icon-picture el-icon--right"></i></el-button>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { getQiNiuToken } from "@/api/purchase";
export default {
  props: ["uploadPicUrl"],
  data() {
    return {
      formAdd: { brandLogo: "" },
      loading: false,
      QiniuData: {
        key: "", //图片名字处理
        token: "", //七牛云token
        data: {}
      },
      domain: "https://up-z2.qiniup.com", // 七牛云的上传地址（华东区）
      qiniuaddr: "res.ycw.emjiayuan.com", // 七牛云的图片外链地址 七牛云空间的外链地址
      fileList: [],
      uploadPicUrla: ""
    };
  },
  created() {
    this.uploadPicUrla = this.uploadPicUrl;
    this.getToken();
  },
  watch: {
    uploadPicUrl(news, old) {
      this.uploadPicUrla = news;
    }
  },
  methods: {
    getToken(){
      getQiNiuToken().then(res=>{
        this.QiniuData.token = res.data
      })
    },
    beforeAvatarUpload(file) {
      this.QiniuData.data = file;
      this.QiniuData.key = `${file.uid}${file.name}`;
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension =
        testmsg === "jpg" ||
        testmsg === "JPG" ||
        testmsg === "jpeg" ||
        testmsg === "JPEG" ||
        testmsg === "png" ||
        testmsg === "PNG" ||
        testmsg === "bmp" ||
        testmsg === "BMP";
      const isLt50M = file.size / 1024 / 1024 < 10;
      if (!extension) {
        this.$message({
          message: "上传图片只能是jpg / jpeg / png / bmp格式!",
          type: "error"
        });
        return false; //必须加上return false; 才能阻止
      }
      if (!isLt50M) {
        this.$message({
          message: "上传文件大小不能超过 10MB!",
          type: "error"
        });
        return false;
      }
      return extension || isLt50M;
    },
    uploadSuccess(response, file, fileList) {
      this.uploadPicUrla = `http://${this.qiniuaddr}/${response.key}`;
      let data = {
        uploadPicUrl: this.uploadPicUrla,
        uploadPicImg: response.key
      };
      this.$emit("uploadSuccess", data);
    },
    uploadError(err, file, fileList) {
      console.log(err);
      //图片上传失败时调用
      this.$message({
        message: "上传出错，请重试！",
        type: "error",
        center: true
      });
    },
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${ file.name }？`);
    },
    doLookImg() {
      this.uploadDialogVisible = true;
      this.uploadDialogImg = this.editState
        ? this.mainInfo.brandLogo
        : this.formAdd.brandLogo;
    },
    handleRemove(file, fileList) {
      this.uploadPicUrl = "";
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 9 张图片，如需更换，请删除上一张图片在重新选择！`
      );
    }
  }
};
</script>

<style scoped lang="less">

</style>
