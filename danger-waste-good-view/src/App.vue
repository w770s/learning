<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>

export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style>

  /* 纵向表格 */
  .productInfoBox .el-card__header {
    background-color: gray;
    padding: 10px 20px;
  }

  .productInfoBox .tableTitle {
    padding: 10px 0;
  }

  .productInfoTable {
    width: 100%;
    border-right: 1px solid #dfe6ec;
    border-bottom: 1px solid #dfe6ec;
  }

  .productInfoTable tr:nth-child(2n) {
    background-color: #fafafa;
  }

  .productInfoTable tr {
    height: 50px;
  }

  .productInfoTable tr th {
    text-align: right;
    border-left: 1px solid #dfe6ec;
    border-top: 1px solid #dfe6ec;
    width: 30%;
    padding-right: 10px;
    box-sizing: border-box;
  }

  .productInfoTable tr td {
    border-left: 1px solid #dfe6ec;
    border-top: 1px solid #dfe6ec;
    padding-left: 10px;
    /*width: 70%;*/
  }

  .productInfoTable tr .infoBoxTd:nth-of-type(1) {
    /*text-align:right;*/
    /*font-weight: bold;*/
    border-left: 1px solid #dfe6ec;
    border-top: 1px solid #dfe6ec;
    width: 30%;
    padding-right: 10px;
    box-sizing: border-box;
  }

  .productInfoTable tr .infoBoxTd:nth-of-type(2) {
    border-left: 1px solid #dfe6ec;
    border-top: 1px solid #dfe6ec;
    padding-left: 10px;
    /*width: 70%;*/
  }

  .el-table .success-row {
    background: #fcfcfc;
  }

  .flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
