<template>
  <div class="news">
    <h1>{{ msg }}</h1>    


    <!-- {{navList}} -->

    <ul>

      <li v-for="(item,key) of navList" v-bind:key="key">
          {{item.title}}
      </li>      
    </ul>

    <br>
    <hr>

    <br>

    <ul>

      <li v-for="(item,key) of articleList" v-bind:key="key">
          {{item.title}}---{{item.status}}
      </li>      
    </ul>
  </div>
</template>

<script>

  import gql from 'graphql-tag';

  export default {
    name: 'app',
    data(){
      return{

        msg:'我是一个首页页面'

      }
    },
    apollo: {
      // 简单的查询，将更新 'hello' 这个 vue 属性
      navList: gql`{
         navList{
            title
          }
      }`,
      articleList:gql`{
         articleList{
            title,
            status
          }
      }`
    }
 
  }
</script>

<style scoped>

</style>
