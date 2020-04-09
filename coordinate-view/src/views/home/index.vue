<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>
<script>
import home from './home'
export default {
  name: 'Index',
  components: {
    home
  },
  created() {
    this.currentRole = 'home'
  }
}
</script>

<style lang="scss" scoped>
</style>

