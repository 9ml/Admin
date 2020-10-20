<template>
  <div>
    <el-row class="cdm">
      <el-col :span="24" class="cdm-mains">
        <div id="mapChina" class="mapChina"></div>
        <!-- <el-button
          class="cdm-m-left"
          type="primary"
          @click="reloadBack"
          v-if="backShow"
          plain>
          返 回
        </el-button> -->
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import axios from "axios"
  import cityMap from "@/utils/china.js"
  import { mapProvince , mapCity , mapArea } from '@/api/operate';
  export default {
    data() {
      return {
        // 客户
        customerData: '',
        // 省
        provincesList: ['河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '新疆', '广西', '内蒙古', '宁夏', '西藏'],
        // 地图编码(默认中国)
        mapCode: 100000,
        // 地图名称(默认中国)
        mapName: '全国',
        // 地图数据
        mapJson: null,
        // 地图堆栈(用于存储上级)
        mapStack: [],
        // 地图
        myChart: null,
        // 显示
        backShow: false,
        // 省
        pName: '',
        // 市
        cName: '',
        // 区
        aName: ''
      };
    },
    created() {
      
    },
    mounted() {
      this.myChart = this.$echarts.init(document.getElementById('mapChina'))
      this.getCCustomers()
    },
    methods: {
      // 客户人数(全国)
      getCCustomers(){
        let params = {
          year: 'all'
        }
        mapProvince(params).then(res=>{
          if(res){
            this.customerData = res.data
            this.loadJson(true);
          }
        })
      },
      // 客户人数(省)
      getPCustomers(name){
        let params = {
          year: 'all',
          provinceName: name
        }
        mapCity(params).then(res=>{
          if(res){
            this.pName = name
            this.customerData = res.data
            this.reloadJson(name,true)
          }
        })
      },
      // 客户人数(市)
      getACustomers(name){
        let params = {
          year: 'all',
          cityName: name
        }
        mapArea(params).then(res=>{
          if(res.msg == 'success'){
            this.cName = name
            this.customerData = res.data
            this.reloadJson(name,false)
          }else{
            this.aName = name
            let query = {
              pName : this.pName,
              cName : this.cName,
              aName : this.aName
            }
            this.$router.push({
              path: '/operate/customer/customerDistributionData',
              query
            })
          }
        })
      },
      // 判断省
      checkType(name) {
        let type = false
        this.provincesList.forEach((i) => {
          if (name == i) {
            type = true
          }
        });
        return type;
      },
      // 判断调用
      callWhich(name){
        if(this.checkType(name)){
          // 省
          this.getPCustomers(name)
        }else{
          // 市
          if(name == "北京" || name == "天津" || name == "上海" || name == "重庆"){
            this.pName = name
            name += '市'
          }
          this.getACustomers(name)
        }
      },
      // 加载数据
      loadJson(type){
        axios.get("http://emzyzs.h5.emjiayuan.com/china/" + this.mapCode + ".json", {}).then(res => {
          if(res){
            this.mapJson = res.data
            this.loadMap(type)
            this.myChart.on('click',(params)=>{
              this.callWhich(params.name)
            })
          }else{
            alert('无下级数据')
            return
          }
        })
      },
      // 重载数据
      reloadJson(name,type){
        if(cityMap[name]){
          this.backShow = true
          this.mapName = name
          this.mapCode = cityMap[name]
          axios.get("http://emzyzs.h5.emjiayuan.com/china/" + this.mapCode + ".json", {}).then(res => {
            this.mapJson = res.data
            this.loadMap(type)
          })
        }
      },
      // 加载地图
      loadMap(type){
        this.$echarts.registerMap(this.mapName, this.mapJson)
        this.myChart.setOption({
          title: {
            text: '伊穆家园' + this.mapName + '用户分布图(共计'+ this.customerData.count +'家)',
            left: "center",
            textStyle: {
              color: "#000",
              fontSize: 26,
              textShadowColor: "#FFF",
              textShadowBlur: 10,
              textShadowOffsetX: 1,
              textShadowOffsetY: 1
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}<br/>{c}家"
          },
          geo: {
            label: {
              show: false
            }
          },
          visualMap: {
            min: 0,
            max: 5000,
            show: false,
            inRange: {
              color: ["#A1E6CE", "#12B37D", "#089F5D"]
            }
          },
          series: [
            {
              name: "",
              type: "map",
              mapType: this.mapName,
              roam: false, //是否开启鼠标缩放和平移漫游
              top: "100px", //组件距离容器的距离
              zoom: 1.1,
              selectedMode: "single",
              data: this.customerData.data,
              label: {
                normal: {
                  show: true, //显示省份标签
                  textStyle: {
                    color: "#fbfdfe",
                    fontSize: 18
                  }, //省份标签字体颜色
                  textShadowColor: "#000",
                  textShadowBlur: 3,
                  textShadowOffsetX: 1,
                  textShadowOffsetY: 1
                },
                emphasis: {
                  //对应的鼠标悬浮效果
                  show: true,
                  textStyle: {
                    color: "#000000"
                  },
                  textShadowColor: "#ece39e",
                  textShadowBlur: 0,
                  textShadowOffsetX: 0,
                  textShadowOffsetY: 0
                }
              },
              itemStyle: {
                normal: {
                  borderWidth: 0.3, //区域边框宽度
                  borderColor: "#000000", //区域边框颜色
                  areaColor: "lightskyblue"
                },
                emphasis: {
                  borderWidth: 0.3,
                  borderColor: "#4b0082",
                  areaColor: "#ece39e"
                }
              }
            }
          ]
        });
        if(type){
          this.mapStack.push({
            mapCode: this.mapCode,
            mapName: this.mapName
          })
        }
      },
      // 返回
      reloadBack(){
        let map = this.mapStack.pop()
        this.mapCode = map.mapCode
        this.mapName = map.mapName
        if(map.mapName == '全国'){
          this.mapStack = []
          this.getCCustomers()
        }else{
          this.reloadJson(map.mapName,false)
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .cdm{
    background: #FFFFFF;
  }
  .cdm-mains{
    width: 100%;
    position: relative;
    .mapChina{
      width: 100%;
      height: 900px;
    }
    .cdm-m-left{
      position: absolute;
      bottom: 150px;
      left: 50px;
      z-index: 99;
    }
  }
</style>