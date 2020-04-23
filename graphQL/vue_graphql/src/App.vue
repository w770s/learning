<template>
  <div id="app">

      <div class="header">

        <router-link to="/home">首页</router-link>
        <router-link to="/news">新闻</router-link>

         <router-link to="/article">文章</router-link>

         <router-link to="/nav">导航增删改</router-link>

         <router-link to="/loadMore">加载更多</router-link>
      </div>

      <hr>

       <router-view></router-view>



  </div>
</template>

<script>


  export default {
    name: 'app'   
  }
</script>

<style>

.header a{
  
  margin: 0 5px;
}

</style>
