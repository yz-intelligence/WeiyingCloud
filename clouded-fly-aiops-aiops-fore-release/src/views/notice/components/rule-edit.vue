<template>
  <el-dialog :width="'840px'" :visible.sync="editVisible" :title="title" :close-on-press-escape="false" @close="close">
    <!-- 中间表格 -->
    <el-form
      id="rule_form_rule"
      class="form"
      ref="ruleform"
      :model="ruleform"
      label-width="140px"
      :rules="ruleFormRules"
      size="small"
    >
      <!-- 策略名称 -->
      <el-form-item class="form-option" label="策略名称" prop="name">
        <el-input
          size="small"
          class="form-option-input"
          v-model.trim="ruleform.name"
          :maxlength="100"
          placeholder="请输入"
          :disabled="isWatch"
        />
      </el-form-item>
      <!-- 所属对象 -->
      <el-form-item class="form-option" label="所属对象" prop="ownerIds">
        <div class="form-flex">
          <el-select
            class="form-option-select"
            size="small"
            v-model="ruleform.ownerType"
            placeholder="请选择"
            @change="changeGroup"
            :disabled="isWatch"
          >
            <el-option value="USER" label="用户"></el-option>
            <el-option value="GROUP" label="组"></el-option>
          </el-select>
          <!-- 选择用户时选项 -->
          <template v-if="ruleform.ownerType === 'USER'">
            <el-select
              class="form-option-group"
              v-model="ruleform.ownerIds"
              v-if="isArray()"
              size="small"
              clearable
              filterable
              multiple
              remote
              :remote-method="getUsers"
              no-data-text="搜索用户"
              :disabled="isWatch"
            >
              <el-option v-for="item in users" :key="item.ID" :value="item.ID" :label="item.NICKNAME"></el-option>
            </el-select>
          </template>
          <!-- 选择组时选项 -->
          <template v-else>
            <el-tree-select
              v-if="!isArray()"
              placeholder="搜索组"
              class="form-option-group"
              :options="groups"
              v-model="ruleform.ownerIds"
              :disabled="isWatch"
            ></el-tree-select>
          </template>
        </div>
      </el-form-item>
      <!-- 规则组合关系 -->
      <el-form-item class="form-option" label="规则组合关系" prop="relation">
        <el-radio-group v-model="ruleform.relation" :disabled="isWatch">
          <el-radio label="and">与</el-radio>
          <el-radio label="or">或</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 规则内容 -->
      <el-form-item class="form-option" label="规则内容" prop="contents">
        <diy-rule-content
          class="form-option-input"
          v-model="ruleform.contents"
          :SourceOpt="SourceOpt"
          :relation="ruleform.relation"
          :disabled="isWatch"
        ></diy-rule-content>
      </el-form-item>
      <!-- 通知方式 -->
      <el-form-item class="form-option" label="通知方式" prop="sendTypes">
        <el-checkbox-group v-model="ruleform.sendTypes" :disabled="isWatch">
          <el-checkbox v-for="(value, key) in sendType" :key="key" :label="key">
            {{ value }}
            <el-tooltip
              v-if="key === 'QIYE_WEIXIN_GROUP'"
              effect="dark"
              content="填写群机器人webhook，通过群机器人发送告警信息，支持发送多个企业微信群"
              placement="top"
            >
              <i class="point tips el-icon-tip"></i>
            </el-tooltip>
            <el-tooltip v-if="key === 'PAGER_DUTY'" effect="dark" content="海外pagerduty渠道" placement="top">
              <i class="point tips el-icon-tip"></i>
            </el-tooltip>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- 企业微信群内容 -->
      <el-form-item
        class="form-option"
        v-if="ruleform.sendTypes.includes('QIYE_WEIXIN_GROUP')"
        label="webhook地址"
        prop="qywxWebhooks"
      >
        <web-hook class="form-option-input" v-model="ruleform.qywxWebhooks" :disabled="isWatch"></web-hook>
      </el-form-item>
      <el-form-item
        class="form-option"
        v-if="ruleform.sendTypes.includes('PAGER_DUTY')"
        label="Integration Key"
        prop="pagerdutyKey"
      >
        <el-input
          size="small"
          class="form-option-input"
          v-model.trim="ruleform.pagerdutyKey"
          :maxlength="100"
          placeholder="请输入Integration Key"
          :disabled="isWatch"
        />
      </el-form-item>
      <el-form-item class="form-option" v-if="ruleform.sendTypes.includes('PAGER_DUTY')" prop="pagerdutyUrl">
        <span slot="label" style="text-align: right">Integration URL<br />(Alert Events)</span>
        <el-input
          size="small"
          class="form-option-input"
          v-model.trim="ruleform.pagerdutyUrl"
          :maxlength="100"
          placeholder="请输入Integration URL(Alert Events)"
          :disabled="isWatch"
        />
      </el-form-item>
      <!-- 通知时段 -->
      <el-form-item class="form-option" label="通知时段" prop="sendTypes">
        <el-time-picker
          class="form-option-time"
          is-range
          size="small"
          format="HH:mm"
          value-format="HH:mm"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          v-model="ruleform.beTime"
          :disabled="isWatch"
        ></el-time-picker>
      </el-form-item>
      <el-form-item class="form-option custom-switch-formitem--small" label="重复发送">
        <div>
          <div class="custom-switch-extra">
            <diy-switch
              class="form-swich-margin-right"
              :values="[true, false]"
              :disabled="isWatch"
              :state.sync="ruleform.ruleRepeatDto.repeatState"
            />
            <el-tooltip effect="dark" placement="top">
              <div slot="content">对于满足重复发送条件的事件，会在设定的时间后，重复发送通知一次</div>
              <i class="point tips el-icon-tip"></i>
            </el-tooltip>
          </div>
          <div v-show="!!ruleform.ruleRepeatDto.repeatState" class="template-wrap form-option-input">
            <div class="template-content">
              <el-select
                v-model="ruleform.ruleRepeatDto.monitorType"
                class="template-content-delay"
                size="small"
                :disabled="isWatch"
              >
                <el-option
                  v-for="item of repeatOptions.noticeType"
                  :value="item.value"
                  :key="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
              <el-select
                class="template-content-gap"
                size="small"
                :disabled="isWatch"
                v-model="ruleform.ruleRepeatDto.minuteNumber"
              >
                <el-option
                  v-for="item of repeatOptions.gapMinutes"
                  :value="item.value"
                  :key="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
              <p>检测到</p>
              <el-select
                class="template-content-condition"
                size="small"
                :disabled="isWatch"
                v-model="ruleform.ruleRepeatDto.type"
              >
                <el-option
                  v-for="item of repeatOptions.checkCondition"
                  :value="item.value"
                  :key="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
              <p>则再通知1次</p>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="消息模板" prop="noticeTemplateId">
        <div class="form-flex form-flex-msg">
          <el-select
            class="form-option-input form-option-msg"
            placeholder="请选择消息模板"
            size="small"
            :disabled="reloadLoading || isWatch"
            v-model="ruleform.noticeTemplateId"
          >
            <template v-if="tempData">
              <el-option v-for="item of tempData" :value="item.id" :key="item.name" :label="item.name"></el-option>
            </template>
          </el-select>
          <template v-if="!isWatch">
            <refresh :loading="reloadLoading" @refresh="getNoticeTemplateList()" />
            <router-link
              class="el-link el-link--primary form-msg-manager"
              target="_blank"
              tag="a"
              :to="{ path: '/notice/template' }"
            >
              管理消息模板</router-link
            >
          </template>
        </div>
      </el-form-item>
      <el-form-item label="延迟推送时间">
        <div class="form-flex form-flex-msg">
          <span
            >{{ noiseNoticeTime }}
            <el-tooltip effect="dark" placement="top">
              <div slot="content">抖动事件延迟推送通知，可以在系统设置修改</div>
              <i class="point tips noise-tip el-icon-tip"></i> </el-tooltip
          ></span>

          <template v-if="!isWatch">
            <refresh class="noise-refresh" :loading="configReloadLoading" @refresh="getNoiseConfig()" />
            <router-link
              class="el-link el-link--primary form-msg-manager"
              target="_blank"
              tag="a"
              :to="{ path: '/system/config' }"
            >
              修改设置</router-link
            >
          </template>
        </div>
      </el-form-item>
    </el-form>
    <!-- 下方按钮 -->
    <div class="bottom" slot="footer">
      <template v-if="!isWatch">
        <el-button id="rule_button_cancel" size="small" @click="close">取 消</el-button>
        <el-button id="rule_button_submit" size="small" type="primary" :loading="loading" @click="onSubmit"
          >确定</el-button
        >
      </template>
      <el-button v-else id="rule_button_submit" size="small" type="primary" @click="close">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { cloneDeep } from 'lodash'
