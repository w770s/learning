<template>
  <div class="article">
    <h1>{{ msg }}</h1>

    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <ul>
        <li v-for="(item,key) of articleListData" v-bind:key="key">{{item.title}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

var articleListGql = gql`
  query articleList($page: Int!, $pageSize: Int!) {
    articleList(page: $page, pageSize: $pageSize) {
      title
    }
  }
`;

export default {
  name: "app",
  data() {
    return {
      msg: "上拉分页加载更多",
      articleList: [],
      articleListData: [] /*实际要循环的数据*/,

      page: 1,
      busy: false
    };
  },
  methods: {
    loadMore() {
      this.$apollo.addSmartQuery("articleList", {
        query: articleListGql,

        variables: {
          page: this.page,
          pageSize: 8
        },

        result(response) {
          console.log(response);

          this.articleListData = this.articleListData.concat(
            response.data.articleList
          );

          this.page++;

          if (response.data.articleList < 8) {
            this.busy = true; //没有数据禁用上拉分页加载更多
          }
        },
        error(err) {
          console.log(err);
        }
      });
    }
  }
};
</script>

<style scoped>
  li {
    line-height: 4;
  }
</style>
