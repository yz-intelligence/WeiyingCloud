<template>
  <div class="page-container">
    <!-- 详情页自定义面包屑导航 -->
    <div class="breadcrumb">
      <el-breadcrumb class="breadcrumb-centent" separator="/">
        <el-breadcrumb-item>监控源管理</el-breadcrumb-item>
        <el-breadcrumb-item>监控源接入</el-breadcrumb-item>
        <el-breadcrumb-item>监控源详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="page accessdetail-page">
      <el-container>
        <!-- 左侧配置信息栏 -->
        <el-main class="page-left">
          <div class="page-header">
            <p>接入{{ tool.title }}</p>
            <router-link to="/monitor/access">
              <el-button type="text">返回已接入</el-button>
            </router-link>
          </div>
          <el-divider></el-divider>
          <!-- 新增接口表单 -->
          <el-form
            v-if="showForm"
            ref="form"
            :model="formItem"
            :rules="rules"
            label-width="80px"
            class="form"
            @submit.native.prevent
          >
            <el-form-item label="名称" prop="name">
              <el-input v-model.trim="formItem.name" size="small" @keyup.enter.native="save"></el-input>
            </el-form-item>
            <el-button v-if="tool.type === 'zabbix'" :loading="btnLoading" @click="save" type="primary" size="small">
              <span v-if="!btnLoading">确定</span>
              <span v-else>Loading...</span>
            </el-button>
            <el-button v-else :loading="btnLoading" @click="save" type="primary" size="small">
              <span v-if="!btnLoading">确定并生成WebHook</span>
              <span v-else>Loading...</span>
            </el-button>
          </el-form>
          <!-- 配置详情 -->
          <div v-if="!showForm">
            <access-detail-main :webHook="webHook" :type="webHookType" :lohref="lohref"></access-detail-main>
          </div>
        </el-main>

        <!-- 右侧边信息栏 -->
        <el-aside width="500px" class="page-right">
          <access-detail-aside :accessType="webHookType"></access-detail-aside>
        </el-aside>
      </el-container>
    </div>
  </div>
</template>
<script>
import { apiSaveAccess, apiCheckAccess } from '@/apis/access'
import AccessDetailMain from './components/accessdetailmain'
import AccessDetailAside from './components/accessdetailaside'
export default {
  name: 'MonitorAccessdetail',
  components: { AccessDetailMain, AccessDetailAside },
  data() {
    return {
      tool: { type: '' },
      showForm: true,
      btnLoading: false,
      webHook: '',
      lohref: '',
      formItem: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    webHookType() {
      const hackTypes = {
        tencentcloudprometheus: 'tencentcloud'
      }
      const type = hackTypes[this.tool.type]
      return type || this.tool.type
    }
  },
  created() {
    //URL无参数时跳转回监控源接入界面
    const { type, title, subPath, webHook } = { ...this.$route.query }
    if (!type) {
      this.$Message.warning('请选择接入源')
      this.$router.push('access')
    }
    this.tool.title = title
    this.tool.type = type
    // 判断是新增跳转还是详情跳转
    const hostRex = /^((?:[A-Za-z]+:)?\/{0,3}[0-9.\-A-Za-z]+(?::\d+)?)(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
    if (webHook) {
      this.showForm = false
      this.webHook = webHook
      this.lohref = hostRex.exec(location.href)[1]
    } else {
      const user = this.$store.getters.user
      this.webHook = hostRex.exec(location.href)[1] + subPath + user.companyId + '/'
      this.lohref = hostRex.exec(location.href)[1]
    }
  },
  methods: {
    //新增监控源名称
    save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.btnLoading = true
          //新增监控源名称查重
          const { success, desc, data } = await apiCheckAccess({ name: this.formItem.name.trim() })
          if (success) {
            if (data) {
              this.$Message.error('监控源名称重复，请重新输入')
              this.btnLoading = false
            } else {
              //新增监控源名保存
              const { success, desc, data } = await apiSaveAccess({
                name: this.formItem.name,
                type: this.tool.type,
                conf: JSON.stringify({ webHook: this.webHook })
              })
              this.btnLoading = false
              if (success) {
                this.$Message.success('保存成功')
                this.webHook = this.webHook + data.id
                this.showForm = false
              } else {
                desc && this.$Message.error(desc)
              }
            }
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
.accessdetail-page {
  padding: 0;
  .page-left {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 0 24px;
    height: calc(100vh - 150px);
    .page-header {
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      position: relative;
      p {
        font-weight: bold;
        position: absolute;
        left: 10px;
      }
    }
    .el-divider {
      margin: 0;
    }
  }
  .page-right {
    border-left: 20px solid #f4f6fa;
    padding: 10px 24px;
  }
}
.form {
  padding: 10px;
  .el-button {
    display: block;
    margin: auto;
  }
}
.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 24px;
  width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 0 0 #ddd;
  z-index: 1;
  &::v-deep .el-breadcrumb__item {
    .el-breadcrumb__inner {
      color: #999999;
      font-size: 16px;
    }
    &:last-of-type {
      .el-breadcrumb__inner {
        color: #333;
        // font-weight: 700;
        // &:hover {
        //   cursor: pointer;
        //   color: #0076ff;
        // }
      }
    }
  }
}
</style>
