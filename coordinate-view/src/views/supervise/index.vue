<template>
  <div class="content">
    <el-row type="flex" class="el-row-bg" :gutter="20">
      <el-col v-for="(item,index) in dataList" :key="index" :span="6" class="el-col-padding">
        <div class="el-col-border" @click.stop="goforDetail(0)">
          <div class="bg-purple">
            {{ item.enterpriseName }}
          </div>
          <div class="bg-content">
            <div @click.stop="goforDetail(1)">停车场重车：<span>{{ item.heavyCar }}</span></div>
            <div @click.stop="goforDetail(2)">装货中：{{ item.loading }}</div>
            <div @click.stop="goforDetail(3)">停车场空车：{{ item.emptyCar }}</div>
            <div @click.stop="goforDetail(4)">卸货中：{{ item.unloading }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { regulatorList } from '@/api/coordinate'

export default {
  name: 'Index',
  data() {
    return {
      dataList: []
    }
  },
  mounted() {
    this.apiRegulatorList()
  },
  methods: {
    goforDetail(status) {
      this.$router.push({ path: '/supervise/detail', query: { id: `${status}` }})
    },
    apiRegulatorList() {
      regulatorList().then(res => {
        this.dataList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  background-color: #fff;
  padding: 10px;
  box-shadow: 1px 1px 9px #f2f2f2;
}
.el-col-padding{
  padding:10px 0 5px 0;
}
.el-col-border{
  cursor: pointer;
  width:100%;
  border: 1px solid #D2D2D2;
}
.bg-purple{
  background-color: #F4F4F4;
  text-align: center;
  line-height: 50px;
}
.bg-content{
  padding:20px;
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
  & div{
    padding:10px;
    text-align: center;
    width:50%;
    & span{
      color:red;
    }
  }

}
.el-row-bg{
    display:flex;
    flex-wrap: wrap;
}
</style>
