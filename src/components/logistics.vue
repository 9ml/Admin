<template>
  <div>
    <el-row>
      <el-col :offset="1" :span="22" class="ls-top">
        <div class="ls-t-icon">
          <img src="@/assets/icon/icon_logistics.png">
        </div>
        <div class="ls-t-fonts">
          <div class="ls-t-f-item">
            物流公司：{{logisticsData.company}}
          </div>
          <div class="ls-t-f-item">
            快递单号：{{logisticsData.nu}}
          </div>
        </div>
      </el-col>
      <el-col
        :offset="2"
        :span="20"
        class="ls-item"
        v-for="(l,l_idx) in logisticsData.data"
        :class="[l_idx === logisticsData.data.length - 1 ? 'ls-first' : '']"
        :key="l_idx"
      >
        <div class="ls-i-icon">
          <img src="@/assets/icon/icon_l_one.png" v-if="l_idx === logisticsData.data.length - 1 && l.status == '揽收'">
          <img src="@/assets/icon/icon_l_two.png" v-else-if="l.status == '在途' || l.status == '揽收'">
          <img src="@/assets/icon/icon_l_three.png" v-else-if="l.status == '派件'">
          <img src="@/assets/icon/icon_l_four.png" v-else-if="l.status == '签收'">
        </div>
        <div class="ls-i-mains">
          <div class="ls-i-m-desc">
            {{l.context}}
          </div>
          <div class="ls-i-m-time">
            {{l.time}}
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: ['logisticsData'],
    data() {
      return {

      }
    },
    created() {

    },
    methods: {

    }
  }
</script>

<style lang="scss" scoped>
  .ls-top{
    height: 80px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    .ls-t-icon{
      width: 50px;
      height: 50px;
      margin-right: 20px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .ls-t-fonts{
      height: 60px;
      .ls-t-f-item{
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .ls-item{
    border-left: 4px solid #D8D8D8;
    padding-bottom: 30px;
    position: relative;
    .ls-i-icon{
      width: 26px;
      height: 26px;
      position: absolute;
      left: -15px;
      z-index: 9;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .ls-i-mains{
      margin-left: 30px;
      .ls-i-m-desc{
        margin-bottom: 10px;
      }
    }
  }
  .ls-first{
    border-left: 4px solid #FFFFFF;
  }
</style>