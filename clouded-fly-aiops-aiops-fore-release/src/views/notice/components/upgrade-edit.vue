<template>
  <el-dialog :width="'840px'" :visible.sync="editVisible" :title="title" :close-on-press-escape="false" @close="close">
    <el-form
      id="upgrade_form_upgrade"
      class="form"
      ref="upgradeform"
      :model="upgradeform"
      label-width="auto"
      :rules="upgradeFormRules"
      size="small"
    >
      <!-- 规则名 -->
      <el-form-item class="form-option" label="规则名称" prop="name">
        <el-input
          size="small"
          class="form-option-input"
          v-model.trim="upgradeform.name"
          :maxlength="50"
          placeholder="请输入"
          :disabled="isWatch"
        />
      </el-form-item>
      <!-- 适用范围 -->
      <el-form-item class="form-option" label="适用范围" prop="rules">
        <div class="form-flex">
          <el-select
            class="form-select"
            size="small"
            v-model="upgradeform.scopeType"
            placeholder="请选择"
            @change="changeType"
            :disabled="isWatch"
          >
            <el-option value="ASSOCIATE" label="关联订阅策略"></el-option>
            <el-option value="DIY" label="自定义范围"></el-option>
          </el-select>
          <!-- 选择关联订阅策略时选项 -->
          <template v-if="upgradeform.scopeType === 'ASSOCIATE'">
            <el-select
              class="form-option-select"
              v-model="upgradeform.rules"
              v-if="Array.isArray(upgradeform.rules)"
              size="small"
              multiple
              no-data-text="搜索订阅规则"
              :disabled="isWatch"
              @change="changeRule"
            >
              <el-option value="-1" label="全部策略"></el-option>
              <el-option v-for="item in rules" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </template>
        </div>
      </el-form-item>
      <!-- 规则内容 -->
      <el-form-item class="form-option" label="规则内容" v-if="upgradeform.scopeType === 'DIY'">
        <el-radio-group class="box-radio" v-model="upgradeform.rules.relation" :disabled="isWatch">
          <el-radio label="and">与</el-radio>
          <el-radio label="or">或</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 规则组合关系 -->
      <el-form-item class="form-option" label="规则组合关系" prop="contents" v-if="upgradeform.scopeType === 'DIY'">
        <diy-rule-content
          class="form-option-input"
          v-model="upgradeform.rules.contents"
          :SourceOpt="SourceOpt"
          :relation="upgradeform.rules.relation"
          :disabled="isWatch"
        ></diy-rule-content>
      </el-form-item>
      <!-- 升级模式 -->
      <el-form-item class="form-option" label="升级模式" prop="modelType">
        <el-select
          class="form-select"
          size="small"
          v-model="upgradeform.modelType"
          placeholder="请选择"
          @change="changeModel"
          :disabled="isWatch"
        >
          <el-option value="DURATION" label="告警持续时长"></el-option>
          <el-option value="FREQUENCY" label="告警发生频率"></el-option>
        </el-select>
      </el-form-item>
      <!-- 升级条件 -->
      <el-form-item class="form-option" label="升级条件" prop="condition">
        <template>
          <div class="box">
            <div class="box-item">
              <span>当告警等级为</span>
              <el-select
                class="box-select"
                v-model="upgradeform.condition.alertLeve"
                size="small"
                multiple
                @change="changeLevel"
                :disabled="isWatch"
              >
                <div v-for="(oV, oK) in levelOpt" :key="oK">
                  <el-option v-if="oK !== '0'" :value="oK" :label="oV"></el-option>
                </div>
              </el-select>
            </div>
            <div class="box-item" v-if="upgradeform.modelType === 'DURATION'">
              <span>当告警状态为</span>
              <el-select
                class="box-select"
                v-model="upgradeform.condition.alarmStatus"
                size="small"
                multiple
                :disabled="isWatch"
              >
                <el-option value="0" label="未响应"></el-option>
                <el-option value="1" label="处理中"></el-option>
              </el-select>
            </div>
            <div class="box-item" v-if="upgradeform.modelType === 'DURATION'">
              <span>持续时长超过</span>
              <el-input-number
                class="box-number"
                v-model.trim="upgradeform.condition.duration"
                controls-position="right"
                :min="5"
                :max="4320"
                :disabled="isWatch"
              ></el-input-number>
              <span>分钟</span>
            </div>
            <div class="box-item" v-if="upgradeform.modelType === 'FREQUENCY'">
              <span>在</span>
              <el-input-number
                class="box-number"
                v-model.trim="upgradeform.condition.duration"
                controls-position="right"
                :min="5"
                :max="4320"
                :disabled="isWatch"
              ></el-input-number>
              <span>分钟内，告警发生次数大于</span>
              <el-input-number
                class="box-number"
                v-model.trim="upgradeform.condition.number"
                controls-position="right"
                :min="1"
                :max="9999"
                :disabled="isWatch"
              ></el-input-number>
            </div>
          </div>
        </template>
      </el-form-item>
      <!-- 升级通知 -->
      <el-form-item class="form-option" label="升级通知" prop="report">
        <div class="box">
          <div class="form-flex box-item">
            <span class="box-item-minlabel">通知对象</span>
            <el-select
              class="box-minselect"
              size="small"
              v-model="upgradeform.report.objType"
              placeholder="请选择"
              @change="changeGroup"
              :disabled="isWatch"
            >
              <el-option value="USER" label="用户"></el-option>
              <el-option value="GROUP" label="组"></el-option>
            </el-select>
            <!-- 选择用户时选项 -->
            <template v-if="upgradeform.report.objType === 'USER'">
              <el-select
                class="box-item-option"
                v-model="upgradeform.report.objId"
                v-if="Array.isArray(upgradeform.report.objId)"
                size="small"
                multiple
                :disabled="isWatch"
              >
                <el-option
                  v-for="item in UsersGroup"
                  :key="item.ID"
                  :value="item.ID"
                  :label="item.NICKNAME"
                ></el-option>
              </el-select>
            </template>
            <!-- 选择组时选项 -->
            <template v-else>
              <el-tree-select
                v-if="!Array.isArray(upgradeform.report.objId)"
                placeholder="搜索组"
                class="box-item-option"
                :options="groups"
                v-model="upgradeform.report.objId"
                :disabled="isWatch"
              ></el-tree-select>
            </template>
          </div>
          <div class="form-flex box-item">
            <span class="box-item-minlabel">通知方式</span>
            <el-checkbox-group v-model="upgradeform.report.sendTypes" class="form-flex box-group" :disabled="isWatch">
              <div v-for="(value, key) in sendType" :key="key">
                <el-checkbox v-if="key !== 'QIYE_WEIXIN_GROUP'" :label="key">
                  {{ value }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
      </el-form-item>
      <!-- 升级级别 -->
      <el-form-item class="form-option" label="升级级别">
        <diy-switch
          style="margin-top: -2px"
          :state="upgradeform.upgradeSwitch"
          @change="switchChange"
          :disabled="isWatch"
        />
        <span class="box-item-label">提升至</span>
        <!-- 选升级到的事件级别 -->
        <el-select
          size="small"
          style="width: 86px"
          v-model="upgradeform.level"
          :disabled="isWatch || !upgradeform.upgradeSwitch"
        >
          <div v-for="(oV, oK) in upgradeLevel" :key="oK">
            <el-option v-if="oK !== '0'" :value="oK" :label="oV"></el-option>
          </div>
          <!-- <el-option v-for="(oV, oK) in upgradeLevel" :value="oK" :key="oK" :label="oV"></el-option> -->
        </el-select>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item class="form-option" label="状态">
        <diy-switch style="margin-top: -2px" :state="upgradeform.status" @change="statusChange" :disabled="isWatch" />
      </el-form-item>
    </el-form>
    <!-- 下方按钮 -->
    <div v-if="!isWatch" class="bottom" slot="footer">
      <el-button id="upgrade_button_cancel" size="small" @click="close">取 消</el-button>
      <el-button id="upgrade_button_submit" size="small" type="primary" :loading="loading" @click="onSubmit"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { apiSaveUpgrade } from '@/apis/upgrade'
import { mapGetters } from 'vuex'
import DiyRuleContent from '@/components/common/diy-rule-content'
import elTreeSelect from '@/components/common/treeSelect'
import DiySwitch from '@/components/common/diy-switch.vue'
export default {
  name: 'UpgradeEdit',
  components: {
    elTreeSelect,
    DiyRuleContent,
    DiySwitch
  },
  computed: {
    ...mapGetters(['fieldOpt', 'conditionOpt', 'levelOpt', 'statusOptions', 'sendType'])
  },
  props: {
    upgradeform: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          scopeType: 'ASSOCIATE',
          rules: [],
          modelType: 'DURATION',
          condition: {
            alertLeve: [],
            alarmStatus: [],
            duration: 30,
            number: 1
          },
          report: {
            objType: 'USER',
            objId: [],
            sendTypes: ['EMAIL']
          },
          upgradeSwitch: 0,
          level: '',
          status: 1
        }
      }
    },
    UsersGroup: {
      type: Array,
      default: () => []
    },
    // 订阅规则内容
    rules: {
      type: Array,
      default: () => []
    },
    SourceOpt: {
      type: Array,
      default: () => []
    },
    sourceMap: {
      type: Map,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    groups: {
      type: Array,
      default: () => []
    },
    visible: Boolean,
    // 是否只读
    isWatch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validataRules = (rule, value, callback) => {
      if (this.upgradeform.scopeType === 'DIY') {
        callback()
      } else {
        if (value.length) {
          callback()
        } else {
          callback(new Error())
        }
      }
    }
    const validataCondition = (rule, value, callback) => {
      if (this.upgradeform.modelType === 'DURATION') {
        for (let item in value) {
          if (Array.isArray(value[item])) {
            if (!value[item].length) {
              callback(new Error())
              return
            }
          } else {
            if (!value[item]) {
              callback(new Error())
              return
            }
          }
        }
      } else {
        if (!this.upgradeform.condition.alertLeve.length) {
          callback(new Error())
          return
        }
        if (!this.upgradeform.condition.duration) {
          callback(new Error())
          return
        }
        if (!this.upgradeform.condition.number) {
          callback(new Error())
          return
        }
      }
      callback()
    }
    const validataReport = (rule, value, callback) => {
      for (let item in value) {
        if (Array.isArray(value[item])) {
          if (!value[item].length) {
            callback(new Error())
            return
          }
        } else {
          if (!value[item]) {
            callback(new Error())
            return
          }
        }
      }
      callback()
    }
    const validataContents = (rule, value, callback) => {
      const { contents } = this.upgradeform.rules
      contents.forEach(item => {
        if (item.value === '' || item.value.length === 0) {
          callback(new Error())
          return
        }
      })
      callback()
    }
    return {
      upgradeFormRules: {
        name: [{ required: true, message: '规则名称不能为空', trigger: 'blur' }],
        rules: [{ required: true, message: '适用范围不能为空', validator: validataRules, trigger: 'change' }],
        condition: [{ required: true, message: '升级条件不能为空', validator: validataCondition, trigger: 'change' }],
        report: [{ required: true, message: '升级通知不能为空', validator: validataReport, trigger: 'change' }],
        contents: [{ message: '规则组合关系不能为空', validator: validataContents, trigger: 'change' }]
      },
      loading: false,
      editVisible: this.visible,
      ruleloading: false,
      upgradeLevel: ''
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$refs.upgradeform.resetFields()
    },
    // 提交设置规则
    async onSubmit() {
      this.$refs.upgradeform.validate(async valid => {
        if (valid) {
          this.loading = true
          const { success, desc } = await apiSaveUpgrade(this.setForm())
          this.loading = false
          if (success) {
            this.$Message.success(this.title + '成功')
            this.$emit('success')
            this.close()
          } else {
            desc && this.$Message.error(desc)
          }
        }
      })
    },
    // 设置表单提交格式
    setForm() {
      const { upgradeform } = this
      // 深拷贝
      let params = { ...upgradeform }
      // 处理内容
      for (let item in upgradeform) {
        if (item === 'condition' || item === 'report') {
          params = { ...params, ...upgradeform[item] }
          continue
        }
        if (typeof upgradeform[item] === 'number') {
          params[item] = !!upgradeform[item]
        }
      }
      // 处理格式
      for (let item in params) {
        if (Array.isArray(params[item])) {
          params[item] = params[item].join(',')
          continue
        }
      }
      if (typeof params.rules !== 'string') {
        params.rules = JSON.stringify(params.rules)
      }
      return params
    },
    // 修改适用范围选项
    changeType(val) {
      this.$nextTick(() => {
        if (val === 'DIY') {
          this.upgradeform.rules = {
            relation: 'and',
            contents: [
              {
                field: 'NAME',
                condition: 'in',
                value: ''
              }
            ]
          }
        } else {
          this.upgradeform.rules = []
        }
      })
    },
    // 修改规则内容选项
    changeGroup(val) {
      this.$nextTick(() => {
        if (val === 'USER') {
          this.upgradeform.report.objId = []
        } else {
          this.upgradeform.report.objId = ''
        }
      })
    },
    // 全部规则限制
    changeRule(val) {
      if (val.indexOf('-1') !== -1) {
        this.upgradeform.rules = ['-1']
      }
    },
    // 修改升级模式选项
    changeModel(val) {
      this.$nextTick(() => {
        this.upgradeform.condition = {
          alertLeve: [],
          alarmStatus: [],
          duration: 30,
          number: 1
        }
      })
    },
    // 升级条件里告警等级切换触发事件
    changeLevel(val) {
      this.upgradeform.level = ''
      this.getUpgradeLevel(val)
    },
    // 设置upgradeLevel内容
    getUpgradeLevel(val) {
      const max = Math.max(...val)
      const levelOpt = { ...this.levelOpt }
      let upgradeLevel = {}
      // 保留大于最大级别的级别
      for (let item in levelOpt) {
        if (item >= max) {
          upgradeLevel[item] = levelOpt[item]
        }
      }
      this.upgradeLevel = upgradeLevel
    },
    // 升级级别状态改变修改值
    switchChange(e) {
      this.upgradeform.upgradeSwitch = e
      if (!e) {
        this.upgradeform.level = ''
      }
    },
    // 状态状态改变修改值
    statusChange(e) {
      this.upgradeform.status = e
    }
  },
  created() {
    this.upgradeLevel = this.levelOpt
    this.getUpgradeLevel(this.upgradeform.condition.alertLeve)
  },
  watch: {
    visible(val) {
      this.editVisible = val
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  padding-left: 30px;
  &-option {
    &-input {
      width: 672px;
    }
    &-select {
      width: 520px;
    }
  }
  &-flex {
    display: flex;
    justify-content: flex-start;
  }
  &-select {
    width: 140px;
    margin-right: 12px;
  }
  &::v-deep .el-radio-group {
    margin: auto 0;
  }
  &::v-deep .el-select__tags-text {
    display: inline-block;
    max-width: 135px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.bottom {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  &-submit {
    margin: 0 10px;
  }
}
.el-radio,
.el-checkbox {
  margin-right: 16px;
}
.box {
  width: 672px;
  background: #f9fafe;
  border: 1px solid #dddddd;
  border-radius: 2px;
  padding: 16px 24px;
  &-radio {
    padding-left: 2px;
  }
  &-item {
    margin: 8px 0;
    &-label {
      margin: 0 16px 0 32px;
    }
    &-minlabel {
      width: 84px;
      text-align: right;
    }
    &-option {
      width: 368px;
    }
  }
  &-select {
    width: 520px;
    margin-left: 12px;
  }
  &-number {
    width: 96px;
    margin: 0 12px;
    &::v-deep .el-input-number__increase:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled),
    .el-input-number__decrease:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled) {
      border-color: #dcdfe6;
    }
    &::v-deep .el-input-number__increase:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled),
    .el-input-number__decrease:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled) {
      border-color: #dcdfe6;
    }
  }
  &-minselect {
    width: 140px;
    margin: 0 12px;
  }
  &-group {
    width: 235px;
    margin: 0 12px;
  }
  &::v-deep .merge {
    width: 100%;
  }
}
.point {
  cursor: pointer;
}
.tips {
  width: 14px;
  height: 14px;
  position: relative;
  top: 1px;
}
</style>
