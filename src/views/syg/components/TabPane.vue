<template>
  <div>
    <h1>{{ dataInfo.name }}</h1>
    <h2>{{ dataInfo.detail }}</h2>
    <div style="display: flex; align-item: center; justify-content: center">
      <el-row>
        <el-col :span="12">
          <el-row>
            <img :src="sygImg" style="width:100%">
          </el-row>
          <el-row>
            <img
              src="@/assets/mockdata/sygyuanpan.jpg"
              alt=""
              style="width:100%"
            >
          </el-row>
        </el-col>
        <el-col :span="12">
          <img src="@/assets/mockdata/syg.jpg" alt="" style="width:100%">
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
  },
  props: {
    dataInfo: {
      type: Object,
      /* eslint-disable */
      default: {}
    }
  },
  data() {
    return {
      sygImg: ''
    }
  },
  created() {
    this.sygImg = this.findFinalGuaImg('sanyaogua', this.dataInfo.img)
    this.$nextTick()
  },
  methods: {
    // 最终卦图片
    findFinalGuaImg(file, name) {
      let img = require('@/assets/mockdata/64gua/0.png')
      try {
        img = require(`@/assets/mockdata/${file}/${name}.png`)
      } catch (e) {
        console.log(e)
      }
      return img
    }
  }
}
</script>

