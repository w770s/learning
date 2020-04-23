<template>
  <div class="news">
    <h1>导航的增加修改删除</h1> 
    

    
    <div class="navForm">

        导航名称：<input v-model="navJson.title" type="text" /> <br><br>
   

        导航链接： <input v-model="navJson.url" type="text" /><br><br>

        <button @click="doAdd()">提交数据</button>



         <button @click="doEdit()">修改数据</button>

    </div>


  </div>
</template>

<script>


  import gql from 'graphql-tag';

  var navMutationAddGql=gql`mutation($title:String!,$url:String!){

        addNav(title:$title,url:$url){
          title
        }

  }`;

  var navMutationEditGql=gql`mutation($_id:String!,$title:String!,$url:String!){

        editNav(_id:$_id,title:$title,url:$url){
          title
        }

  }`;

  export default {
    name: 'app',
    data(){
      return{
        navJson:{
            title:"",
            url:""
        }

      }
    },methods:{

      doAdd(){


          console.log(this.navJson.title);

          this.$apollo.mutate({
            mutation:navMutationAddGql,
            variables: {
              title: this.navJson.title,
              url:this.navJson.url,
            }
          }).then((response)=>{
            
              console.log(response);
          }).catch((err)=>{

              console.log(err);

          })
        
      },
      doEdit(){
        this.$apollo.mutate({
            mutation:navMutationEditGql,
            variables: {
              _id:"5c7a1eeaa445b5090c70a021",
              title: this.navJson.title,
              url:this.navJson.url,
            }
          }).then((response)=>{
            
              console.log(response);
          }).catch((err)=>{

              console.log(err);

          })

      }
    }
 
  }
</script>

<style scoped>

</style>
