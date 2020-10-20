export default {
  /**
   * vue-element:限制input输入类型
   * 1. 使用: main.js
   *  import regexp from "本文件路径";
   *  Vue.use(regexp);
   * 2. 页面使用
   *  1. <el-input maxlength='15' :value="searchForm" @input="e => searchForm = idsOnly (e,2)"/>
   *  2. <el-input v-model="searchForm" @input="searchForm = idsOnly (searchForm,2)"/>
   */
  install(Vue) {
      // 特殊字符
      Vue.prototype.validSe = function(value, number = 255) {
          value = value
              .replace(
                  /[`～*~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g,
                  ""
              )
              .replace(/\s/g, "");
          if (value.length >= number) {
              this.$message({
                  type: "warning",
                  message: `输入内容不能超过${number}个字符`
              });
          }
          return value;
      };

      // 只能输汉字
      Vue.prototype.chineseOnly = function(value, number = 255) {
          value = value.replace(/[^\u4E00-\u9FA5]/g, "");
          value = value.substring(0, number);
          return value;
      };
      // 只能输正整数
      Vue.prototype.idOnly = function(value, number = 999999) {
          value = value.replace(/[, ]/g, "");
          if (value) {
              value = value.replace(/[^0-9]/g, "");
              value = value.substring(0, number);
              return value;
          }
      };
      // 不允许输汉字
      Vue.prototype.noChineseOnly = function(value, number = 100) {
          value = value.replace(/[\u4E00-\u9FA5]/g, "");
          value = value.substring(0, number);
          return value;
      };

      // 逗号和数字
      Vue.prototype.programIdOnly = function(value, number) {
          value = value.replace(/[^0-9,]/g, "");
          value = value.substring(0, number);
          return value;
      };
      // 数字和回车
      Vue.prototype.idsOnly = function(value, number = 100) {
          value = value.replace(/[^\r\n0-9]/g, "");
          value = value.substring(0, number);
          console.log(value);
          return value;
      };
      // 数值大小限定
      Vue.prototype.numberLimit = function(value, number) {
          value = value.replace(/[^0-9]/g, "");
          value = value.substring(0, number);
          if (value >= 2147483647) {
              this.$message({
                  type: "warning",
                  message: `最大可输入值为2147483647`
              });
          }
          return value;
      };

      // 正整数
      Vue.prototype.onlyPositiveInteger = function(value, number = 100) {
          value = String(value).match(/[1-9]\d*/g, "");
          value = value.substring(0, number);
          return value === null ? "" : Number(value[0]);
      };
      // 正整数（包含0）
      Vue.prototype.onlyPositiveInteger1 = function(value, number = 20) {
          value = value.replace(/[, ]/g, "");
          if (value) {
              value = String(value).match(/[1-9]\d*|0/g, "");
              value = value.substring(0, number);
              return value === null ? "" : Number(value[0]);
          }
      };
      // 负整数
      Vue.prototype.onlyNegativeInteger = function(value, number = 100) {
          value = String(value).match(/^-[1-9]*\d*/g, "");
          value = value.substring(0, number);
          return value === null ?
              "" :
              value[0] === "-" ?
              "-" :
              value[0] === "-0" ?
              "" :
              Number(value[0]);
      };
      // 负整数（包含0）
      Vue.prototype.onlyNegativeInteger1 = function(value, number = 100) {
          value = String(value).match(/^-[1-9]*\d*|0/g, "");
          value = value.substring(0, number);
          return value === null ? "" : value[0] === "-" ? "-" : Number(value[0]);
      };
      // 整数
      Vue.prototype.onlyInteger = function(value, number = 100) {
          value = String(value).match(/^-?[1-9]*\d*|0/g, "");
          value = value.substring(0, number);
          return value === null ?
              "" :
              value[0] === "-" ?
              "-" :
              value[0] === "" ?
              "" :
              Number(value[0]);
      };
      // 整数区间
      Vue.prototype.onlySection = function(value, min, max) {
          value = value.replace(/[, ]/g, "");
          if (value) {
              if (min < 0) {
                  value = String(value).match(/-?[1-9]*\d*/g, "");
              } else {
                  value = String(value).match(/[1-9]*\d*/g, "");
              }
              // value = String(value).match(/-?[1-9]*\d*/g, "")
              value =
                  value === null ?
                  "" :
                  value[0] === "-" ?
                  "-" :
                  value[0] === "" ?
                  "" :
                  Number(value[0]);
              if (value < min) {
                  return min;
              } else if (value > max) {
                  return max;
              } else {
                  return value;
              }
          }
      };
      // 去空格
      Vue.prototype.blank = (value, number = 100) => {
          value = value.replace(/[, ]/g, "");
          if (value) {
              value = value.substring(0, number);
              return value;
          }
      };
      // 微信
      Vue.prototype.WeiXin = (value, number = 19) => {
          value = value.replace(/[, ]/g, "");
          if (value) {
              value = value.substring(0, number);
              value = value.replace(/^[a-zA-Z][-_a-zA-Z0-9]{19}$/, "");
              return value;
          }
      };
      // 邮箱
      Vue.prototype.Email = (value, number = 19) => {
          value = value.replace(/[, ]/g, "");
          if (value) {
              value = value.substring(0, number);
              value = value.replace(
                  /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$/,
                  ""
              );
              return value;
          }
      };
      //
  }
};