import { saveSubscriptions } from '@/apis/rule'
import { apiGetNoticeTemplateList } from '@/apis/notice'
import { apiGetCompanyConfig } from '@/apis/config'
import { apiSelectUser } from '@/apis/user'
import { mapGetters } from 'vuex'
import elTreeSelect from '@/components/common/treeSelect'
import DiyRuleContent from '@/components/common/diy-rule-content'
import DiySwitch from '@/components/common/diy-switch.vue'
import WebHook from './webhook.vue'
import Refresh from '@/components/common/refresh.vue'
export default {
  name: 'RuleEdit',
  components: { Refresh, elTreeSelect, DiyRuleContent, WebHook, DiySwitch },
  props: {
    form: {
      type: Object,
      default: () => {
        return {
          name: '',
          beTime: ['00:00', '23:59'],
          sendTypes: ['EMAIL'],
          qywxWebhooks: [
            {
              webhook: ''
            }
          ],
          relation: 'and',
          ownerType: 'USER',
          ownerIds: [],
          pagerdutyKey: '',
          pagerdutyUrl: '',
          contents: [
            {
              field: 'NAME',
              condition: 'in',
              value: ''
            }
          ]
        }
      }
    },
    UsersGroup: {
      type: Array,
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
    SourceOpt: {
      type: Array,
      default: () => []
    },
    sourceMap: {
      type: Map,
      default: () => []
    },
    visible: Boolean,
    // 是否只读
    isWatch: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['fieldOpt', 'conditionOpt', 'levelOpt', 'sendType'])
  },
  data() {
    const validataHook = (rule, value, callback) => {
      const webhook = value.map(item => {
        return item.webhook
      })
      const reg = new RegExp('^https://qyapi.weixin.qq.com.*$')
      webhook.forEach(item => {
        if (!item) {
          callback(new Error('webhook不可为空'))
          return
        }
        if (!reg.test(item)) {
          callback(new Error('webhook不符合要求'))
          return
        }
      })
      const webhookSet = Array.from(new Set(webhook))
      if (webhook.length != 1 && webhook.length !== webhookSet.length) {
        callback(new Error('webhook不可重复'))
        return
      }
      callback()
    }
    const validataContents = (rule, value, callback) => {
      value.forEach(item => {
        if (item.value === '' || item.value.length === 0) {
          callback(new Error())
          return
        }
      })
      callback()
    }
    return {
      ruleFormRules: {
        name: [{ required: true, message: '策略名称不能为空', trigger: 'blur' }],
        ownerIds: [{ required: true, message: '所属对象不能为空', trigger: 'change' }],
        noticeTemplateId: [{ required: true, message: '消息模板不能为空', trigger: 'change' }],
        qywxWebhooks: [{ required: true, validator: validataHook, trigger: 'change' }],
        pagerdutyKey: [{ required: true, message: 'Key不能为空', trigger: 'blur' }],
        pagerdutyUrl: [{ required: true, message: 'Url不能为空', trigger: 'blur' }],
        contents: [{ required: true, message: '规则内容不能为空', validator: validataContents, trigger: 'change' }]
      },
      ruleform: cloneDeep(this.form),
      repeatOptions: {
        // 重复发送选项
        noticeType: [
          {
            label: '首次告警后延迟',
            value: 'Delay_Mode'
          },
          {
            label: '每间隔',
            value: 'Interval_Mode'
          }
        ], // delay 首次通知后延迟, gap 每间隔
        gapMinutes: [
          {
            label: '5分钟',
            value: 5
          },
          {
            label: '10分钟',
            value: 10
          },
          {
            label: '20分钟',
            value: 20
          },
          {
            label: '30分钟',
            value: 30
          }
        ],
        checkCondition: [
          {
            label: '告警次数增加',
            value: 'Increase'
          },
          {
            label: '未关闭',
            value: 'Closure'
          }
        ] // 增加
      },
      tempData: null, // 消息模板数据
      loading: false,
      reloadLoading: false,
      configReloadLoading: false,
      editVisible: this.visible,
      noiseNoticeTime: '--', // 延迟推送时间
      users: this.UsersGroup
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    },
    form: {
      handler(val) {
        this.ruleform = cloneDeep(val)
      },
      deep: true
    }
  },
  created() {
    this.getNoticeTemplateList()
    this.getNoiseConfig()
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$refs.ruleform.resetFields()
    },
    // 判断owernerId是否为数组
    isArray() {
      return Array.isArray(this.ruleform.ownerIds)
    },
    async getNoticeTemplateList() {
      this.reloadLoading = true
      const { success, desc, data } = await apiGetNoticeTemplateList()
      this.reloadLoading = false
      if (success) {
        this.tempData = data
      } else {
        this.tempData = []
        desc && this.$message.error(desc)
      }
    },
    // 获取设置
    async getNoiseConfig() {
      this.configReloadLoading = true
      const { success, rows, desc } = await apiGetCompanyConfig('DelayedSending')
      this.configReloadLoading = false
      if (success) {
        if (rows.length) {
          const value = rows[0].value
          try {
            const { number, state = false } = JSON.parse(value) || {}
            this.noiseNoticeTime = state ? number + 's' : '--'
          } catch (error) {
            console.log('getNoiseConfig' + error)
          }
        }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 修改规则内容选项
    changeGroup(val) {
      this.$nextTick(() => {
        if (val === 'USER') {
          this.ruleform.ownerIds = []
        } else {
          this.ruleform.ownerIds = ''
        }
      })
    },
    // 获取规则设置表
    getForm() {
      let formValue = ''
      const {
        id,
        name,
        sendTypes,
        contents,
        relation,
        ownerType,
        ownerIds,
        beTime,
        qywxWebhooks,
        ruleRepeatDto,
        pagerdutyKey,
        pagerdutyUrl,
        noticeTemplateId
      } = this.ruleform
      let saveParam = {
        id,
        name,
        state: true,
        ruleRepeatDto,
        noticeTemplateId,
        sendTypes,
        ownerIds: Array.isArray(ownerIds) ? ownerIds : [ownerIds],
        summary: contents
          .map(item => {
            if (item.field !== 'MONITOR_CODE') {
              return (
                this.fieldOpt[item.field] +
                ' ' +
                this.conditionOpt[item.condition] +
                ' ' +
                (!!item.value ? item.value : '空')
              )
            } else {
              if (Array.isArray(item.value)) {
                formValue = item.value.map(i => {
                  return this.sourceMap.get(i)
                })
                return '监控源 包含 ' + (item.value !== '' ? formValue : '空')
              } else {
                return '监控源 包含 ' + item.value !== '' ? this.sourceMap.get(i) : '空'
              }
            }
          })
          .join(relation === 'and' ? ' 且 ' : ' 或 '),
        rules: JSON.stringify({
          relation: relation,
          contents: contents
        }),
        ownerType: ownerType
      }

      if (beTime && beTime.length === 2) {
        saveParam.beginTime = beTime[0]
        saveParam.endTime = beTime[1]
      }
      if (sendTypes.includes('QIYE_WEIXIN_GROUP')) {
        saveParam.qywxWebhooks = qywxWebhooks.map(item => item.webhook)
      }
      if (sendTypes.includes('PAGER_DUTY')) {
        saveParam.pagerdutyKey = pagerdutyKey
        saveParam.pagerdutyUrl = pagerdutyUrl
      }
      return saveParam
    },
    // 搜索用户
    async getUsers(text) {
      const { success, data, desc } = await apiSelectUser({
        search: text
      })
      if (success) {
        this.users = data
        return data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 提交设置规则
    async onSubmit() {
      this.$refs.ruleform.validate(async valid => {
        if (valid) {
          let { name } = this.ruleform
          if (name.replace(/\s*/g, '').length === 0) {
            this.$Message.error('请输入非空格维护期名称')
            return
          }
          this.loading = true
          const { success, desc } = await saveSubscriptions(this.getForm())
          this.loading = false
          if (success) {
            this.$Message.success(this.title + '成功，策略将在一分钟后生效')
            this.$emit('success')
            this.close()
          } else {
            desc && this.$Message.error(desc)
          }
        }
      })
    },
    // 判读是否展示所属对象
    showObj(e) {
      if (e.includes('EMAIL')) {
        return true
      }
      if (e.includes('SMS')) {
        return true
      }
      if (e.includes('QIYE_WEIXIN')) {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  &-option {
    &-input,
    &-time {
      width: 100%;
    }
    &-select {
      width: 120px;
    }
    &-group {
      flex: 1;
      margin-left: 10px;
    }
    &-msg {
      flex: 1;
      margin-right: 6px;
    }
  }
  &-flex {
    display: flex;
    align-items: flex-start;
    &-msg {
      justify-content: start;
    }
  }
  &-msg-manager {
    margin-left: 14px;
  }
  &-select {
    width: 100px;
    margin-right: 10px;
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
.point {
  cursor: pointer;
}
.tips {
  width: 14px;
  height: 14px;
  position: relative;
}
.template {
  &-wrap {
    padding: 24px 34px;
    background-color: #f9fafe;
    border: 1px solid #dddddd;
    border-radius: 2px;
  }
  &-content {
    display: flex;
    align-items: center;
    &-delay {
      width: 154px;
    }
    &-gap {
      margin-left: 10px;
      width: 90px;
    }
    &-condition {
      margin-left: 10px;
      width: 140px;
    }
    p {
      margin-left: 8px;
    }
  }
}
.custom-switch-extra {
  display: flex;
  align-items: center;
  height: 32px;
  margin-bottom: 14px;
}
.noise {
  &-tip {
    margin: 0 6px;
  }
}
</style>
