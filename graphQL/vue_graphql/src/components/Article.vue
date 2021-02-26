<template>
  <div class="article">
    <h1>{{ msg }}</h1>    


    <button @click="getData()">获取文章数据</button>

   <ul>

      <li v-for="(item,key) of articleList" v-bind:key="key">
          {{item.title}}
      </li>      
    </ul>


  </div>
</template>

<script>

  import gql from 'graphql-tag';

  var articleListGql=gql`query articleList($page:Int!,$pageSize:Int!){

       articleList(page:$page,pageSize:$pageSize){
        title       
      }
  }`;
  export default {
    name: 'app',
    data(){
      return{

        msg:'article页面',

        articleList:[]

      }
    },
    methods:{

      getData(){

        // alert('111');

        this.$apollo.addSmartQuery('articleList',{

          query:articleListGql,
          
          variables:{
            page:2,
            pageSize:8

          },
          
          result(response){

            console.log(response)

          },error(err){

              console.log(err)
          }

        })
      }
    }
  }
</script>

<style scoped>

</style>
