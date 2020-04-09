<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
/*@import "assets/css/font.css";*/
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.tooltip-box {
  padding: 8px 15px;
  color: #0ce7f0;
  border: 1px solid #0ce7f0;
  border-radius: 0;
  background: #052237;
  .date {
    color: #fff;
    font-size: 14px;
  }
  .area {
    margin-top: 10px;
    font-size: 18px;
  }
  .number {
    margin-top: 20px;
    font-size: 30px;
    .unit {
      font-size: 14px;
    }
  }
}
.anchorBL{
  display:none;
}
.amap-circle-marker {
  min-width: 60px;
  padding: 3px;
  color: #000;
  background: #000;
  border: 1px solid #36bccf;
  .marker-content {
    padding: 2px 5px;
    background: #36bccf;
    text-align: center;
    font-size: 16px;
  }
}
.amap-park-content {
  display: table;
  color: #fff;
  width: 200px;
  height: 235px;
  border-left: 1px solid #ff7e00;
  .spot {
    margin: -3px 0 0 -4px;
    width: 8px;
    height: 8px;
    background: #ff7e00;
    border-radius: 8px;
  }
  h3 {
    margin: -15px 0 0 10px;
    font-weight: normal;
    font-size: 18px;
  }
  .amap-park-content-text {
    display: inline-block;
    margin: 20px 0 0 10px;
    padding: 5px 18px;
    font-size: 20px;
    background: rgba(0, 0, 0, .7);
    border: 1px solid #3a788b;
  }
}

</style>
