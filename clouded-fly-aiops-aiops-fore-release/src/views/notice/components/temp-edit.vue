<template>
  <el-dialog
    :width="'840px'"
    :visible.sync="editVisible"
    :title="title"
    class="temp-form-dialog"
    destroy-on-close
    :close-on-press-escape="false"
    @close="close"
  >
    <!-- 中间表格 -->
    <el-form
      class="form temp-form"
      ref="ruleForm"
      :model="ruleForm"
      label-width="110px"
      :rules="ruleFormRules"
      size="small"
      v-loading="tempLoading"
    >
      <!--名称 -->
      <el-form-item class="form-option" label="模块名称" prop="name">
        <el-input
          size="small"
          class="form-option-input"
          v-model.trim="ruleForm.name"
          :maxlength="100"
          :disabled="isPreview"
          placeholder="请输入"
        />
      </el-form-item>
      <!-- 所属对象 -->
      <el-form-item class="form-option" label="自定义字段">
        <div class="slot-label" slot="label">
          <span>自定义字段</span>
          <el-tooltip
            class="temp-form-tag--tip"
            effect="dark"
            content="可输入或点击增加自定义字段，自定义字段在发送通知内容时将被自动替换"
            placement="top"
          >
            <i class="point tips el-icon-tip"></i>
          </el-tooltip>
        </div>
        <div class="temp-form-tag--wrap">
          <div class="form-flex temp-form-tag--content">
            <template v-if="fields && fields[0]">
              <div v-for="tag of fields" :key="tag.id" class="temp-form-tag--field">
                <div class="temp-form-tag" @mousedown="tagClick($event, tag.name)">
                  <span class="temp-form-tag--label">{{ tag.name }}</span>
                  <el-tooltip
                    class="temp-form-tag--tip"
                    v-if="tagToolTipContentMap[tag.name]"
                    effect="dark"
                    :content="tagToolTipContentMap[tag.name]"
                    placement="top"
                  >
                    <i class="point tips el-icon-tip"></i>
                  </el-tooltip>
                </div>
              </div>
            </template>
          </div>
        </div>
      </el-form-item>
      <!-- 模板切换 -->
      <el-form-item class="form-option temp-notice-module" label="消息模块">
        <el-radio-group text-color="#0076ff" v-model="templateShow">
          <el-radio-button label="email">邮件</el-radio-button>
          <el-radio-button label="robot">企微机器人</el-radio-button>
          <el-radio-button label="wechat">企业微信</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- 邮件格式 -->
      <el-form-item v-show="templateShow === 'email'" class="form-option" prop="emailType">
        <div class="slot-label" slot="label">
          <span>邮件格式</span>
          <el-tooltip
            class="temp-form-tag--tip"
            effect="dark"
            content="标准格式邮件更美观，极简格式邮件占用空间更小。"
            placement="top"
          >
            <i class="point tips el-icon-tip"></i>
          </el-tooltip>
        </div>
        <el-radio-group v-model="ruleForm.emailType" :disabled="isPreview">
          <el-radio :label="0">标准（富文本）</el-radio>
          <el-radio :label="1">极简（纯文本）</el-radio>
        </el-radio-group>
      </el-form-item>
      <p class="temp-form-desc">{XXXX}代表自定义字段，在发送通知内容时将被自动替换</p>
      <!-- 邮件模板 -->
      <div v-show="templateShow === 'email'">
        <el-form-item class="form-option" label="首次通知标题" prop="emailTitle">
          <el-input
            size="small"
            class="form-option-input"
            v-model.trim="ruleForm.emailTitle"
            :disabled="isPreview"
            :maxlength="100"
            placeholder="请输入"
            ref="emailTitle"
            @focus="handleInputFocus('emailTitle')"
            @blur="handleBlur"
          />
        </el-form-item>

        <el-form-item class="form-option temp-form-notice" label="首次通知内容" prop="emailContent">
          <el-input
            v-model="ruleForm.emailContent"
            type="textarea"
            class="form-option-input"
            :disabled="isPreview"
            :autosize="{ minRows: 7, maxRows: 7 }"
            :maxlength="500"
            placeholder="请输入内容"
            ref="emailContent"
            @focus="handleInputFocus('emailContent')"
            @blur="handleBlur"
          >
          </el-input>
        </el-form-item>
        <div class="temp-form-preview temp-form-preview--first">
          <el-button type="text" @click="previewTemp('email')">首次通知预览</el-button>
        </div>
        <el-form-item class="form-option" label="重复通知标题" prop="emailRepeatTitle">
          <el-input
            size="small"
            class="form-option-input"
            :disabled="isPreview"
            v-model.trim="ruleForm.emailRepeatTitle"
            :maxlength="100"
            placeholder="请输入"
            ref="emailRepeatTitle"
            @focus="handleInputFocus('emailRepeatTitle')"
            @blur="handleBlur"
          />
        </el-form-item>
        <el-form-item class="form-option temp-form-notice" label="重复通知内容" prop="emailRepeatContent">
          <el-input
            v-model="ruleForm.emailRepeatContent"
            type="textarea"
            class="form-option-input"
            :disabled="isPreview"
            :autosize="{ minRows: 7, maxRows: 7 }"
            :maxlength="500"
            placeholder="请输入内容"
            ref="emailRepeatContent"
            @focus="handleInputFocus('emailRepeatContent')"
            @blur="handleBlur"
          >
          </el-input>
        </el-form-item>
        <div class="temp-form-preview">
          <el-button type="text" @click="previewTemp('email-repeat')">重复通知预览</el-button>
        </div>
      </div>
      <!-- 企微机器人模板 -->
      <div v-show="templateShow === 'robot'">
        <el-form-item class="form-option" label="首次通知标题" prop="robotTitle">
          <el-input
            size="small"
            class="form-option-input"
            v-model.trim="ruleForm.robotTitle"
            :disabled="isPreview"
            :maxlength="100"
            placeholder="请输入"
            ref="robotTitle"
            @focus="handleInputFocus('robotTitle')"
            @blur="handleBlur"
          />
        </el-form-item>
        <el-form-item class="form-option temp-form-notice" label="首次通知内容" prop="robotContent">
          <el-input
            v-model="ruleForm.robotContent"
            type="textarea"
            class="form-option-input"
            :autosize="{ minRows: 7, maxRows: 7 }"
            :disabled="isPreview"
            :maxlength="500"
            placeholder="请输入内容"
            ref="robotContent"
            @focus="handleInputFocus('robotContent')"
            @blur="handleBlur"
          >
          </el-input>
        </el-form-item>
        <div class="temp-form-preview temp-form-preview--first">
          <el-button type="text" @click="previewTemp('robot')">首次通知预览</el-button>
        </div>
        <el-form-item class="form-option" label="重复通知标题" prop="robotRepeatTitle">
          <el-input
            size="small"
            class="form-option-input"
            v-model.trim="ruleForm.robotRepeatTitle"
            :disabled="isPreview"
            :maxlength="100"
            placeholder="请输入"
            ref="robotRepeatTitle"
            @focus="handleInputFocus('robotRepeatTitle')"
            @blur="handleBlur"
          />
        </el-form-item>
        <el-form-item class="form-option temp-form-notice" label="重复通知内容" prop="robotRepeatContent">
          <el-input
            v-model="ruleForm.robotRepeatContent"
            type="textarea"
            class="form-option-input"
            :autosize="{ minRows: 7, maxRows: 7 }"
            :disabled="isPreview"
            :maxlength="500"
            placeholder="请输入内容"
            ref="robotRepeatContent"
            @focus="handleInputFocus('robotRepeatContent')"
            @blur="handleBlur"
          >
          </el-input>
        </el-form-item>
        <div class="temp-form-preview">
          <el-button type="text" @click="previewTemp('robot-repeat')">重复通知预览</el-button>
        </div>
      </div>
      <div v-show="templateShow === 'wechat'">
        <el-form-item class="form-option" label="首次通知标题" prop="workWXTitle">
          <el-input
            size="small"
            class="form-option-input"
            v-model.trim="ruleForm.workWXTitle"
            :disabled="isPreview"
            :maxlength="100"
            placeholder="请输入"
            ref="workWXTitle"
            @focus="handleInputFocus('workWXTitle')"
            @blur="handleBlur"
          />
        </el-form-item>
        <el-form-item class="form-option temp-form-notice" label="首次通知内容" prop="workWXContent">
          <el-input
            v-model="ruleForm.workWXContent"
            type="textarea"
            class="form-option-input"
            :autosize="{ minRows: 7, maxRows: 7 }"
            :disabled="isPreview"
            :maxlength="500"
            placeholder="请输入内容"
            ref="workWXContent"
            @focus="handleInputFocus('workWXContent')"
            @blur="handleBlur"
          >
          </el-input>
        </el-form-item>
        <div class="temp-form-preview temp-form-preview--first">
          <el-button type="text" @click="previewTemp('workWx')">首次通知预览</el-button>
        </div>
        <el-form-item class="form-option" label="重复通知标题" prop="workWXRepeatTitle">
          <el-input
            size="small"
            class="form-option-input"
            v-model.trim="ruleForm.workWXRepeatTitle"
            :disabled="isPreview"
            :maxlength="100"
            placeholder="请输入"
            ref="workWXRepeatTitle"
            @focus="handleInputFocus('workWXRepeatTitle')"
            @blur="handleBlur"
          />
        </el-form-item>
        <el-form-item class="form-option temp-form-notice" label="重复通知内容" prop="workWXRepeatContent">
          <el-input
            v-model="ruleForm.workWXRepeatContent"
            type="textarea"
            class="form-option-input"
            :autosize="{ minRows: 7, maxRows: 7 }"
            :disabled="isPreview"
            :maxlength="500"
            placeholder="请输入内容"
            ref="workWXRepeatContent"
            @focus="handleInputFocus('workWXRepeatContent')"
            @blur="handleBlur"
          >
          </el-input>
        </el-form-item>
        <div class="temp-form-preview">
          <el-button type="text" @click="previewTemp('workWx-repeat')">重复通知预览</el-button>
        </div>
      </div>
    </el-form>
    <!-- 下方按钮 -->
    <div class="bottom" slot="footer">
      <el-button v-if="isPreview" id="rule_button_cancel" size="small" type="primary" @click="close">确 定</el-button>
      <template v-else>
        <el-button id="rule_button_cancel" size="small" @click="close">取 消</el-button>
        <el-button id="rule_button_submit" size="small" type="primary" :loading="loading" @click="onSubmit"
          >确定</el-button
        >
      </template>
    </div>
    <!-- 预览弹窗 -->
    <temp-preview-Dialog :type="currentPreviewType" :visible.sync="isShowPreview" :form="ruleForm" />
  </el-dialog>
