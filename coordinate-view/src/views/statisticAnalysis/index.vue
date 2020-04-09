<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import wtfStatistic from './wtfStatistic'
import cyfStatistic from './cyfStatistic'
export default {
  name: 'Index',
  components: { wtfStatistic, cyfStatistic },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    this.changeComponents()
  },
  methods: {
    changeComponents() {
      this.role.some(res => {
        if (res === 'cyf-tjfx') {
          this.currentRole = 'cyfStatistic'
        }
        if (res === 'wtf-tjfx') {
          this.currentRole = 'wtfStatistic'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

