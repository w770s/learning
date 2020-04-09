<template>
  <div class="hello">
    <ul>
      <li>
        {{count}}
      </li>
      <li>
        {{myCount}}
      </li>
      <li @click="add">
         <button>add</button>
      </li>
      <li @click="subtract">
        <button>subtract</button>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
    ...mapState(['count']),
    ...mapGetters(['myCount'])
  },
  methods: {
    // ...mapMutations({ // 结构赋值 平铺方法
    //   addCount: 'increment',
    //   decrementCount: 'decrement',
    //   getData: 'getData'
    // }),
    ...mapActions(['MyIncrement', 'MyDecrement', 'MyGetData']),
    // async add () {
    //   // this.$store.commit('increment') // first way
    //   // this.addCount() // second way
    //   const data = await this.MyIncrement() // action
    //   this.MyGetData({data: data})
    //   // this.getData({data:data})
    // },
    add () {
      this.MyIncrement()
    },
    subtract () {
      // this.$store.commit('decrement')
      this.MyDecrement()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
