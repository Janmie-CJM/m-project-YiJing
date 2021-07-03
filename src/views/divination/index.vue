<template>
  <div class="app-container">
    <!-- ---------------------------------------------------------------------------- -->
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <!-- 1、时间 -->
      <el-form-item label="占卦时间" prop="date">
        <el-date-picker
          v-model="form.date"
          type="datetime"
          placeholder="Pick a date"
          style="width: 100%;"
        />
      </el-form-item>
      <!-- 2、占卦问题 -->
      <!-- 《易经》占卦需注意以下三点：
                第一，只问一件事，不要问一辈子；
                第二，只问自己眼前的遭遇，不问别人隐私；
                第三，只问正常事情，不问违背道义的事。 -->
      <el-form-item label="占卦问题" prop="question">
        <el-input v-model="form.question" type="textarea" clearable />
      </el-form-item>
      <el-form-item label="问题类型">
        <el-checkbox-group
          v-for="(item, index) in checkboxList"
          :key="index"
          v-model="form.type"
          style="display:inline-block; padding-left: 20px"
        >
          <el-checkbox :label="item.label" :value="item.value" name="type">{{
            item.label
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 3、输入数字 -->
      <el-form-item label="③" prop="yao">
        <el-input v-model="form.yao" type="number" clearable />
      </el-form-item>
      <el-form-item label="②" prop="shang">
        <el-input v-model="form.shang" type="number" clearable />
      </el-form-item>
      <el-form-item label="①" prop="xia">
        <el-input v-model="form.xia" type="number" clearable />
      </el-form-item>
      <!-- 3、我的理解 -->
      <!-- <el-form-item label="我的理解">
        <el-input v-model="form.desc" type="textarea" clearable />
      </el-form-item> -->
      <!-- 4、查询 -->
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- ---------------------------------------------------------------------------- -->
    <el-card v-if="showResult" shadow="never">
      <p>{{ res_date }}</p>
      <p style="font-weight:bold;font-size:20px;">{{ form.question }}</p>
      <p>
        ③ 爻（{{ form.yao }}）：<span>{{ res_yao }}</span>
      </p>
      <p>
        ② 上卦（{{ form.shang }}）：<span
          class="showSty"
          title="点击查看详情"
          @click="showSygDetail(res_shang)"
        >
          {{ res_shang | getSyg() }}
        </span>
      </p>
      <p>
        ① 下卦（{{ form.xia }}）：<span
          class="showSty"
          title="点击查看详情"
          @click="showSygDetail(res_xia)"
        >
          {{ res_xia | getSyg() }}
        </span>
      </p>
      <!-- === 最终卦 === -->
      <!-- <p>
        <el-tooltip effect="dark" placement="top">
          <div
            slot="content"
            style="display:flex;align-item:center;justify-content:center"
          >
            <img :src="finalGuaImg" style="width:80%">
          </div>
          <h3>{{ gua_res.name }}</h3>
        </el-tooltip>
      </p> -->

      <h3>{{ gua_res.name }}</h3>
      <p><img :src="finalGuaImg" style="width:80%">
      </p>

      <el-card shadow="never">
        <el-tooltip effect="dark" placement="top">
          <div slot="content">
            <p v-for="(item, index) in gua_res.guayaoyi" :key="index">
              <span v-if="index == 0" style="color:red;font-weight:bold">{{
                item
              }}</span>
              <span v-else-if="index == res_yao_show" style="color:red">{{
                item
              }}</span>
              <span v-else>{{ item }}</span>
            </p>
          </div>
          <div>
            <p v-for="(item, index) in gua_res.guayao" :key="index">
              <span
                v-if="index == 0"
                title="点击查看详情"
                class="showGYSty"
                style="color:red;font-weight:bold"
                @click="showGYDialog(index)"
              >{{ item }}</span>
              <span
                v-else-if="index == res_yao_show"
                title="点击查看详情"
                class="showGYSty"
                style="color:red"
                @click="showGYDialog(index)"
              >{{ item }}</span>
              <span
                v-else
                title="点击查看详情"
                class="showGYSty"
                @click="showGYDialog(index)"
              >{{ item }}</span>
            </p>
          </div>
        </el-tooltip>
      </el-card>
      <el-card shadow="never">
        <p style="color:red;font-weight:bold">{{
          gua_res.guayaoyi[0]
        }}</p>
        <p style="color:red">{{
          gua_res.guayaoyi[res_yao_show]
        }}</p>
      </el-card>

      <div style="margin:20px 0;">
        <span
          class="showSty"
          title="点击查看详情"
          @click="(publicDialogVisible = true), (yunshisuduanDialog = true)"
        >运势速断：>>></span>
        <el-card v-if="yssd.length > 0" shadow="never">
          <p v-for="(item, index) in yssd" :key="index">
            <span>{{ gua_res.yunshisuduan[item] }}</span>
          </p>
        </el-card>
      </div>

      <div style="margin:20px 0;">
        <span
          class="showSty"
          title="点击查看详情"
          @click="(publicDialogVisible = true), (chushizhidaoDialog = true)"
        >处世之道：>>></span>
        <el-card shadow="never">
          <p>{{ gua_res.chushizhidao[0] }}</p>
          <p>{{ gua_res.chushizhidao[1] }}</p>
        </el-card>
      </div>
    </el-card>

    <!-- ---------------------------------------------------------------------------- -->
    <!-- dialog——三爻卦 -->
    <el-dialog :visible.sync="sygDialogVisible" width="80%">
      <span slot="title">{{ dialogTitle }}</span>
      <h3>{{ sygDetail }}</h3>
      <div style="display: flex; align-item: center; justify-content: center">
        <el-row>
          <el-col :span="12">
            <el-row>
              <img :src="sygImg" alt="" style="width:100%">
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
      <span slot="footer">
        <el-button @click="sygDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- dialog——运势速断/处世之道 -->
    <el-dialog
      :visible.sync="publicDialogVisible"
      width="80%"
      @close="
        (publicDialogVisible = false),
        (chushizhidaoDialog = false),
        (yunshisuduanDialog = false),
        (guaciyaociDialog = false)
      "
    >
      <template v-if="yunshisuduanDialog">
        <span slot="title">运势速断 —— {{ gua_res.name }}</span>
        <div v-for="(item, index) in gua_res.yunshisuduan" :key="index">
          <p>{{ item }}</p>
        </div>
      </template>

      <template v-if="chushizhidaoDialog">
        <span slot="title">处世之道 —— {{ gua_res.name }}</span>
        <div v-for="(item, index) in gua_res.chushizhidao" :key="index">
          <p>{{ item }}</p>
        </div>
      </template>

      <template v-if="guaciyaociDialog">
        <span slot="title">卦辞爻辞详解 —— {{ gua_res.name }}</span>
        <template v-if="tarGY == 0">
          <div
            v-for="(item, index) in gua_res.guaciyaoci[tarGY]"
            :key="index"
            style="margin-bottom:40px;"
          >
            <div v-for="(_item, _index) in item" :key="_index">
              <p>{{ _item }}</p>
            </div>
          </div>
        </template>
        <template v-else>
          <div v-for="(item, index) in gua_res.guaciyaoci[tarGY]" :key="index">
            <p>{{ item }}</p>
          </div>
        </template>
      </template>

      <span slot="footer">
        <el-button @click="publicDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- <div>
      <el-row :gutter="12">
        <el-col :span="12">
          <img src="@/assets/mockdata/syg.jpg" alt="" style="width:100%">
        </el-col>
        <el-col :span="12">
          <el-row>
            <img
              src="@/assets/mockdata/yingshe.jpg"
              alt=""
              style="width:100%"
            >
          </el-row>
          <el-row>
            <img
              src="@/assets/mockdata/sygyuanpan.jpg"
              alt=""
              style="width:100%"
            >
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <img src="@/assets/mockdata/liuyao.jpg" alt="" style="width:100%">
        </el-col>
        <el-col :span="12">
          <img src="@/assets/mockdata/liuyao2.png" alt="" style="width:100%">
        </el-col>
      </el-row>
    </div> -->
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { sanyaogua, liusigua } from '@/assets/mockdata/yijing.js'
export default {
  filters: {
    getSyg(val) {
      let res = {}
      if (val) {
        sanyaogua[val] ? (res = val + ' ' + sanyaogua[val].name) : (res = '')
      } else {
        res = ''
      }
      return res
    }
  },
  data() {
    // 表单验证 —— 三位数整数格式
    var checkThreeNum = (rule, value, callback) => {
      if (value) {
        if (/^\d{3}$/.test(value)) {
          callback()
        } else {
          callback(new Error('三位数整数格式不正确，参考格式{986、236...}'))
        }
      }
      callback()
    }
    return {
      // 填写表单
      form: {
        date: null, // 时间
        question: '', // 占卦问题
        type: [],
        yao: null, // 爻
        shang: null, // 下卦
        xia: null // 下卦
        // desc: '' // 我的理解
      },
      // 多选框
      checkboxList: [
        { label: '运势', value: 1 },
        { label: '事业', value: 2 },
        { label: '爱情', value: 3 },
        { label: '疾病', value: 4 },
        { label: '经商', value: 5 },
        { label: '诉讼', value: 6 },
        { label: '出行', value: 7 },
        { label: '人生', value: 8 }
      ],
      // card 内容
      showResult: false,
      res_date: null,
      res_yao: null,
      res_yao_show: null,
      res_shang: null,
      res_xia: null,
      sanyaogua: sanyaogua,
      liusigua: liusigua,
      // 表单校验
      rules: {
        date: [
          { required: true, message: '请输入占卦时间', trigger: 'change' }
        ],
        question: [
          { required: true, message: '请输入占卦问题', trigger: 'blur' }
        ],
        yao: [
          { required: true, message: '请输入三位数整数', trigger: 'blur' },
          { validator: checkThreeNum, trigger: ['blur', 'change'] }
        ],
        shang: [
          { required: true, message: '请输入三位数整数', trigger: 'blur' },
          { validator: checkThreeNum, trigger: ['blur', 'change'] }
        ],
        xia: [
          { required: true, message: '请输入三位数整数', trigger: 'blur' },
          { validator: checkThreeNum, trigger: ['blur', 'change'] }
        ]
      },
      // 三爻卦 dialog 组件
      sygDialogVisible: false,
      dialogTitle: '',
      sygDetail: '',
      sygImg: '',
      // 六十四卦——结果
      gua_res: {},
      // 六十四卦——运势速断/处世之道 dialog 组件
      publicDialogVisible: false,
      yunshisuduanDialog: false,
      chushizhidaoDialog: false,
      guaciyaociDialog: false,
      tarGY: '', // 当前选中的卦辞爻辞

      finalGuaImg: '',
      yssd: []
    }
  },
  created() {
    this.form.date = parseTime(Date())
  },
  methods: {
    // 求下卦、上卦、爻（取余方法）
    formatRes(num, divval) {
      if (num != null) {
        const res = num % divval
        return res === 0 ? divval : res
      }
    },
    // 求爻（转换）
    formatYaoRes(num) {
      var a
      switch (num) {
        case 1:
          a = 6
          break
        case 2:
          a = 5
          break
        case 3:
          a = 4
          break
        case 4:
          a = 3
          break
        case 5:
          a = 2
          break
        case 6:
          a = 1
          break
        default:
          a = 0
          break
      }
      return a
    },
    // 最终卦
    findFinalGua(g1, g2) {
      const tar = String(g1) + String(g2)
      return liusigua[tar]
    },
    // 最终卦图片
    findFinalGuaImg(file, name) {
      let img = require('@/assets/mockdata/64gua/0.png')
      try {
        img = require(`@/assets/mockdata/${file}/${name}.png`)
      } catch (e) {
        console.log(e)
      }
      return img
    },
    // 运势速查——展示对应复选框的
    findYssd(arr, dict) {
      const a = []
      dict.map(r => {
        arr.map(h => {
          if (h === r.label) {
            a.push(r.value)
          }
        })
      })
      return a
    },
    // === 查询结果 ===
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.showResult = true
          this.res_date = parseTime(this.form.date)
          this.res_yao = this.formatRes(this.form.yao, 6)
          this.res_yao_show = this.formatYaoRes(this.res_yao)
          this.res_shang = this.formatRes(this.form.shang, 8)
          this.res_xia = this.formatRes(this.form.xia, 8)
          this.gua_res = this.findFinalGua(this.res_shang, this.res_xia)
          this.finalGuaImg = this.findFinalGuaImg('64gua', this.gua_res.img)
          this.yssd = this.findYssd(this.form.type, this.checkboxList)
        } else {
          this.$message({
            type: 'warning',
            message: '请先完善信息！！'
          })
        }
      })
    },
    // dialog——"三爻卦"对话框详细信息
    showSygDetail(tar) {
      this.sygDialogVisible = true
      this.dialogTitle = sanyaogua[tar].name
      this.sygDetail = sanyaogua[tar].detail
      this.sygImg = this.findFinalGuaImg('sanyaogua', sanyaogua[tar].img)
    },
    // dialog——“卦辞爻辞”详细信息
    showGYDialog(tar) {
      this.publicDialogVisible = true
      this.guaciyaociDialog = true
      this.tarGY = tar
    }
  }
}
</script>

<style style="less">
.line {
  text-align: center;
}
.showSty {
  cursor: pointer;
}
.showSty:hover {
  color: rgb(255, 60, 0);
}
.showGYSty {
  cursor: pointer;
}
.showGYSty:hover {
  color: rgb(24, 142, 245) !important;
}
</style>
