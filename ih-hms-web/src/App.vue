<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">
body .el-table th.gutter {
  display: table-cell !important;
}

.app-container{
  font-size: 14px;
}

.card-box /deep/ .el-card__body .el-form .el-form-item .el-form-item__label{
  width: 90px;
  text-align: left !important;
  font-size: 14px;
  font-weight: normal !important;
}

label{
   width: 90px;
  text-align: left !important;
  font-size: 14px;
  font-weight: normal !important;
}

.el-table /deep/ .el-table__header-wrapper .el-table__header .has-gutter th{
  border-right: none;
}

/* 用来设置当前页面element全局table 选中某行时的背景色*/
.el-table__body tr.current-row > td {
  background-color: #D3E8F2 !important;
  /* color: #f19944; */
  /* 设置文字颜色，可以选择不设置 */
}

/* 用来设置当前页面element全局table 鼠标移入某行时的背景色*/
.el-table--enable-row-hover .el-table__body tr:hover > td {
  background-color: #D3E8F2;
  /* color: #f19944; */
  /* 设置文字颜色，可以选择不设置 */
}

.el-card__body {
  padding: 20px 20px 0 20px;
}

.el-table .odd-row {
  background: #FFFFFF;
}

.el-table .even-row {
  background: #F2F6FA;
}

.el-table--border:after,.el-table--group:after,.el-table:before {
  background-color: #F2F6FA;
}

.el-table--border,.el-table--group {
  border-color: #F2F6FA;
}

.el-table td,.el-table th.is-leaf {
  border-bottom: 1px solid #F2F6FA;
}

.el-table--border th,.el-table--border th.gutter:last-of-type {
  border-bottom: 1px solid #F2F6FA;
}

.el-table--border td,.el-table--border th {
  border-right: 1px solid #F2F6FA;
}

.fromAll /deep/ .el-table .el-table__header-wrapper .el-table__header .has-gutter .is-leaf{
padding: 6px 0;
}

.fromAll /deep/ .el-table .el-table__body-wrapper .el-table__body .el-table__row .is-center .cell .el-form-item {
  margin: 0;
}

.fromAll /deep/ .el-table__body-wrapper .el-table__body .el-table__row .is-center{
  padding: 6px 0;
}

</style>
