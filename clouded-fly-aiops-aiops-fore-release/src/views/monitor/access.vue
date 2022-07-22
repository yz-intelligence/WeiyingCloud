<template>
  <div class="page-container">
    <c-breadcrumb />
    <div class="page">
      <div class="page-header access-header">
        <div class="divider-header">
          <span>可接入监控源</span>
          <el-button
            v-permission="'MonitoringSource-test'"
            id="introTestBtn"
            :loading="testLoading"
            ref="introTestBtn"
            type="primary"
            size="small"
            @click="testTool"
          >
            {{ testLoading ? '接入中' : '&nbsp;测试接入' }}</el-button
          >
        </div>
        <el-divider></el-divider>
        <!-- 接入源卡片列表 -->
        <access-card-list @selectType="selectType" @sendAccessList="sendAccessList"></access-card-list>
      </div>
    </div>
    <div class="page">
      <div class="access-header">
        <div class="divider-header">
          <span>已接入监控源</span>
          <el-button type="primary" size="small" @click="resetData">全部</el-button>
        </div>
        <el-divider></el-divider>
        <div class="page-table" v-loading="loading">
          <el-table ref="table" :data="table.rows" class="userlist">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column width="200" prop="name" label="监控源名称"></el-table-column>
            <el-table-column prop="conf" label="webhook">
              <template slot-scope="scope">
                {{ webHookFormtter(scope.row) }}
                <span @click="copy(scope.row)" style="color: #0076ff" title="复制链接">
                  <i class="pointer el-icon-copy-document"></i>
                </span>

                <!-- <img
                  @click="copy(scope.row)"
                  class="pointer"
                  src="../../assets/images/access/copy.png"
                  title="复制链接"
                />-->
              </template>
            </el-table-column>
            <el-table-column width="150" prop="type" label="降噪方式">
              <template slot-scope="scope">
                <!-- <div class="access-table-textinswitch" v-if="scope.row.status">开</div> -->
                <div
                  v-for="item in scope.row.denoiseRules"
                  :key="item.index"
                  class="table-button-denoise"
                  title="查看降噪规则详情"
                  @click="showNoiseDialog(item.id)"
                >
                  {{ item.ruleName }}
                </div>
              </template>
            </el-table-column>
            <el-table-column width="180" prop="createTime" label="接入时间"></el-table-column>
            <el-table-column width="150" prop="type" label="类型"></el-table-column>
            <el-table-column label="状态" width="100">
              <template slot-scope="scope">
                <diy-switch
                  :disabled="!$hasPermission('MonitoringSource-status')"
                  :state.sync="scope.row.state"
                  :row="scope.row"
                  @change="statusChange"
                />
              </template>
            </el-table-column>
            <el-table-column width="180" label="操作">
              <template slot-scope="scope">
                <table-actions :scope="scope" :actions="actions" @click="actionClick"></table-actions>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            ref="pagination"
            class="page-table-pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="search.page"
            :page-sizes="pageSizes"
            :page-size="search.limit"
            layout="total, prev, pager, next, sizes"
            :total="table.total"
          ></el-pagination>
        </div>
      </div>
      <!-- 监控源名称修改对话框 -->
      <el-dialog :width="'460px'" title="修改监控源名称" :visible.sync="isChangeName">
        <el-form
          :model="toolDetail"
          :rules="namerules"
          ref="form"
          label-width="100px"
          @submit.native.prevent
          class="dialog-form"
        >
          <el-form-item label="监控源名称" prop="name">
            <el-input v-model.trim="toolDetail.name" placeholder="输入新的名称"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="handleCancle" size="small">取 消</el-button>
          <el-button type="primary" @click="handleComfirm" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <denoise-dialog :visible.sync="showDialog" :noiseDialogId="noiseDialogId"></denoise-dialog>
    <guide-close v-if="isGuiding" @close="closeGuide" />
  </div>
</template>

