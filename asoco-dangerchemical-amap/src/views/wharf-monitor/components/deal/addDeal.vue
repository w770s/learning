<template>
  <!--添加轮播-->
  <div class="addDeal">
    <div class="model" v-if="showFlag === 1"> <!--v-show="showFlag === 1"-->
      <div class="model-page">
        <div class="model-title">
          <span>处理单</span>
          <img class="pointer" title="关闭" @click="closeDetailPaga()" src="../../../../assets/mapTrack/close.png">
        </div>
        <div class="model-content">
          <div class="imgList">
            <template v-for="(item, index) in pictures">
              <div :key="item.id">
                <!--<span class="img-span" :key="item.id">-->
                  <img :key="item.id" :src="item.src" alt="">
                  <img class="pointer dealClose" title="关闭" @click="del(index)" src="../../../../assets/wharfMonitor/deal_close.png">
                <!--</span>-->
              </div>
            </template>
            <!--<div>
              <img src="../../../../assets/home/bg.jpg" alt="">
              <img class="pointer dealClose" title="关闭" @click="closeDetailPaga()" src="../../../../assets/wharfMonitor/deal_close.png">
            </div>
            <div>
              <Upload
                ref="upload"
                :format="['jpg','jpeg','png']"
                :max-size="5048"
                multiple
                action=""
                style="display: inline-block;width:75px;height:75px;cursor: pointer">
                <div style="width: 75px;height: 100%;line-height: 75px;background-color: #0D667B;" title="上传图片">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </div>-->
          </div>
          <div class="model-body">
            <div class="model-div">
              <span class="body-title">处理单号</span>
              <span class="body-content">{{processJson.orderId}}</span>
            </div>
            <div class="model-div">
              <span class="body-title">监管者名称</span>
              <span class="body-content">{{processJson.regulatorName}}</span>
            </div>
            <div class="model-div">
              <span class="body-title">监管者单位</span>
              <span class="body-content">{{processJson.regulatorOrg}}</span>
            </div>
            <div style="float:left;width: 100%"></div>
            <div class="model-div">
              <span class="body-title">企业名称</span>
              <Select style="width:90%;margin: 5px 5px 5px 10px;" v-model="processJson.company">
                <Option v-for="item in companyList" :value="item.name" :key="item.name">{{ item.name }}</Option>
              </Select>
              <!--<Input v-model="processJson.company" placeholder="请输入" class="body-input border-input" />-->
            </div>
            <div class="model-div">
              <span class="body-title">发现问题时间</span>
              <DatePicker type="datetime" v-model="processJson.discoveryTime" format="yyyy-MM-dd HH:mm" placeholder="请选择时间" class="body-input" style="border:none;" :options="options"></DatePicker>
            </div>
            <div class="model-div">
              <span class="body-title">监控设备名称</span>
              <Input v-model="processJson.deviceName" placeholder="请输入" class="body-input border-input" />
            </div>
            <div class="model-div">
              <span class="body-title">违规作业类型</span>
              <Select style="width:90%;margin: 5px 5px 5px 10px;" multiple v-model="illegalType">
                <Option v-for="item in illegalTypeList" :value="item.id" :key="item.id">{{ item.detail }}</Option>
              </Select>
            </div>
            <div class="model-div">
              <span class="body-title">违规作业区域</span>
              <Select style="width:90%;margin: 5px 5px 5px 10px;" v-model="area">
                <Option v-for="item in areaList" :value="item.id" :key="item.id">{{ item.sourceDangerName }}</Option>
              </Select>
            </div>
            <div class="modle-div100">
              <span class="body-title">问题描述</span>
              <Input type="textarea" :rows="4" v-model="processJson.problemDesc" placeholder="请输入问题描述" style="width: 92%;margin-left: 2%;" />
            </div>
          </div>
        </div>
        <div style="text-align: center" class="footer-div">
          <span class="sure" @click="openSave">确定</span>
          <span class="cancle" @click="closeDetailPaga">取消</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCompanyByCode } from '@/api/emergency'
