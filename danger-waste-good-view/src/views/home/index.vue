<template>
  <div class="dashboard-container">
    <home v-if="userPermission==='ADMIN'||userPermission==='WASTE_JG'" />
    <statistical-analysis v-else />
  </div>
</template>
<script>
import home from './home'
import store from '@/store'
import StatisticalAnalysis from './statisticalAnalysis'
export default {
  name: 'Index',
  components: {
    home, StatisticalAnalysis
  },
  data() {
    return {
      userPermission: store.getters.userPermission
    }
  },
  created() {
    this.currentRole = 'home'
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
</style>