</template>
<script>
import { apiEditNoticeTemplate, apiGetNoticeTemplateDetail } from '@/apis/notice'
import TempPreviewDialog from './temp-preview-dialog'
export default {
  name: 'TempEdit',
  components: { TempPreviewDialog },
  props: {
    record: {
      type: Object,
      default: () => null
    },
    fields: {
      type: Array,
      default: () => null
    },
    isPreview: Boolean, // 是否只查看
    defalutTemp: {
      type: Array,
      default: () => null
    },
    visible: Boolean
  },
  computed: {
    title() {
      let title = '新增'
      if (this.record?.id) {
        title = this.isPreview ? '详情' : '编辑'
      }
      return title + '消息模板'
    }
  },
  data() {
    return {
      ruleFormRules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        emailTitle: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        emailRepeatTitle: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        robotTitle: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        robotRepeatTitle: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        workWXTitle: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        workWXRepeatTitle: [{ required: true, message: '标题不能为空', trigger: 'change' }],
        emailContent: [{ required: true, message: '内容不能为空', trigger: 'change' }],
        emailRepeatContent: [{ required: true, message: '内容不能为空', trigger: 'change' }],
        robotContent: [{ required: true, message: '内容不能为空', trigger: 'change' }],
        robotRepeatContent: [{ required: true, message: '内容不能为空', trigger: 'change' }],
        workWXContent: [{ required: true, message: '内容不能为空', trigger: 'change' }],
        workWXRepeatContent: [{ required: true, message: '内容不能为空', trigger: 'change' }]
      },
      ruleForm: {
        name: '',
        emailTitle: '',
        emailType: 0,
        emailRepeatTitle: '',
        emailContent: '',
        emailRepeatContent: '',
        robotTitle: '',
        robotRepeatTitle: '',
        robotContent: '',
        robotRepeatContent: '',
        workWXTitle: '',
        workWXRepeatTitle: '',
        workWXContent: '',
        workWXRepeatContent: ''
      },
      templateShow: 'email', // 消息模块
      tagToolTipContentMap: {
        首要降噪条件: '展示事件被降噪压缩在一块的首要原因',
        降噪主机IP: '展示所有被降噪压缩事件的主机IP'
      },
      repeatOptions: {
        // 重复发送选项
        noticeType: [
          {
            label: '首次通知后延迟',
            value: 'delay'
          },
          {
            label: '每间隔',
            value: 'gap'
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
            label: '事件未关闭',
            value: 'noclose'
          }
        ] // 增加
      },
      currentPreviewType: 'email',
      currentFocusRef: null,
      tempData: null, // 消息模板数据
      loading: false,
      tempLoading: false,
      isShowPreview: false,
      editVisible: this.visible
    }
  },
  watch: {
    visible(val) {
      this.editVisible = val
    },
    defalutTemp: {
      handler(val) {
        if (!this.record) {
          this.tempLoading = !val
          if (val) {
            const form = { ...this.ruleForm }
            val.forEach(temp => {
              const { type, repeatTitle, title, messageContent, repeatMessageContent } = temp
              switch (type) {
                // 邮件
                case 'EMAIL':
                  form.emailTitle = title
                  form.emailRepeatTitle = repeatTitle
                  form.emailContent = messageContent
                  form.emailRepeatContent = repeatMessageContent
                  break
                // 企业微信机器人
                case 'QIYE_WEIXIN_GROUP':
                  form.robotTitle = title
                  form.robotRepeatTitle = repeatTitle
                  form.robotContent = messageContent
                  form.robotRepeatContent = repeatMessageContent
                  break
                // 企业微信应用信息
                case 'QIYE_WEIXIN':
                  form.workWXTitle = title
                  form.workWXRepeatTitle = repeatTitle
                  form.workWXContent = messageContent
                  form.workWXRepeatContent = repeatMessageContent
                  break
                default:
                  break
              }
            })
            this.ruleForm = form
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.record && this.getDetailById()
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
      this.$refs.ruleForm.resetFields()
    },
    /**
     * 给聚焦的input添加自定义标签
     * @param {event} event mousedown
     * @param {string} tag 点击的标签
     */
    tagClick(event, tag) {
      const tagName = `{${tag}}`
      const filed = this.currentFocusRef
      event.preventDefault()
      const elDom = this.$refs[filed]?.$el
      if (elDom) {
        const el = elDom.querySelector('.el-textarea__inner,.el-input__inner')
        if (!el) return

        const startPos = el.selectionStart
        const endPos = el.selectionEnd
        const inputValue = el.value
        const result = inputValue.substring(0, startPos) + tagName + inputValue.substring(endPos)
        el.value = result
        elDom.focus()
        el.selectionStart = startPos + tagName.length
        el.selectionEnd = startPos + tagName.length
        this.ruleForm[filed] = result
      }
    },
    // 记录当前聚焦input的ref值
    handleInputFocus(filed) {
      this.currentFocusRef = filed
    },
    handleBlur() {
      this.currentFocusRef = null
    },
    // 判断owernerId是否为数组
    isArray() {
      return Array.isArray(this.ruleForm.ownerIds)
    },
    // 获取规则设置表
    getForm() {
      const {
        name,
        emailType,
        emailTitle,
        emailRepeatTitle,
        emailContent,
        emailRepeatContent,
        robotTitle,
        robotRepeatTitle,
        robotContent,
        robotRepeatContent,
        workWXTitle,
        workWXRepeatTitle,
        workWXContent,
        workWXRepeatContent
      } = this.ruleForm
      const paramForm = {
        id: this.record?.id,
        name,
        emailType,
        templateInfoDtoList: [
          {
            messageContent: emailContent,
            repeatMessageContent: emailRepeatContent,
            repeatTitle: emailRepeatTitle,
            title: emailTitle,
            type: 'EMAIL'
          },
          {
            messageContent: robotContent,
            repeatMessageContent: robotRepeatContent,
            repeatTitle: robotRepeatTitle,
            title: robotTitle,
            type: 'QIYE_WEIXIN_GROUP'
          },
          {
            messageContent: workWXContent,
            repeatMessageContent: workWXRepeatContent,
            repeatTitle: workWXRepeatTitle,
            title: workWXTitle,
            type: 'QIYE_WEIXIN'
          }
        ]
      }
      return paramForm
    },
    // 搜索用户
    async getDetailById() {
      const id = this.record?.id
      if (id) {
        this.tempLoading = true
        const { success, data, desc } = await apiGetNoticeTemplateDetail(id)
        this.tempLoading = false
        if (success) {
          this.tempData2form(data)
        } else {
          desc && this.$Message.error(desc)
        }
      }
    },
    /**
     * 将模板数据转换成form
     * @param {Object} temp 模板数据
     */
    tempData2form(temp) {
      const { templateInfoDtoList, name, emailType } = temp
      this.ruleForm = templateInfoDtoList.reduce(
        (form, item) => {
          const { messageContent, repeatMessageContent, repeatTitle, title, type } = item
          switch (type) {
            case 'EMAIL':
              form.emailTitle = title
              form.emailRepeatTitle = repeatTitle
              form.emailContent = messageContent
              form.emailRepeatContent = repeatMessageContent
              break
            case 'QIYE_WEIXIN_GROUP':
              form.robotTitle = title
              form.robotRepeatTitle = repeatTitle
              form.robotContent = messageContent
              form.robotRepeatContent = repeatMessageContent
              break
            case 'QIYE_WEIXIN':
              form.workWXTitle = title
              form.workWXRepeatTitle = repeatTitle
              form.workWXContent = messageContent
              form.workWXRepeatContent = repeatMessageContent
              break
          }
          return form
        },
        { name, emailType }
      )
    },
    // 模板预览
    previewTemp(type) {
      this.currentPreviewType = type
      this.isShowPreview = true
    },
    // 提交模板设置
    async onSubmit() {
      // 新增时，对name=默认模板特殊处理，后端没有对默认模板字段判断，导致可以新增默认模板，
      if (!this.record?.id && this.ruleForm.name === '默认模板') {
        this.$Message.error('模板名称重复，请您修改模板名称')
        return false
      }
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.loading = true
          const { success, desc } = await apiEditNoticeTemplate(this.getForm())
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
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  &-option {
    &::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: transparent;
    }
  }
  &-flex {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  &::v-deep .el-radio-group {
    margin: auto 0;
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
.point {
  cursor: pointer;
}
.tips {
  width: 14px;
  height: 14px;
  position: relative;
}
.temp {
  &-form {
    &-tag {
      display: flex;
      align-items: center;
      height: 24px;
      padding: 0 8px;
      line-height: normal;
      font-size: 12px;
      color: #333;
      background: #f7f7f7;
      border: 1px solid #d8d8d8;
      border-radius: 2px;
      cursor: pointer;
      &--field {
        display: flex;
        align-items: center;
        padding: 0 4px;
        margin: 6px 0;
      }
      &--wrap {
        margin-left: -4px;
        margin-right: -4px;
        overflow: hidden;
      }
      &--content {
        margin: -1px 0 -6px;
      }
      &--tip {
        margin-left: 6px;
      }
    }
    &-desc {
      margin-bottom: 8px;
      padding-left: 110px;
      font-size: 12px;
      color: #999;
      line-height: 12px;
    }
    &-preview {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 32px;
      &--first {
        margin-bottom: 15px;
      }
    }
    &-notice {
      margin-bottom: 0 !important;
    }
  }
}
.temp-notice-module {
  margin-bottom: 16px !important;
}
.slot-label {
  color: #666;
  text-align: right;
}
.temp-form-dialog {
  &::v-deep .el-dialog--center .el-dialog__body,
  &::v-deep .el-dialog__body {
    padding: 24px 32px;
  }
}
</style>
