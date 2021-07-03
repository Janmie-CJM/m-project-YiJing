<template>
  <div>
    <h3>{{ dataInfo.name }}</h3>
    <p><img :src="lsgImg" style="width:80%"></p>
    <el-card shadow="never">
      <h4>处世之道</h4>
      <div v-for="(item, index) in dataInfo.chushizhidao" :key="index">
        <p>{{ item }}</p>
      </div>
    </el-card>
    <el-card shadow="never">
      <p v-for="(item, index) in dataInfo.guayao" :key="index">
        <span
          v-if="index == 0"
          title="点击查看详情"
          class="showGYSty"
          style="color:red;font-weight:bold"
          @click="(guaciyaociDialog = true), (tarGY = index)"
        >{{ item }}</span>
        <span
          v-else
          title="点击查看详情"
          class="showGYSty"
          @click="(guaciyaociDialog = true), (tarGY = index)"
        >{{ item }}</span>
      </p>
      <hr>
      <p v-for="(item, index) in dataInfo.guayaoyi" :key="index">
        <span v-if="index == 0" style="color:red;font-weight:bold">{{
          item
        }}</span>
        <span v-else>{{ item }}</span>
      </p>
    </el-card>
    <el-card shadow="never">
      <h4>运势速断</h4>
      <div v-for="(item, index) in dataInfo.yunshisuduan" :key="index">
        <p>{{ item }}</p>
      </div>
    </el-card>

    <el-dialog
      :visible.sync="guaciyaociDialog"
      width="80%"
      @close="guaciyaociDialog = false"
    >
      <span slot="title">卦辞爻辞详解 —— {{ dataInfo.name }}</span>
      <template v-if="tarGY == 0">
        <div
          v-for="(item, index) in dataInfo.guaciyaoci[tarGY]"
          :key="index"
          style="margin-bottom:40px;"
        >
          <div v-for="(_item, _index) in item" :key="_index">
            <p>{{ _item }}</p>
          </div>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) in dataInfo.guaciyaoci[tarGY]" :key="index">
          <p>{{ item }}</p>
        </div>
      </template>

      <span slot="footer">
        <el-button @click="guaciyaociDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  filters: {},
  props: {
    dataInfo: {
      type: Object,
      /* eslint-disable */
      default: {}
    }
  },
  data() {
    return {
      sygImg: "",
      guaciyaociDialog: false,
      tarGY: null
    };
  },
  created() {
    this.lsgImg = this.findFinalGuaImg("64gua", this.dataInfo.img);
    this.$nextTick();
  },
  methods: {
    // 最终卦图片
    findFinalGuaImg(file, name) {
      let img = require("@/assets/mockdata/64gua/0.png");
      try {
        img = require(`@/assets/mockdata/${file}/${name}.png`);
      } catch (e) {
        console.log(e);
      }
      return img;
    }
  }
};
</script>

<style style="less">
.showGYSty {
  cursor: pointer;
}
.showGYSty:hover {
  color: rgb(24, 142, 245) !important;
}
</style>
