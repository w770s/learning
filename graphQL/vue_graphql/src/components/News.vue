<template>
  <div class="news">
    <h1>{{ msg }}</h1>    


    <ul>

      <li v-for="(item,key) of articleList" v-bind:key="key">
          {{item.title}}---{{item.status}}
      </li>      
    </ul>

    <button @click="getData()">
      点击按钮触发事件请求graphQl接口
    </button>

    {{navList}}

  </div>
</template>

<script>

  import gql from 'graphql-tag';

  var navListGql=gql`{
             navList{
              title           
            }

   }`;

   

  export default {
    name: 'app',
    data(){
      return{

        msg:'我是一个新闻页面',
        navList:[]

      }
    },apollo:{


      // articleList:gql`{
      //        articleList{
      //         title,
      //         status
      //       }

      // }`

        articleList:{
          query:gql`query articleList($page:Int!,$pageSize:Int!){
                articleList(page:$page,pageSize:$pageSize){
                  title,
                  status
                }
          }`,
          variables:{
            page:2,
            pageSize:10
          }
        }

      
    },
    methods:{

      getData(){
        

        this.$apollo.addSmartQuery('navList',{          

            query:navListGql,
            result(response){

              console.log(response);

            },error(err){

              consoel.log(err);

            }

        })


      }
    }
 
  }
</script>

<style scoped>

</style>
