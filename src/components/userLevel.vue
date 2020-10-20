<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-radio-group v-model="userLevelNumValue" @change="handleChange">
          <el-radio-button v-for="(l,l_idx) in uLData" :label="l.id" :key="l_idx">
            <div class="u-level">
              <div class="u-l-icon" v-if="l.icon">
                <el-image
                  :src="l.icon_ac"
                  v-if="userLevelNumValue == l.id"
                  style="width:18px;height:18px;">
                </el-image>
                <el-image
                  :src="l.icon"
                  v-else
                  style="width:18px;height:18px;">
                </el-image>
              </div>
              <div class="u-l-fonts">
                {{l.name +'   '+ l.nums + '人'}}
              </div>
            </div>
          </el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: ['uLData'],
    data() {
      return {
        userLevelNumValue: 0
      }
    },
    created() {

    },
    methods: {
      handleChange(){
        this.$emit('uLChange', this.userLevelNumValue)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .u-level{
    height: 20px;
    display: flex;
    align-items: center;
    .u-l-fonts{
      margin-left: 10px;
    }
  }
</style>