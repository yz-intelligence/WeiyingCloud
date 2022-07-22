<template>
  <div class="page-container">
    <c-breadcrumb :menu="menu" />
    <div class="page">
      <div class="page-content">
        <!-- 用户信息 -->
        <el-form class="form" ref="form" :rules="formRules" :model="form">
          <el-form-item
            class="form-item"
            :label="item.key + '：'"
            v-for="(item, index) in userMessage"
            :key="index"
            label-width="100px"
            :prop="item.prop"
            id="mine_form_message"
          >
            <!-- 修改密码 -->
            <span v-if="index === 4" class="form-item-value">
              <span class="blue" @click="showChange">{{ item.value }}</span>
            </span>
            <!-- 邮箱 -->
            <span v-else-if="index === 2" class="form-item-value">
              <span>{{ item.value }}</span>
              <i class="el-icon-edit-outline blue" title="修改" @click="showEmailChange"></i>
            </span>
            <!-- 其他编辑状态 -->
            <div v-else-if="item.edit" class="form-item-input">
              <el-input class="input" size="small" v-model.trim="item.value" :placeholder="item.value"></el-input>
              <el-button class="form-item-input-submit" type="primary" @click="submitData(index)">确定</el-button>
              <el-button class="form-item-input-cancle" type="text" @click="cancel(index)">取消</el-button>
            </div>
            <!-- 其他未编辑状态 -->
            <span v-else class="form-item-value">
              <span>{{ item.value || '无' }}</span>
              <i class="el-icon-edit-outline blue" title="修改" @click="changeEdit(index)"></i>
            </span>
          </el-form-item>
        </el-form>
        <!-- 修改密码弹窗 -->
        <el-dialog
          :visible.sync="isShow"
          title="修改密码"
          :width="'460px'"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          :close="closeChange"
        >
          <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules">
            <el-form-item prop="password">
              <el-input
                v-model.trim="passwordForm.password"
                placeholder="当前密码"
                :maxlength="100"
                type="password"
                size="small"
                autocomplete="new-password"
              />
            </el-form-item>

            <el-form-item prop="newPassword">
              <el-input
                v-model.trim="passwordForm.newPassword"
                placeholder="新的密码"
                :maxlength="100"
                type="password"
                size="small"
                autocomplete="new-password"
              />
            </el-form-item>

            <el-form-item prop="passwordCheck">
              <el-input
                v-model.trim="passwordForm.passwordCheck"
                placeholder="确认密码"
                :maxlength="100"
                type="password"
                size="small"
                autocomplete="new-password"
              />
            </el-form-item>
          </el-form>

          <div class="submit" slot="footer">
            <el-button size="small" @click="closeChange">取 消</el-button>
            <el-button size="small" type="primary" :loading="resetPasswordLoading" @click="submitPassWord">
              确定
            </el-button>
          </div>
        </el-dialog>
        <!-- 修改邮箱弹窗 -->
        <email-edit
          v-if="isEmailShow"
          :visible.sync="isEmailShow"
          @close="getuserMessage"
          @success="getuserMessage"
          :email="userMessage[2].value"
        ></email-edit>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { apiUpdateUser, apiModifyPassword } from '@/apis/user'
