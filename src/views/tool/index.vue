<!--  -->
<template>
  <div>
    <div style="margin: 20px 0">
      <el-radio-group
        v-for="(item, index) in checkboxList"
        :key="index"
        v-model="influence.type"
        style="display:inline-block; padding-left: 20px"
      >
        <el-radio :label="item.label" :value="item.value" name="type">{{
          item.label
        }}</el-radio>
      </el-radio-group>
      <p>
        <el-input
          v-model="influence.inputData"
          type="textarea"
          :rows="8"
          clearable
        />
      </p>
    </div>
    <!-- <textarea id="target">...!!!!注意这里要用 input 或 textarea</textarea>
    <p><el-button @click="copyContent">copy</el-button></p> -->
    <!-- <div><el-input v-model="outputData" type="textarea" :rows="5" /></div> -->
    <p>{{ outputData }}</p>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      influence: {
        inputData: '',
        type: '卦辞'
      },
      outputData: '',
      checkboxList: [
        { label: '卦辞', value: 1 },
        { label: '输入/断句', value: 2 },
        { label: '爻辞', value: 3 },
        { label: '运势速断', value: 4 }
      ]
    }
  },

  watch: {
    influence: {
      handler: 'handleDeepMessage',
      deep: true
    }
  },

  mounted() {},

  methods: {
    // 普通 将字符串分句
    formatArr(str) {
      var a = str.split('/')
      return a
    },
    // 卦辞 断句
    strSplitGua(str) {
      const a = str.split('。彖')
      const b = a[1].split('。象')
      const c = [a[0], b[0], b[1]]
      c[0] = c[0] + '。'
      c[1] = '彖' + c[1] + '。'
      c[2] = '象' + c[2]
      return c
    },
    // 爻辞 断句
    strSplitYao(str) {
      const a = str.split('。【')
      a[0] = a[0] + '。'
      a[1] = '【' + a[1] + '。'
      a[2] = '【' + a[2]
      return a
    },
    // 运势速断 断句
    strSplitYssd(str) {
      const a = str.split('—')
      a[0] = a[0].slice(0, a[0].length - 2)
      a[1] = '运势—' + a[1].slice(0, a[1].length - 2)
      a[2] = '事业—' + a[2].slice(0, a[2].length - 2)
      a[3] = '爱情—' + a[3].slice(0, a[3].length - 2)
      a[4] = '疾病—' + a[4].slice(0, a[4].length - 2)
      a[5] = '经商—' + a[5].slice(0, a[5].length - 2)
      a[6] = '诉讼—' + a[6].slice(0, a[6].length - 2)
      a[7] = '出行—' + a[7].slice(0, a[7].length - 2)
      a[8] = '人生—' + a[8]
      return a
    },
    // 监听watch——handler+deep
    handleDeepMessage(val) {
      val = val.inputData
      if (this.influence.type == '卦辞') {
        this.outputData = this.strSplitGua(val)
      } else if (this.influence.type == '爻辞') {
        this.outputData = this.strSplitYao(val)
      } else if (this.influence.type == '运势速断') {
        this.outputData = this.strSplitYssd(val)
      } else {
        this.outputData = this.formatArr(val)
      }
    },
    // 一键复制内容
    copyContent() {
      const content = document.getElementById('target')
      content.value = JSON.parse(JSON.stringify(this.outputData)) // 修改文本框的内容
      content.select() // 选择对象
      try {
        document.execCommand('Copy') // 执行浏览器复制命令
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      } catch (err) {
        console.log(err)
        this.$message({
          message: '复制失败',
          type: 'danger'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
