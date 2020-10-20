<template>
  <div class="l-mains">
    <div class="l-m-top">
      <div class="l-m-t-mains">
        <div class="l-m-t-m-icon">
          <img src="@/assets/icon/logo.png" alt="">
        </div>
        <div class="l-m-t-m-line"></div>
        <div class="l-m-t-m-fonts">伊&nbsp;餐&nbsp;网</div>
      </div>
    </div>
    <div class="l-m-mid">
      <div class="l-m-m-bg">
        <img src="@/assets/icon/login_bg.png" alt="">
      </div>
      <div class="l-m-m-mains">
        <div class="l-m-m-m-title">
          欢迎登录
        </div>
        <div class="l-m-m-m-item" :class="uClass">
          <div class="l-m-m-m-i-icon">
            <img src="@/assets/icon/icon_phone.png" alt="">
          </div>
          <div class="l-m-m-m-i-line"></div>
          <div class="l-m-m-m-i-input">
            <input type="text" @focus="iFocus(1)" @blur="iBlur(1)" v-model="userPhone" placeholder="请输入手机号">
          </div>
        </div>
        <div class="l-m-m-m-item" :class="cClass">
          <div class="l-m-m-m-i-icon">
            <img src="@/assets/icon/icon_code.png" alt="">
          </div>
          <div class="l-m-m-m-i-line"></div>
          <div class="l-m-m-m-i-input">
            <input type="text" @focus="iFocus(2)" @blur="iBlur(2)" v-model="codeNum" placeholder="请输入验证码">
            <div class="l-m-m-m-i-i-btn l-m-m-m-i-i-sec" v-if="isSec">请{{second}}秒后再试</div>
            <div class="l-m-m-m-i-i-btn" v-else @click="getCode">获取验证码</div>
          </div>
        </div>
        <div class="l-m-m-m-btn">
          <el-button type="primary" @click="uLogin" style="width:100%;height:100%;background-color:#329B5B;font-size:18px;">登&nbsp;录</el-button>
        </div>
      </div>
    </div>
    <div class="l-m-bom">&copy;宁波西北梦电子商务有限公司 | 浙ICP备16022966号</div>
  </div>
</template>