<script>
import { apiGenTestEvent } from '@/apis/event'
import { apiGetAccessTools, apiDeleteAccess, apiSaveAccess, apiUpdateState } from '@/apis/access'
import DiySwitch from '@/components/common/diy-switch.vue'
import GuideClose from '@/components/common/guide-close'
import AccessCardList from './components/accesscardlist.vue'
import DenoiseDialog from './components/denoisedialog.vue'
import TableActions from '@/components/common/table-actions.vue'
import { monitorAccess } from '@/utils/guideOptions'
import table from '@/mixins/table'
export default {
  name: 'MonitorAccess',
  components: {
    DiySwitch,
    AccessCardList,
    DenoiseDialog,
    TableActions,
    GuideClose
  },
  mixins: [table],
  data() {
    return {
      showDialog: false,
      isGuiding: false,
      selectedType: '',
      //修改名称对话框
      isChangeName: false,
      toolDetail: {
        id: '',
        name: '',
        conf: '',
        type: ''
      },
      namerules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      },
      actions: [
        { name: '详情', id: '3' },
        { name: '编辑名称', id: '1', permission: 'MonitoringSource-update' },
        { name: '删除', id: '2', permission: 'MonitoringSource-remove' }
      ],
      noiseDialogId: '',
      // 监控源type <=> title对应表
      matchList: {},
      // matchList: {
      //   tencentcloud: '腾讯云',
      // }
      testLoading: false
    }
  },
  created() {
    this.getData()
  },
  mounted() {
    setTimeout(() => {
      this.checkIntro()
    }, 600)
  },
  methods: {
    //监控源状态切换
    async statusChange(state, { id }) {
      const { success, desc } = await apiUpdateState(id, { state })
      if (success) {
        this.$Message.success('状态修改成功')
      } else {
        desc && this.$Message.error(desc)
      }
    },
    sendAccessList(list) {
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        // console.log(item)
        this.matchList[item.type] = item.title
      }
    },
    showNoiseDialog(id) {
      this.showDialog = true
      this.noiseDialogId = id
    },
    //测试接入
    async testTool() {
      this.testLoading = true
      const { success, desc, data } = await apiGenTestEvent()
      this.testLoading = false
      if (success) {
        this.$Message.success('接入成功')
        // 缓存测试事件用于新手指导
        localStorage.setItem(
          'testEvent',
          JSON.stringify({
            _timestamp: +new Date(),
            data: data
          })
        )
        if (this.$refs.introTestBtn && this.intro) {
          this.intro.nextStep()
        }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //表格重制
    resetData() {
      this.selectedType = ''
      this.search.page = 1
      this.search.limit = 10
      this.getData()
    },
    //卡片类型点击事件
    selectType(type) {
      this.selectedType = type
      //搜索时默认第一页
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
      this.getData()
    },
    //表格conf转webhook
    webHookFormtter(row) {
      return JSON.parse(row.conf).webHook
    },
    // 点击行操作
    actionClick(id, { row }) {
      switch (id) {
        case '1':
          this.toolDetail = { ...row }
          this.isChangeName = true
          break
        case '2':
          this.deleteTool(row.id)
          break
        case '3':
          this.$router.push(
            `accessdetail?type=${row.type}&title=${this.matchList[row.type]}&&webHook=${JSON.parse(row.conf).webHook}`
          )
          break
        default:
      }
    },
    // 获取表格数据
    async getData() {
      this.loading = true
      const { success, desc, rows, total } = await apiGetAccessTools({ type: this.selectedType, ...this.search })
      this.loading = false
      if (success) {
        this.table = {
          rows,
          total
        }
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //对话框取消按钮
    handleCancle() {
      this.isChangeName = false
      this.$refs.form.resetFields()
    },
    //对话框确认按钮
    handleComfirm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 此时的toolDetail不
          const { id, name, conf, type, state } = this.toolDetail
          const { success, desc } = await apiSaveAccess({ id, name, conf, type, state })
          if (success) {
            this.getData()
            this.$Message.success('保存成功')
            this.isChangeName = false
          } else {
            desc && this.$Message.error(desc)
          }
        }
      })
    },
    //删除监控源
    deleteTool(id) {
      this.$customMessageBox(this, '提示', '确定删除这个监控源吗？', 'warning')
        .then(async () => {
          const { success, desc } = await apiDeleteAccess(id)
          if (success) {
            this.getData()
            this.$Message.success('删除成功')
          } else {
            desc && this.$Message.error(desc)
          }
        })
        .catch(() => {})
    },
    //覆盖mixin表格高度调整
    resetTableHeight() {},
    // 检测是否开启新手教程
    checkIntro($route = this.$route) {
      if ('intro' in $route.query) {
        this.intro = this.$intro()
          .setOptions(monitorAccess)
          .start()
          .oncomplete(() => {
            this.isGuiding = false
            this.$router.push('/event/realtime?intro=event')
          })
        this.isGuiding = true
      }
    },
    // 关闭教程
    closeGuide() {
      this.intro.exit(true)
      this.isGuiding = false
      this.$router.push(this.$route.path)
    },
    copy(row) {
      let input = document.createElement('input') // js创建一个input输入框
      input.value = this.webHookFormtter(row) // 将需要复制的文本赋值到创建的input输入框中，this.ruleForm.url这个是我要复制的内容
      document.body.appendChild(input) // 将输入框暂时创建到实例里面
      input.select() // 选中输入框中的内容
      document.execCommand('Copy') // 执行复制操作
      document.body.removeChild(input)
      this.$Message.success('复制成功')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-form {
  .el-form-item {
    margin-bottom: 0px;
  }
}
.access-header {
  padding-top: 10px;
}
.el-divider {
  margin: 10px 0 16px;
}
.divider-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  min-height: 32px;
  span {
    font-weight: bold;
    position: absolute;
    left: 0;
  }
}
.table-button-denoise {
  margin: 0;
  word-break: break-all;
  max-width: 150px;
  color: #0076ff;
  cursor: pointer;
}
.page-table {
  padding: 8px 0 0;
  img {
    width: 18px;
    height: auto;
    position: relative;
    top: 3px;
    left: 4px;
  }
}
.page-table-pagination {
  margin-top: 16px;
  font-size: 14px;
  @include flex(flex-end);
}
// .view-height {
//   height: calc(100vh - 55px);
//   overflow-y: auto;
//   // height: calc(100vh - 55px);
//   // overflow-y: auto;
// }
</style>