import { getSnapPictureList, getOrderNum, postSaveOrUpdateProcess, jobViolationType, postDangerousList } from '@/api/wharf'
export default {
  name: 'addDeal',
  data () {
    return {
      showFlag: 0,
      pictures: [],
      imgIds: [],
      illegalType: [],
      area: '',
      areaList: [],
      companyList: [
        { name: '泰地石化' }
      ],
      searchDangerousParam: {
        page: 1,
        size: 10,
        status: '1'
      },
      processJson: {
        picture: '',
        orderId: '',
        regulatorName: this.$store.state.user.userName,
        regulatorOrg: '乍浦港航局管理',
        company: '',
        discoveryTime: '',
        deviceName: '',
        violationType: '',
        problemDesc: ''
      },
      illegalTypeList: [],
      treeData: [
        {
          title: '嘉兴石化有限公司',
          expand: false,
          children: [
            {
              title: '视频0236'
            },
            {
              title: '视频0237'
            }
          ]
        },
        {
          title: '嘉兴金燕化工有限公司',
          expand: true,
          children: [
            {
              title: '视频0235'
            },
            {
              title: '视频0236'
            }
          ]
        }
      ],
      options: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      saveFlag: true
    }
  },
  mounted () {
    this.getDangerousList()
  },
  methods: {
    // 关闭详情页面
    closeDetailPaga () {
      this.showFlag = 0
    },
    del (index) {
      this.pictures.splice(index, 1)
    },
    openSave () {
      if (this.saveFlag) {
        this.save()
      }
    },
    save () {
      this.saveFlag = false
      this.processJson.violationType = this.illegalType.join()
      if (this.processJson.company === '') {
        this.$Message.warning('企业名称不能为空！')
        return
      } else if (this.processJson.discoveryTime === '') {
        this.$Message.warning('发现问题时间不能为空！')
        return
      } else if (this.processJson.deviceName === '') {
        this.$Message.warning('监控设备不能为空！')
        return
      } else if (this.processJson.violationType === '') {
        this.$Message.warning('违规作业类型不能为空！')
        return
      } else if (this.processJson.problemDesc === '') {
        this.$Message.warning('问题描述不能为空！')
        return
      } else if (this.processJson.problemDesc === '') {

      }
      var picSrcList = []
      this.pictures.forEach(item => {
        picSrcList.push(item.src)
      })
      this.processJson.picture = picSrcList.join('&')
      var self = this
      postSaveOrUpdateProcess({ id: this.imgIds, processJson: JSON.stringify(self.processJson) }).then(res => {
        this.saveFlag = true
        if (res.code === 1) {
          self.$Message.success('处理单生成成功')
          self.closeDetailPaga()
        } else {
          self.$Message.warning(res.message)
        }
      }).catch(err => {
        this.saveFlag = true
        console.log(err)
      })
    },
    getDangerousList () {
      let self = this
      postDangerousList(self.searchDangerousParam).then(res => {
        if (res.code === 1) {
          self.areaList = res.data.content
        } else {
          self.$Message.warning('数据异常！')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    openAddDeal (data) {
      this.showFlag = 1
      this.illegalType = ''
      this.processJson = {
        picture: '',
        orderId: '',
        regulatorName: '陈琳',
        regulatorOrg: '乍浦港航局管理',
        company: '',
        discoveryTime: '',
        deviceName: '',
        violationType: '',
        problemDesc: ''
      }
      this.imgIds = data
      this.getSnapPictureList(data)
      this.getOrderNum()
      this.getCompanyList()
      this.getJobViolationType()
    },
    treeCheck (e) {
      // let nodes = this.getSelectedNodes()
    },
    getSnapPictureList (data) {
      getSnapPictureList().then(res => {
        if (res.code === 1) {
          this.pictures = []
          var imgData = res.data.content
          for (var i = 0, length = imgData.length; i < length; i++) {
            var re = imgData[i]
            for (var j = 0, len = data.length; j < len; j++) {
              var dataElement = data[j]
              if (re.id === dataElement) {
                this.pictures.push(re)
              }
            }
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getOrderNum () {
      getOrderNum().then(res => {
        if (res.code === 1) {
          this.processJson.orderId = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getCompanyList () {
      getCompanyByCode({ creditCode: '' }).then(res => {
        this.companyList = res.data
      }).catch(err => {
        this.log(err)
      })
    },
    // 获取码头违规作业类型
    getJobViolationType () {
      jobViolationType().then(res => {
        if (res.code === 1) {
          this.illegalTypeList = res.data
          localStorage.setItem('violationTypes', JSON.stringify(res.data))
        } else {
          this.$Message.warning('获取码头违规作业类型异常!')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less">
  /*弹出层model*/
  .addDeal {
    .model {
      background-color: rgba(0, 0, 0, 0.7);
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
    }
    .model-page {
      position: absolute;
      width: 742px;
      height: 725px;
      top: 50%;
      left: 50%;
      margin-top: -380px;
      margin-left: -360px;
      background: url("../../../../assets/wharfMonitor/deal-form.png") no-repeat scroll right center transparent;
      background-size: 742px 725px;

    }
    .model-title {
      padding-top: 37px;
      text-align: center;
    }
    .model-title span {
      position: relative;
      top: -7px;
      font-family: PingFang-SC-Regular;
      font-size: 18px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #0ddde5;
      margin: 0 auto;
    }
    .model-title img {
      float: right;
      margin-right: 38px;
    }
    .model-content {
      text-align: center;
      position: relative;
      width: 92%;
      height: calc(100% - 150px);
      margin: 10px auto 0 auto;
      overflow-y: auto;
      color: #0ddde5;
      font-size: 15px;
    }
    .pointer{
      cursor: pointer;
    }
    .model-body{
      float: left;
      width: 100%;
      clear: both;
    }
    div.model-div{
      float: left;
      width: 43%;
      margin-left: 2%;
      text-align: left;
    }
    .modle-div100{
      float:left;
      width: 90%;
      margin-left: 2%;
      text-align: left;
    }
    .body-title{
      display: block;
      line-height: 30px;
      padding: 5px 0 5px 10px;
    }
    .body-content{
      color: rgb(160, 171, 179);
      padding: 5px 0 5px 10px;
    }
    .body-content::-webkit-scrollbar {
      display: none;
    }
    .body-input{
      border: 1px solid #0DF6FF;
      margin: 5px;
      background-color: #042035;
      height: 32px;
      width: 90% ;
      margin-left: 10px;
    }
    .border-input{
      border: none;
    }
    .ivu-input,
    .ivu-select-selection,
    input.ivu-input-default{
      background-color: #0A3D52;
      border-radius: 0;
      border-color: #0DF6FF;
      color: #fff;
    }
    i.ivu-input-icon{
      color: #fff;
    }
    .imgList{
      float: left;
      width: 100%;
      padding: 5px 20px;
    }
    .imgList div{
      float: left;
      width: 80px;
      height: 80px;
      position: relative;
      margin-right: 15px;
    }
    .imgList div img{
      width: 100%;
      height: 100%;
    }
    .dealClose{
      width: 18px!important;
      height: 18px!important;
      position: absolute;
      right: -8px;
      top: -5px;
    }
    *::-webkit-scrollbar {
      width: 8px;
      height: 6px;
    }
    *::-webkit-scrollbar-track {
      background-color:#041E32;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius:2em;
    }
    *::-webkit-scrollbar-thumb {
      background-color:#153448;
      -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius:2em;
    }
    .footer-div{
      text-align: center;
    }
    .footer-div span{
      display: inline-block;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
    }
    .footer-div .sure{
      width: 95px;
      height: 36px;
      color: #0DF6FF;
      background: url("../../../../assets/mapTrack/btn.png") no-repeat;
    }
    .footer-div .cancle{
      width: 75px;
      height: 36px;
      margin-left: 10px;
      color: #fff;
      background: url("../../../../assets/mapTrack/btn_qx_on.png") no-repeat;
    }
  }

</style>
