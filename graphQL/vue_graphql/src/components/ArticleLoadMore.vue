<template>
  <div class="article">
    <h1>{{ msg }}</h1>

    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
      <ul>
        <li v-for="(item,key) of articleList" v-bind:key="key">{{item.title}}</li>
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
      page: 1,
      busy: false
    };
  },
  apollo: {
    articleList() {
      return {
        // GraphQL 查询
        query: articleListGql,
        // 初始变量
        variables: {
          page: this.page,
          pageSize: 5
        }
      };
    }
  },
  methods: {
    loadMore() {
      this.page++;

      this.$apollo.queries.articleList.fetchMore({
        // 新的变量
        variables: {
          page: this.page,
          pageSize: 5
        },
        // 用新数据转换之前的结果
        updateQuery: (previousResult, { fetchMoreResult }) => {
          console.log(fetchMoreResult);
          return {
            articleList: [
              ...previousResult.articleList,
              ...fetchMoreResult.articleList
            ]
          };
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
