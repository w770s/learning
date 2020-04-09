<template>
  <div class="home">
    <div class="header">
      <h1>危化品大数据平台</h1>
      <div class="user-info">
        {{ userName }}，您好
        <span class="logout" @click="logout"></span>
      </div>
    </div>
    <div class="card-container">
      <div class="card" style="background: rgba(35, 135, 222, .66); height: 310px;width:620px">
        <h2>合规服务</h2>
        <div class="search-bar">
          <div class="search-tab">
            <span class="tab-item" :class="{active: searchType === 'statute'}"
                  @click="tabClick('statute')">化学品法规</span>
            <span class="tab-item" :class="{active: searchType === 'number'}"
                  @click="tabClick('number')">UN编号</span>
            <span class="tab-item" :class="{active: searchType === 'cas'}"
                  @click="tabClick('cas')">CAS号</span>
          </div>
          <input type="text" placeholder="请输入搜索关键字" ref="content" v-model="keywords" @input="getSelect"/>
          <div class="input-down" v-show="searchType === 'statute'">
            <!--<div class="input-down-item" v-for="(v, i) in clList" :key="i" @click="toSearch(v.keywords)">-->
            <!--<div class="input-down-item" v-for="(v, i) in clList" :key="i" @click="toSearch(this.$ref.content.value)">-->
            <div class="input-down-item" v-for="(v, i) in clList" :key="i" @click="toSearch(v.lawName)">
              <div style="line-height: 2">{{ v.lawName }}</div>
              <div style="line-height: 2">{{ v.fileId }}</div>
            </div>
          </div>
          <div class="input-down" v-show="searchType === 'number'">
            <div class="input-down-item" v-for="(v, i) in unList" :key="i" @click="toSearch(v.id)">
              <!-- {{ `${v.shippingNameCh} ${v.shippingNameEn} ${v.unNo}` }} -->
              <div style="line-height: 2">{{ v.shippingNameCh }}</div>
              <div style="line-height: 2">{{ v.shippingNameEn }}</div>
              <div style="line-height: 2">{{ v.unNo }}</div>
            </div>
          </div>
          <div class="input-down" v-show="searchType === 'cas'">
            <div class="input-down-item" v-for="(v, i) in casList" :key="i" @click="toSearch(v.uuId)">
              <!-- {{ `${v.aliasCh} ${v.casNo} ${v.unNo}` }} -->
              <div style="line-height: 2">{{ v.aliasCh }}</div>
              <div style="line-height: 2">{{ v.casNo }}</div>
              <div style="line-height: 2">{{ v.unNo }}</div>
            </div>
          </div>
          <!--<span class="btn-search" @click="toSearch"></span>-->
        </div>
<!--        <div class="last-search">
          <span style="color: #99bee2">近期搜索：</span>
          <span class="last-search-item">甲醛</span>
          <span class="last-search-item">003091</span>
          <span class="last-search-item">Forthmattle</span>
        </div>-->
      </div>
      <div class="card" style="background: rgba(0, 229, 221, .66); width:620px">
        <h2>协同监管云</h2>
        <div style="margin-top: 40px;">
          <div class="card-item" @click="toPage('situation')">
            <img src="../assets/home/icon_whole.png"   >
            <h3>全局流量</h3>
          </div>
          <div class="card-item" @click="toPage('process')">
            <img src="../assets/home/icon_screen.png"  >
            <h3>全流程监管</h3>
          </div>
          <div class="card-item" @click="toPage('track')">
            <img src="../assets/home/icon_alarm.png"   >
            <h3>应急指挥</h3>
          </div>
          <div class="card-item" @click="toPage('realTimeMonitoring')">
            <img src="../assets/home/icon_radar.png"   >
            <h3>实时监控</h3>
          </div>
          <div class="card-item" @click="toPage('analysis')">
            <img src="../assets/home/icon_statistic.png" >
            <h3>统计分析</h3>
          </div>
          <div class="card-item" @click="toPage('wharfMonitor')">
            <img src="../assets/home/icon_wharfamap.png" >
            <h3>码头作业监控</h3>
          </div>
        </div>
        <img src="../assets/home/city_bg.png"
              style="position: absolute; width: 100%; bottom: 0; left: 0;">
      </div>
      <div class="card" style="background: rgba(37, 171, 240, .66); height: 310px;width:500px">
        <h2>进出港口管理</h2>
        <div style="margin-top: 40px;">
          <div class="card-item" @click="openPage(navUrls.wharfUrl)">
            <img src="../assets/home/icon_wharf.png" >
            <h3>码头业务</h3>
          </div>
          <div class="card-item" @click="openPage(navUrls.flowStockUrl)">
            <img src="../assets/home/icon_stock.png" >
            <h3>流量与存量</h3>
          </div>
        </div>
      </div>
      <div class="card" style="background: rgba(32, 218, 115, .66); height: 473px;">
        <h2>运输使用管理</h2>
        <div style="margin-top: 40px;">
          <div class="card-item" @click="openPage(navUrls.qualificationUrl)">
            <img src="../assets/home/icon_record.png" >
            <h3>资质备案</h3>
          </div>
          <div class="card-item" @click="openPage(navUrls.warehouseUrl)">
            <img src="../assets/home/icon_house.png">
            <h3>企储管理</h3>
          </div>
        </div>
        <div class="card-item" style="width: 350px; height: 108px;"
              @click="openPage(navUrls.supplyChainUrl)">
          <img src="../assets/home/icon_car.png" style="vertical-align: middle; margin-right: 28px;">
          <h3 style="display: inline-block; margin: auto;">供应链协同</h3>
        </div>
      </div>
      <div class="card" style="background: rgba(115, 59, 230, .66); height: 310px;"
            @click="openPage(navUrls.wasteSuperviseUrl)">
        <img src="../assets/home/icon_supervise.png"  width="60" style="margin-top: 106px">
        <h3>危废监管</h3>
      </div>
      <div class="card" style="background: rgba(95, 61, 241, .66);height: 310px;width: 250px"
            @click="openPage(navUrls.emergencyUrl)">
        <img src="../assets/home/icon_command.png" style="margin-top: 100px;">
        <h3>应急指挥</h3>
      </div>
      <div class="card" style="background: rgba(240, 140, 42, .66); height: 147px;width: 250px"
           @click="openPage(navUrls.educationUrl)">
        <h3 style="margin-top: 50px;">公共服务</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { setToken } from '@/libs/util'
