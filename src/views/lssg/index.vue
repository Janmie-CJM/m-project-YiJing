<template>
  <div class="tab-container">
    <el-tabs
      v-model="activeName"
      type="card"
      tab-position="left"
      shadow="never"
    >
      <el-tab-pane
        v-for="item in tabMapOptions"
        :key="item.img"
        :label="item.name"
        :name="item.img"
      >
        <keep-alive>
          <tab-pane v-if="activeName == item.img" :data-info="activeData" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/TabPane'
import { liusigua, getSygList, sortList } from '@/assets/mockdata/yijing.js'

export default {
  components: { TabPane },
  data() {
    return {
      tabMapOptions: getSygList(liusigua).sort(sortList('img')),
      activeName: '1',
      activeData: getSygList(liusigua).sort(sortList('img'))[0]
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
      this.activeData = this.tabMapOptions[val - 1]
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    this.tabMapOptions = getSygList(liusigua).sort(sortList('img'))
  },
  methods: {}
}
</script>

<style style="less" scoped>
.tab-container {
  margin: 30px;
}

.el-tabs--card {
  height: calc(100vh - 110px);
  /* overflow-y: auto; */
}
.el-tab-pane {
  height: calc(100vh - 110px);
  overflow-y: auto;
}

</style>
