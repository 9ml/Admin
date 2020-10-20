<template>
  <div>
    <el-row class="sl-top">
      <el-col class="sl-t-item" :xl="5" :lg="6">
        类型：
        <el-select v-model="classValue" filterable @change="getChoseValue" placeholder="请选择状态">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
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
        <el-input placeholder="请输入名称搜索" clearable @clear="clear" v-model="keyWords" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-input>
      </el-col>
      <el-col class="tm-mains" :span="24">
        <el-table
          :data="getData.data"
          empty-text="暂无数据"
          style="width: 100%"
          v-loading="listLoading"
          :span-method="objectSpanMethod"
          border
          :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}">
          <el-table-column
            label="模板名称"
            prop="template_name"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="类型"
            prop="type_text"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="产品使用数"
            prop="count"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="配送区域"
            prop="province"
            align="center">
            <div slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.pList.join(',')" placement="top">
                <span class="hiddenFonts">{{scope.row.pList.join(',')}}</span>
              </el-tooltip>
            </div>
          </el-table-column>
          <el-table-column
            label="首件/重"
            prop="first_weight"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="首费"
            prop="first_price"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="续件/重"
            prop="continue_weight"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="续费"
            prop="continue_price"
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
    <el-dialog
      :title="openTitle"
      :visible.sync="dialogVisible"
      width="60%"
      top="4%">
      <el-divider content-position="left">基本信息</el-divider>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          模板类型：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="19">
          <el-select v-model="pClassValue" @change="getCompanyChange" placeholder="请选择模板类型">
            <el-option
              v-for="item in classList"
              v-if="item.name != '全部'"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="ed-item">
        <el-col class="ed-m-name" :span="4">
          模板名称：
        </el-col>
        <el-col class="ed-m-mains" :offset="1" :span="18">
          <el-input
            placeholder="请填写模板名称"
            v-model="freightName"
            clearable
          >
          </el-input>
        </el-col>
      </el-row>
      <el-divider content-position="left">配送信息</el-divider>
      <el-row class="table-mains">
        <el-col class="tm-top" style="justify-content: flex-start;" :xl="19" :lg="17">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            style="margin-left:20px;"
            @click="openDAA(1)">
            新增配送区域
          </el-button>
        </el-col>
        <el-col class="tm-mains" :span="24">
          <el-table
            :data="getFList"
            empty-text="暂无配送区域信息"
            style="width: 100%"
            v-loading="listLoading"
            :header-cell-style="{color:'#333333',fontSize:'14px',fontWeight:900}">
            <el-table-column
              label="配送区域"
              prop="gArea"
              align="center"
            >
              <div slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.gArea" placement="top">
                  <span class="hiddenFonts">{{scope.row.gArea}}</span>
                </el-tooltip>
              </div>
            </el-table-column>
            <el-table-column
              :label="'首'+metering+'('+mCompany+')'"
              prop="first_weight"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="运费(元)"
              prop="first_price"
              align="center"
            >
            </el-table-column>
            <el-table-column
              :label="'续'+metering+'('+mCompany+')'"
              prop="continue_weight"
              align="center"
            >
            </el-table-column>
            <el-table-column
              label="续费(元)"
              prop="continue_price"
              align="center"
            >
            </el-table-column>
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="openDAA(2,scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="delDAA(scope.row.id,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
      </span>
      <el-dialog
        :title="addAreaTitle"
        :visible.sync="dialogAddArea"
        width="50%"
        append-to-body>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            配送区域：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="19">
            <el-tree
              ref="tree"
              :data="rList"
              show-checkbox
              node-key="id"
              :props="defaultProps"
              :default-checked-keys="checkRList"
              @check-change="handleCheckChange">
            </el-tree>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            首{{metering}}({{mCompany}})：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              :placeholder="'请填写首'+metering+'('+mCompany+')'"
              v-model="firstNum"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            运费(元)：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              :placeholder="'请填写首'+metering+'('+mCompany+')'+'的运费'"
              v-model="firstPrice"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            续{{metering}}({{mCompany}})：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              :placeholder="'请填写续'+metering+'('+mCompany+')'"
              v-model="nextNum"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <el-row class="ed-item">
          <el-col class="ed-m-name" :span="4">
            续费(元)：
          </el-col>
          <el-col class="ed-m-mains" :offset="1" :span="18">
            <el-input
              :placeholder="'请填写续'+metering+'('+mCompany+')'+'的运费'"
              v-model="nextPrice"
              clearable
            >
            </el-input>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogAddArea = false">取 消</el-button>
          <el-button type="primary" @click="addRegion">确 定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
  import { userGroup } from '@/api/purchase';
  import { freightList , freightRegion , addFreightRegion , updateFreightRegion , delFreightRegion , addFreight , updateFreight , delFreight } from '@/api/set';
  export default {
    data() {
      return {
        // 分类列表
        classList: [],
        // 所选分类
        classValue: '',
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
        // 弹窗
        dialogVisible: false,
        // 弹窗标题
        openTitle: '',
        // 所选模板类型
        pClassValue: '1',
        // 运费名称
        freightName: '',
        // 运费列表
        getFList: [],
        // 配送区域弹窗
        dialogAddArea: false,
        // 配送区域标题
        addAreaTitle: '',
        // 配送区域
        rList: [],
        // 默认项
        defaultProps: {
          children: 'provinces',
          label: 'name'
        },
        // 选中节点
        checkRList: [],
        // 所选区域
        regionList: [],
        // 首件
        firstNum: '',
        // 首件运费
        firstPrice: '',
        // 续件
        nextNum: '',
        // 续件运费
        nextPrice: '',
        // 区域id
        regionId: '',
        // 模板id
        getRowId: '',
        // 件 / 重
        metering: '件',
        // 单位
        mCompany: '个'
      }
    },
    created() {
      this.getFreightList();
      this.tableData();
      this.getRegionList();
    },
    methods: {
      // 合并列
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex < 3 || columnIndex === 8) {
          return {
            rowspan: row.rowspan,
            colspan: 1
          }
        }
      },
      // 类型切换
      getCompanyChange(){
        switch(this.pClassValue){
          case '1':
            this.metering = '件'
            this.mCompany = '个'
          break;
          case '2':
            this.metering = '重'
            this.mCompany = 'kg'
          break;
        }
      },
      // 删除
      delDAA(idx,_i){
        this.$confirm('确定删除此配送区域信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: idx
          }
          delFreightRegion(data).then(res=>{
            if(res){
              this.getFList.splice(_i,1)
              this.handleTips(0,'删除成功')
            }
          })
        }).catch(() => {
          // 取消
        });
      },
      // 添加 / 修改配送信息
      addRegion(){
        if(this.regionList.length === 0){
          return this.$message({
            message: '请选择配送区域',
            type: 'warning'
          });
        }else if(!this.firstNum){
          return this.$message({
            message: '请填写首件(个)数',
            type: 'warning'
          });
        }else if(!this.firstPrice){
          return this.$message({
            message: '请填写首件(个)的运费',
            type: 'warning'
          });
        }else if(!this.nextNum){
          return this.$message({
            message: '请填写续件(个)数',
            type: 'warning'
          });
        }else if(!this.nextPrice){
          return this.$message({
            message: '请填写续件(个)的运费',
            type: 'warning'
          });
        }
        let data = {
          id: this.regionId,
          province: this.regionList,
          first_weight: this.firstNum,
          first_price: this.firstPrice,
          continue_weight: this.nextNum,
          continue_price: this.nextPrice
        }
        if(this.regionId){
          updateFreightRegion(data).then(res=>{
            if(res){
              let dList = []
              res.data.province.forEach(i=>{
                dList.push(i.name)
              })
              res.data.gArea = dList.join(',')
              this.getFList.forEach((i,_i)=>{
                if(i.id === res.data.id){
                  this.getFList.splice(_i,1,res.data)
                }
              })
              this.handleTips('修改成功',2)
            }
          })
        }else{
          addFreightRegion(data).then(res=>{
            if(res){
              let dList = []
              res.data.province.forEach(i=>{
                dList.push(i.name)
              })
              res.data.gArea = dList.join(',')
              this.getFList.push(res.data)
              this.handleTips('添加成功',2)
            }
          })
        }
      },
      // 配送区域弹窗
      openDAA(type,data){
        let _self = this
        _self.checkRList = []
        switch(type){
          case 1:
            _self.addAreaTitle = '新增配送区域'
            _self.regionId = ''
            _self.regionList = []
            _self.$nextTick(()=>{
              _self.$refs.tree.setCheckedKeys([])
            })
            _self.firstNum = ''
            _self.firstPrice = ''
            _self.nextNum = ''
            _self.nextPrice = ''
          break;
          case 2:
            _self.addAreaTitle = '编辑配送区域'
            _self.regionId = data.id
            _self.regionList = data.province
            data.province.forEach(i=>{
              _self.checkRList.push(i.id)
            })
            _self.$nextTick(()=>{
              _self.$refs.tree.setCheckedKeys(_self.checkRList)
            })
            _self.firstNum = data.first_weight
            _self.firstPrice = data.first_price
            _self.nextNum = data.continue_weight
            _self.nextPrice = data.continue_price
          break;
        }
        _self.dialogAddArea = true
      },
      // 获取配送区域
      getRegionList(){
        freightRegion().then(res=>{
          if(res){
            this.rList = res.data
          }
        })
      },
      // 选择区域
      handleCheckChange() {
        let res = this.$refs.tree.getCheckedNodes();
        res.forEach((i,i_idx) => {
          if(!i.code){
            res.splice(i_idx,1)
          }
        });
        this.regionList = res
      },
      // 清空搜索框
      clear(){
        this.tableData()
      },
      // 获取模板分类
      getFreightList(){
        let params = {
          type: 'freight_template_type'
        }
        userGroup(params).then(res=>{
          if(res){
            res.data.type[0].name = '全部'
            this.classValue = res.data.type[0].id
            this.classList = res.data.type
          }
        })
      },
      // 筛选
      getChoseValue(){
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
        let params = {
          page: this.page,
          limit: this.limit,
          temp_type: 'temp_list',
          keyword: this.keyWords,
          type: this.classValue
        }
        freightList(params).then(res=>{
          res.data.data.forEach(v=>{
            v.rowspan = 1
            v.pList = []
            v.province.forEach(c=>{
              v.pList.push(c.name)
            })
          })
          // 双层循环
          for (let i = 0; i < res.data.data.length; i++) {
            for (let j = i + 1; j < res.data.data.length; j++) {
              if (res.data.data[i].id === res.data.data[j].id) {
                res.data.data[i].rowspan ++
                res.data.data[j].rowspan --
              }
            }
            i = i + res.data.data[i].rowspan - 1
          }
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
      // 弹窗
      openED(type,data){
        switch(type){
          case 1 :
            this.openTitle = '新增运费模板'
            this.getRowId = ''
            this.pClassValue = '1'
            this.metering = '件'
            this.mCompany = '个'
            this.freightName = ''
            this.getFList = []
            this.dialogVisible = true
          break;
          case 2 :
            this.openTitle = '编辑运费模板'
            this.getRowId = data.id
            this.getFDesc()
          break;
        }
      },
      // 获取模板详情
      getFDesc(){
        let params = {
          temp_type: 'temp_detail',
          teamID: this.getRowId
        }
        freightList(params).then(res=>{
          if(res){
            this.freightName = res.data.template_name
            this.pClassValue = res.data.type
            if(res.data.type == '1'){
              this.metering = '件'
              this.mCompany = '个'
            }else{
              this.metering = '重'
              this.mCompany = 'kg'
            }
            res.data.configs.forEach(i=>{
              i.pList = []
              i.province.forEach(j=>{
                i.pList.push(j.name)
              })
              i.gArea = i.pList.join(',')
            })
            this.getFList = res.data.configs
            this.dialogVisible = true
          }
        })
      },
      // 确定
      handleSure(){
        if(!this.pClassValue){
          return this.$message({
            message: '请选择运费模板类型',
            type: 'warning'
          })
        }else if(!this.freightName){
          return this.$message({
            message: '请填写模板名称',
            type: 'warning'
          })
        }else if(this.getFList.length === 0){
          return this.$message({
            message: '请添加配送区域信息',
            type: 'warning'
          })
        }
        let pList = []
        ,   data = {}
        this.getFList.forEach(i=>{
          pList.push(i.id)
        })
        data = {
          id: this.getRowId,
          type: this.pClassValue,
          template_name: this.freightName,
          configIds: pList
        }
        if(this.getRowId){
          updateFreight(data).then(res=>{
            if(res){
              this.handleTips('修改成功',1)
            }
          })
        }else{
          addFreight(data).then(res=>{
            if(res){
              this.handleTips('添加成功',1)
            }
          })
        }
      },
      // 操作提示
      handleTips(msg,type){
        switch(type){
          case 1:
            this.dialogVisible = false
            this.tableData();
          break;
          case 2:
            this.dialogAddArea = false
          break;
        }
        this.$notify({
          title: '成功',
          message: msg,
          type: 'success'
        });
      },
      // 删除
      handleDel(idx){
        this.$confirm('确定删除此运费模板吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: idx
          }
          delFreight(data).then(res=>{
            if(res){
              this.handleTips('删除成功',1);
            }
          });
        }).catch(() => {
          // 取消
        });
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
