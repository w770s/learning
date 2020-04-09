<template>
  <div>
    <div class="branch"></div>
    <div class="left-menu">
      <div class="menu-item" v-for="(item,index) in menuType" :key="index" :class="{ active: tableIndex === index }"
          @click="changeLeftMenu(index,item.tableBar)">{{item.tableBar}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chooseBar',
  data () {
    return {
      menuType: [
        {
          tableBar: '全部'
        },
        {
          tableBar: '重车'
        },
        {
          tableBar: '空车'
        },
        {
          tableBar: '易制毒'
        },
        {
          tableBar: '易制爆'
        },
        {
          tableBar: '未备案'
        },
        {
          tableBar: '船舶'
        }
      ],
      tableIndex: 0
    }
  },
  methods: {
    changeLeftMenu (index, tableBar) {
      this.tableIndex = index
      if (tableBar === '船舶') {
        this.toPage()
      } else {
        this.$emit('chooseBar', tableBar)
      }
    },
    toPage () {
      this.$router.push({ name: 'realTimeShipMonitoring' })
    }
  },
  mounted () {
    this.changeLeftMenu(0, '全部')
  }
}
</script>

<style scoped>
  .branch {
    position: absolute;
    top: 100px;
    left: 4px;
    width: 30px;
    height: 440px;
    background: url("../../../assets/realTimeMonitoring/i-branch7.png") no-repeat center;
    background-size: 100% 100%;
    z-index: 2;
  }

  .left-menu {
    position: absolute;
    top: 189px;
    left: 36px;
    width: 131px;
    height: 209px;
    z-index: 2;
  }

  .menu-item {
    box-sizing: border-box;
    width: 131px;
    height: 35px;
    margin-bottom: 23px;
    padding-left: 10px;
    line-height: 35px;
    text-align: center;
    background: url("../../../assets/realTimeMonitoring/i-rectangleBlue.png") no-repeat center;
    background-size: 100% 100%;
    font-size: 18px;
    color: #0df6ff;
    font-weight: normal;
    cursor: pointer;
  }

  .active {
    background: url("../../../assets/realTimeMonitoring/i-rectangleYellow.png") no-repeat center;
    color: #fff;
  }
</style>
