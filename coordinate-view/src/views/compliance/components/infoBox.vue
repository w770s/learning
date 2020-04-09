<template>
  <div>
    <el-tabs type="card">
      <el-tab-pane :label="title">
        <el-card v-for="(item,index) in infoColumns.list" :key="index" class="productInfoBox1">
          <div slot="header" class="infoHead">
            <strong>{{ item.title }}</strong>
          </div>
          <div v-for="(tableItem,index2) in item.tableList" :key="index2">
            <li v-if="tableItem.title" class="tableTitle">{{ tableItem.title }}</li>
            <table class="productInfoTable" border="0" cellspacing="0" cellpadding="0">
              <tr v-for="(trItem,index3) in tableItem.list" :key="index3">
                <!--<td v-if="trItem.title" class="infoBoxTd" :class="{positionLeft:info[trItem.key]==='' && trItem.render==null,positionRight:!(info[trItem.key]==null) || !(trItem.render==null)}" :colspan=combine(info[trItem.key],trItem.render)>{{trItem.title}}</td>-->
                <td
                  v-if="trItem.title"
                  class="infoBoxTd"
                  :class="{positionLeft:trItem.key==='' && trItem.render==null,positionRight:trItem.key!=='' || !(trItem.render==null)}"
                  :colspan="combine(trItem.render,trItem.key)"
                >{{ trItem.title }}
                </td>
                <!--<td v-if="trItem.title==='' && trItem.key!==''" colspan="2"></td>-->
                <td v-if="trItem.render" :colspan="combineContent(trItem.title)" class="infoBoxTd">
                  <!--<span v-if="">{{info[trItem.key]}}</span>-->
                  <render-content :render="trItem.render" :column="info" />
                </td>
                <td
                  v-if="trItem.key!==''"
                  class="infoBoxTd"
                  :class="{positionLeftContent:trItem.title===''}"
                  :colspan="combineContent(trItem.title)"
                >{{ info[trItem.key] }}
                </td>
              </tr>
            </table>
          </div>
        </el-card>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import renderContent from '@/components/productConfig/renderContent'

export default {
  name: 'InfoBox',
  // data(){
  //   return{
  //     // flag:true,
  //     // num:1
  //
  //   }
  // },
  components: {
    renderContent
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    productInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    columns: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      infoColumns: {},
      info: this.productInfo,
      flag: false
    }
  },
  watch: {
    columns: {
      handler() {
        this.infoColumns = this.columns
        // console.log(this.infoColumns);
        // console.log(this.$refs.trItem);
      },
      immediate: true
    },
    productInfo: {
      handler() {
        this.info = this.productInfo
        // console.log(this.info);
      },
      immediate: true
    }

  },
  mounted() {

  },
  methods: {
    combine(v1, v2) {
      if (v1 == null && v2 === '') return 2
    },
    combineContent(val) {
      if (!val) return 2
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*.positionTh{*/
  /*text-align: left;*/
  /*!*width: 100%;*!*/
  /*}*/
  .positionLeft {
    /*width:100%;*/
    text-align: left;
    font-weight: bold;
  }

  .positionRight {
    text-align: right;
    font-weight: bold;
  }

  .positionLeftContent {
    text-align: left;
  }

  .productInfoBox1 {
    margin-top: 10px;
    background-color: white;
    padding: 10px 20px;
  }
</style>
