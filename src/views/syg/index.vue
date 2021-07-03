<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" tab-position="left" shadow="never">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.img" :label="item.name" :name="item.img">
        <keep-alive>
          <tab-pane v-if="activeName==item.img" :data-info="activeData" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/TabPane'
import { sanyaogua, getSygList } from '@/assets/mockdata/yijing.js'

export default {
  name: 'Tab',
  components: { TabPane },
  data() {
    return {
      tabMapOptions: getSygList(sanyaogua),
      activeName: '1',
      activeData: sanyaogua[1]
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
      this.activeData = sanyaogua[val]
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