<script>
  import { validUsername } from '@/utils/validate'
  import { code , login } from '@/api/user'
  import { localSave } from '@/utils/local'
  import SIdentify from '@/components/code.vue'
  export default {
    components: { SIdentify },
    name: 'Login',
    data() {
      return {
        // 手机号
        userPhone : '',
        // 验证码
        codeNum : '',
        // 手机号输入框样式
        uClass: '',
        // 验证码输入框样式
        cClass: '',
        // 是否倒计时
        isSec: false,
        // 倒计时
        second: 60
        // redirect: undefined
      }
    },
    watch: {
      $route: {
        handler: function(route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created(){

    },
    methods: {
      // 输入框选中
      iFocus(type){
        switch(type){
          case 1:
            this.uClass = 'l-m-m-m-item-ac'
          break;
          case 2:
            this.cClass = 'l-m-m-m-item-ac'
          break;
        }
      },
      // 输入框失去焦点
      iBlur(type){
        switch(type){
          case 1:
            if(!this.userPhone || !(/^1[3456789]\d{9}$/.test(this.userPhone))){
              this.uClass = 'l-m-m-m-item-error'
            }else{
              this.uClass = ''
            }
          break;
          case 2:
            if(!this.codeNum){
              this.cClass = 'l-m-m-m-item-error'
            }else{
              this.cClass = ''
            }
          break;
        }
      },
      // 获取验证码
      getCode(){
        if(!this.userPhone){
          this.uClass = 'l-m-m-m-item-error'
          return this.$message({
            message: "手机号不能为空",
            type: "warning"
          });
        }else if(!(/^1[3456789]\d{9}$/.test(this.userPhone))){
          this.uClass = 'l-m-m-m-item-error'
          return this.$message({
            message: "手机号格式有误",
            type: "warning"
          });
        }
        let data = {
          phone: this.userPhone
        }
        code(data).then(res=>{
          if(res){
            this.$message({
              message: "验证码发送成功，请注意查收",
              type: "success"
            })
            this.isSec = true
            let timer = setInterval(()=>{
              this.second --
              this.second = this.second < 10 ? '0' + this.second : this.second
              if(this.second == 0){
                clearInterval(timer)
                this.isSec = false
                this.second = 60
              }
            },1000)
          }
        })
      },
      uLogin(){
        if(!this.userPhone){
          this.uClass = 'l-m-m-m-item-error'
          return this.$message({
            message: "手机号不能为空",
            type: "warning"
          });
        }else if(!(/^1[3456789]\d{9}$/.test(this.userPhone))){
          this.uClass = 'l-m-m-m-item-error'
          return this.$message({
            message: "手机号格式有误",
            type: "warning"
          });
				}else if(!this.codeNum){
          this.cClass = 'l-m-m-m-item-error'
          return this.$message({
            message: "验证码不能为空",
            type: "warning"
          });
        }
        this.loading = true
        let data = {
          phone : this.userPhone,
          code: this.codeNum
        }
        this.$store.dispatch('user/login', data).then((res) => {
          this.$message({
            message: "登录成功",
            type: "success"
          });
          setTimeout(()=>{
            this.$router.push({ path: '/' });
          },1500);
        }).catch(() => {
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .l-mains{
    width: 100%;
    height: 100%;
    position: fixed;
    .l-m-top{
      height: 8%;
      background-color: #FFFFFF;
      .l-m-t-mains{
        width: 70%;
        height: 100%;
        display: flex;
        align-items: center;
        margin: 0 auto;
        .l-m-t-m-icon{
          width: 60px;
          height: 60px;
          img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .l-m-t-m-line{
          width: 1px;
          height: 60px;
          margin: 0 20px 0 20px;
          background-color: #8EA799;
        }
        .l-m-t-m-fonts{
          font-size: 28px;
        }
      }
    }
    .l-m-mid{
      height: 86%;
      position: relative;
      .l-m-m-bg{
        width: 100%;
        height: 100%;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .l-m-m-mains{
        width: 492px;
        height: 400px;
        background-color: #FFFFFF;
        border-radius: 10px;
        position: absolute;
        top: 50%;
        right: 16%;
        box-shadow: 0px 14px 18px 4px rgba(0, 0, 0, 0.1);
        margin-top: -200px;
        .l-m-m-m-title{
          height: 100px;
          font-size: 30px;
          text-align: center;
          line-height: 100px;
        }
        .l-m-m-m-item{
          width: 380px;
          height: 54px;
          margin: 0 auto 30px;
          border-radius: 6px;
          border: 1px solid #DDDDDD;
          display: flex;
          align-items: center;
          .l-m-m-m-i-icon{
            width: 16%;
            text-align: center;
            img{
              width: 20px;
              height: 20px;
            }
          }
          .l-m-m-m-i-line{
            width: 1px;
            height: 36px;
            background-color: #DDDDDD;
          }
          .l-m-m-m-i-input{
            width: 76%;
            height: 54px;
            margin-left: 8%;
            overflow: hidden;
            position: relative;
            .l-m-m-m-i-i-btn{
              height: 54px;
              line-height: 54px;
              position: absolute;
              top: 0;
              right: 20px;
              color: #329B5B;
              z-index: 9;
              cursor: pointer;
            }
            .l-m-m-m-i-i-sec{
              color: #999999;
            }
            .l-m-m-m-i-i-code{
              width: 120px;
              height: 54px;
              position: absolute;
              top: 0;
              right: 0;
              z-index: 9;
            }
            input{
              width: 100%;
              height: 100%;
              font-size: 16px;
              box-sizing: border-box;
              border: 0 !important;
              outline: medium;
              background-color: rgba(0, 0, 0, 0);
            }
          }
        }
        .l-m-m-m-item-ac{
          border: 1px solid #329B5B;
        }
        .l-m-m-m-item-error{
          border: 1px solid #FF0000;
        }
        .l-m-m-m-btn{
          width: 330px;
          height: 52px;
          margin: 50px auto 0;
        }
      }
    }
    .l-m-bom{
      height: 6%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    }
  }
</style>