import { getConfig } from '@/api/config'
import { getUn, getCas, getCL } from '@/api/search'

export default {
  data () {
    return {
      searchType: 'statute',
      keywords: '',
      searchMap: {
        'statute': '3',
        'number': '2',
        'cas': '1'
      },
      searchUrl: '',
      navUrls: '',
      unList: [
      ],
      casList: [
      ],
      clList: [
      ]
    }
  },
  computed: {
    userName () {
      return this.$store.state.user.userName
    },
    token () {
      return this.$store.state.user.token
    }
  },
  created () {
    this.getTokenFromUrl()
    this.getNavConfig()
  },
  mounted () {

  },
  methods: {
    ...mapActions([
      'getUserInfo',
      'handleLogOut'
    ]),
    getSelect() {
      switch (this.searchType) {
        case 'number':
          this.getUn()
          return
        case 'cas':
          this.getCas()
          return
        case 'statute':
          this.getCL()
          return
      }
    },
    getNavConfig () {
      getConfig().then(res => {
        this.navUrls = res.data
        this.searchUrl = res.data.searchUrl
        this.getInfo()
      })
    },
    toPage (name) {
      let routeUrl = this.$router.resolve({
        name: name
      })
      window.open(routeUrl.href, '_blank')
    },
    getInfo () {
      this.getUserInfo().then(user => {
        // console.log('user', user)
      }).catch(err => {
        let url = 'http://' + window.location.host
        window.location.replace(`${this.navUrls.navUrl}`)
        this.$Message.error(err)
      })
    },
    getTokenFromUrl () {
      let url = window.location.href
      let str = url.match(/token=(\S*)#/)
      if (str) {
        setToken(str[1])
      }
    },
    openPage (url) {
      window.open(url + '?token=' + this.token, '_blank')
    },
    toSearch (id) {
      if (this.keywords === '') return
      let searchWord = ''
      switch (this.searchMap[this.searchType]) {
        case '1':
          searchWord = 'queryUuid'
          break
        case '2':
          searchWord = 'queryId'
          break
        case '3':
          searchWord = 'keywords'
      }
      // let toUrl = this.searchUrl + '?type=' + this.searchMap[this.searchType] + '&' + searchWord + '=' + id
      let toUrl = 'https://whpgylxt.asoco.com.cn/#/productDataNoLogin' + '?type=' + this.searchMap[this.searchType] + '&' + searchWord + '=' + id
      window.open(toUrl, '_blank')
    },
    logout () {
      this.$Modal.confirm({
        title: '确认登出吗？',
        content: '',
        onOk: () => {
          this.handleLogOut().then(res => {
            let url = 'http://' + window.location.host
            window.location.replace(`${this.navUrls.navUrl}`)
          })
        },
        onCancel: () => {
        }
      })
    },
    tabClick (type) {
      this.searchType = type
      this.unList = []
      this.casList = []
      this.clList = []
      this.keywords = ''
      // switch (type) {
      //   case 'number':
      //     this.getUn()
      //     return
      //   case 'cas':
      //     this.getCas()
      //     return
      // }
    },
    getUn () {
      getUn({ keyWords: this.keywords }).then(res => {
        const { data, code } = res
        if (code == 1) {
          this.unList = data
        }
      })
    },
    getCas () {
      getCas({ SelectKey: this.keywords }).then(res => {
        const { data, code } = res
        if (code == 1) {
          this.casList = data
        }
      })
    },
    getCL () {
      let param = {
        lawName: this.$refs.content.value
      }
      getCL(param).then((res) => {
        console.log(res)
        if (res.code === 1) {
          this.clList = res.data.records
        }
      }).catch(err => {
        console.log(err)
      })
    }

    //     .then(res => {
    //     console.log(res)
    //     console.log("打印正确的信息")
    //     if (res.code == 1) {
    //       this.clList = res.data
    //     }
    //   }).catch(err => {
    //     // console.log(err)
    //     console.log("打印出了错误的信息")
    //   })
    // }

  }
}
</script>

<style lang="less">
  .home {
    width: 100%;
    height: 100%;
    background: url("../assets/home/bg.jpg") no-repeat center;
    background-size: 100% 100%;
    color: #fff;
    padding: 50px 50px 0px 50px;
    text-align: center;
    .header {
      width: 1400px;
      margin: auto;
      height: 70px;
      h1 {
        margin: 0;
        font-weight: normal;
        font-size: 36px;
        float: left;
      }
      .user-info {
        margin-top: 20px;
        float: right;
        font-size: 18px;
        .logout {
          position: relative;
          display: inline-block;
          margin-left: 22px;
          width: 19px;
          height: 21px;
          top: 3px;
          background: url("../assets/home/icon_logout.png") no-repeat;
          background-size: 100% 100%;
          cursor: pointer;
        }
      }
    }
    .card-container {
      width: 1400px;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-content: flex-start;
      margin: auto;
      // .left-container {
      //   width: 620px;
      //   height: 200px;
      //   float: left;
      // }
      // .middle-container {
      //   width: 500px;
      //   height: 200px;
      //   margin-left: 15px;
      //   float: left;
      // }
      // .right-container {
      //   width: 250px;
      //   height: 200px;
      //   margin-left: 15px;
      //   float: left;
      // }
      .card {
        text-align: center;
        overflow: hidden;
        margin: 17px 17px 0 0;
        position: relative;
        h2 {
          margin: 27px auto 0;
          font-size: 24px;
          font-weight: normal;
        }
        h3 {
          margin: 20px 0 0 0;
          font-size: 20px;
          font-weight: normal;
          cursor: pointer;
        }
        .card-item {
          margin: 0px 10px 10px 0;
          padding-top: 30px;
          display: inline-block;
          width: 170px;
          height: 170px;
          background: rgba(255, 255, 255, .1);
          cursor: pointer;
          overflow: hidden;
        }
        .card-item:hover {
          background: rgba(255, 255, 255, .2);
        }
      }
      .search-bar {
        position: relative;
        width: 530px;
        height: 44px;
        margin: 90px auto 0;
        line-height: 44px;
        border: 1px solid #eaf5ff;
        text-align: left;
        .search-tab {
          position: absolute;
          top: -40px;
          left: -1px;
        }
        .tab-item {
          padding: 5px 10px;
          font-size: 18px;
          cursor: pointer;
        }
        .tab-item.active {
          border: 1px solid #eaf5ff;
          border-bottom: 1px solid #1a5fa4;
        }
        input {
          width: 380px;
          padding: 0 10px;
          background: transparent;
          border: none;
          font-size: 20px;
          outline: none;
          color: #fff;
          caret-color: #89aaca;
        }
        input::-webkit-input-placeholder {
          color: #89aaca;
        }
        .btn-search {
          position: absolute;
          top: 8px;
          right: 10px;
          width: 29px;
          height: 29px;
          background: url("../assets/home/icon_search.png") no-repeat center;
          background-size: 100% 100%;
          cursor: pointer;
        }
      }

      .input-down {
        border: 0px solid #ddd;
        height: 110px;
        //overflow: auto;
        overflow-x: hidden;
        overflow-y: scroll;

        > .input-down-item{
          border-bottom: 0px solid #ddd;

          margin: 10px 8px 3px 5px;
          padding-left: 10px;
          background: rgba(255, 255, 255, .09);
          cursor: pointer;
          overflow: hidden;
        }
        > .input-down-item:hover{
          background: rgba(255, 255, 255, .2);
        }
      }
      .input-down::-webkit-scrollbar {   //定义滚动条样式（高宽及背景）
        display: none;
      }
      .input-down::-webkit-scrollbar-thumb {  //定义滑块 样式
        border-radius: 3px;
        height: 100px;    /* 滚动条滑块长度 */
        background-color: rgba(255,255,255,.5);
      }
      .input-down::-webkit-scrollbar-track {  //定义滚动条轨道（凹槽）样式
        background-color: rgba(255,255,255,.3);  //设置背景透明
        border-radius: 3px;
      }

      .last-search {
        margin: 80px auto 0;
        text-align: left;
        width: 530px;
        color: #fff;
        font-size: 18px;
        .last-search-item {
          display: inline-block;
          margin-left: 30px;
          cursor: pointer;
        }
      }

    }
  }
</style>