import { passwordValidate } from '@/utils/formValidate'
import EmailEdit from './components/email-edit.vue'
export default {
  name: 'PageMine',
  components: {
    EmailEdit
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      let data = this.userMessage[1].value
      if (!data) {
        this.userMessage[1].error = true
        callback(new Error('请输入手机号码'))
      } else if (!/^1[345789]\d{9}$/.test(data)) {
        this.userMessage[1].error = true
        callback(new Error('手机号码格式不正确!'))
      } else {
        this.userMessage[1].error = false
        callback()
      }
    }
    const validateName = (rule, value, callback) => {
      let data = this.userMessage[0].value
      if (!data) {
        this.userMessage[0].error = true
        callback(new Error('请输入用户名'))
      } else {
        this.userMessage[0].error = false
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入原密码'))
      } else {
        callback()
      }
    }
    const validateWX = (rule, value, callback) => {
      let data = this.userMessage[3].value
      if (!data) {
        this.userMessage[3].error = true
        callback(new Error('企业微信不能为空'))
      } else {
        this.userMessage[3].error = false
        callback()
      }
    }
    const newvalidatePass = (rule, value, callback) => {
      const { password, passwordCheck } = this.passwordForm
      if (!value) {
        callback(new Error('请输入密码'))
        return false
      }
      if (!passwordValidate(value)) {
        callback(new Error('密码必须含有大、小写字母、数字、特殊符号中的任意三种'))
        return false
      }
      if (value === password) {
        callback(new Error('新密码不能与原密码相同'))
        return false
      }
      if (passwordCheck) {
        // 对第二个密码框单独验证
        this.$refs.passwordForm.validateField('passwordCheck')
      }
      callback()
    }
    const checkevalidatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    return {
      menu: [{ name: '个人中心' }],
      resetPasswordLoading: false, // 重置密码按钮loading
      form: {
        nickname: '',
        phone: '',
        email: '',
        qiyeWeixin: ''
      },
      // 修改密码弹窗信息
      passwordForm: {
        password: '',
        newPassword: '',
        passwordCheck: ''
      },
      // 用户信息
      userMessage: [
        {
          key: '姓名',
          value: '管理员',
          edit: false,
          prop: 'nickname',
          error: false
        },
        {
          key: '手机号',
          value: '管理员',
          edit: false,
          prop: 'phone',
          error: false
        },
        {
          key: '邮箱',
          value: '管理员',
          edit: false,
          prop: 'email',
          error: false
        },
        {
          key: '企业微信',
          value: '管理员',
          edit: false,
          prop: 'qiyeWeixin',
          error: false
        },
        {
          key: '账号密码',
          value: '修改密码',
          edit: false
        }
      ],
      // 表格红字规则
      formRules: {
        phone: [{ required: true, validator: validatePhone, trigger: ['blur', 'change'] }],
        nickname: [{ required: true, validator: validateName, trigger: 'blur' }],
        email: [{ required: true, trigger: 'blur' }],
        qiyeWeixin: [{ required: true, validator: validateWX, trigger: 'blur' }]
      },
      // 修改密码弹窗红字规则
      passwordRules: {
        password: [{ validator: validatePass, trigger: 'blur' }],
        newPassword: [
          {
            type: 'string',
            min: 8,
            max: 18,
            message: '密码长度必须为8-18位',
            trigger: 'blur'
          },
          { validator: newvalidatePass, trigger: 'blur' }
        ],
        passwordCheck: [{ validator: checkevalidatePass, trigger: 'blur' }]
      },
      error: false,
      isShow: false,
      isEmailShow: false
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    changeEdit(index) {
      this.$refs.form.clearValidate()
      this.getuserMessage()
      const { userMessage } = this
      this.userMessage = userMessage.map((item, i) => {
        return {
          ...item,
          edit: i === index
        }
      })
    },
    cancel(index) {
      const { prop } = this.userMessage[index]
      this.userMessage[index].edit = false
      this.userMessage[index].value = this.user[prop]
    },
    showEmailChange() {
      this.isEmailShow = true
    },
    async getuserMessage() {
      //从数据库获取info，避免用户组中修改个人中心没有更新的问题
      const { data, success, desc } = await this.$store.dispatch('user/getUserInfo')
      if (success) {
        const { nickname, phone, email, qiyeWeixin } = { ...data }
        this.userMessage[0].value = nickname
        this.userMessage[1].value = phone
        this.userMessage[2].value = email
        this.userMessage[3].value = qiyeWeixin
      } else {
        desc && this.$Message.error(desc)
      }
      // const { nickname, phone, email, qiyeWeixin } = this.user
    },
    async submitData(index) {
      if (!this.userMessage[index].error) {
        let userModel = { ...this.user }
        userModel[this.userMessage[index].prop] = this.userMessage[index].value
        for (let item in userModel) {
          if (!userModel[item]) {
            userModel[item] = ''
          }
        }
        const { success, data, desc } = await apiUpdateUser(userModel)
        if (success) {
          this.userMessage[index].edit = !this.userMessage[index].edit
          this.$Message.success('保存成功')
          this.getuserMessage()
        } else {
          desc && this.$Message.error(desc)
        }
      }
    },
    showChange() {
      this.isShow = true
      this.passwordForm = {
        password: '',
        newPassword: '',
        passwordCheck: ''
      }
    },
    closeChange() {
      this.isShow = false
    },
    async submitPassWord() {
      this.$refs.passwordForm.validate(async valid => {
        if (valid) {
          this.resetPasswordLoading = true
          const { success, desc } = await apiModifyPassword(this.passwordForm)
          this.resetPasswordLoading = false
          if (success) {
            this.$Message.success('密码修改成功，请重新登录')
            this.isShow = false
            setTimeout(() => {
              this.$store.dispatch('user/logout')
            }, 300)
          } else {
            desc && this.$Message.error(desc)
          }
        }
      })
    }
  },
  created() {
    this.getuserMessage()
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  color: #333;
  font-size: 14px;
  &-item {
    margin: 5px 0;
    width: 100%;
    height: 35px;
    &-value {
      cursor: pointer;
    }
    &-input {
      width: 400px;
      height: 100%;
      display: flex;
      flex-direction: row;
      white-space: nowrap;
      &-submit {
        margin: 5px 15px 0;
        height: 30px;
        line-height: 2;
        justify-content: center;
        color: #fff;
        background-color: #0076ff;
        border-color: #0076ff;
        padding: 0 5px;
        border-radius: 5px;
        &:hover {
          opacity: 0.8;
        }
        &:active {
          opacity: 1;
        }
      }
      &-cancle {
        height: 100%;
        cursor: pointer;
      }
    }
  }
}
.submit {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  &-cancle {
    margin: 0 10px;
  }
}
::v-deep .el-input__inner {
  color: #333;
}
.blue {
  color: #0076ff;
  transform: translate(50%, 3%);
}
</style>
