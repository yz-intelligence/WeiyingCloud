<template>
  <div class="page-container">
    <c-breadcrumb />
    <!-- 内容部分 -->
    <div class="page">
      <div class="page-content">
        <div class="rule" v-loading="loading">
          <!-- 顶部搜索部分 -->
          <div class="rule-title">
            <el-input
              size="small"
              class="rule-title-input"
              id="rule_input_search"
              v-model.trim="searchText"
              :maxlength="100"
              placeholder="请输入关键字"
              @keyup.enter.native="doSearch()"
            >
              <el-button
                id="rule_button_search"
                slot="append"
                size="small"
                icon="el-icon-search"
                @click="doSearch()"
              ></el-button>
            </el-input>
            <refresh :loading="loading" @refresh="resetData()" />
            <el-button
              v-if="$hasPermission('Maintenance-create')"
              id="rule_button_add"
              class="rule-title-button"
              type="primary"
              icon="el-icon-plus"
              @click="showAdd()"
              size="small"
            >
              新增
            </el-button>
          </div>
          <el-divider></el-divider>
          <!-- 中间表格部分 -->
          <div class="rule-content">
            <el-table
              id="rule_table_rule"
              ref="table"
              :height="tableHeight"
              :data="table.rows"
              class="rule-content-table"
              @selection-change="handleSelection"
            >
              <el-table-column prop="name" label="策略名称"> </el-table-column>
              <el-table-column prop="summary" label="规则描述" :formatter="changeSummary"> </el-table-column>
              <el-table-column prop="beginTime" label="通知时段" :formatter="changeTime"> </el-table-column>
              <el-table-column label="升级规则" width="120px">
                <template slot-scope="scope">
                  <div v-if="scope.row.upgradeRules.length" class="table-rules">
                    <div v-for="(item, index) of scope.row.upgradeRules" :key="index" class="table-button-subdetail">
                      <span
                        v-if="index !== scope.row.upgradeRules.length - 1"
                        @click="showUpDetailDialog(item.id, item.name)"
                        >{{ item.name }}、</span
                      >
                      <span v-else @click="showUpDetailDialog(item.id, item.name)">{{ item.name }}</span>
                    </div>
                  </div>
                  <div v-else>--</div>
                </template>
              </el-table-column>
              <el-table-column v-if="$hasPermission('EventUpgrade-create')" label=" " width="150px">
                <template slot-scope="scope">
                  <el-button
                    class="rule-table-button"
                    icon="el-icon-plus"
                    @click="addUpgradeDialog(scope.row.id)"
                    size="mini"
                  >
                    新增
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间"> </el-table-column>
              <el-table-column prop="modifyTime" label="最后编辑时间"> </el-table-column>
              <el-table-column prop="status" label="状态" width="80">
                <template slot-scope="scope">
                  <diy-switch
                    :disabled="!$hasPermission('Maintenance-status')"
                    :state.sync="scope.row.status"
                    :row="scope.row"
                    @change="statusChange(scope.row.status, scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <table-actions :scope="scope" :actions="actions" @click="actionClick"></table-actions>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 下方分页操作部分 -->
          <div class="rule-page">
            <el-pagination
              :page-sizes="pageSizes"
              :page-size="search.limit"
              :current-page="search.page"
              layout="total, prev, pager, next, sizes"
              :total="table.total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增订阅修改复用弹窗 -->
    <rule-edit
      v-if="isShowSub"
      :UsersGroup="users"
      :form="ruleform"
      :sourceMap="sourceMap"
      :groups="groups"
      :isWatch="isWatch"
      :SourceOpt="SourceOpt"
      :visible.sync="isShowSub"
      :title="formTitle"
      @success="getRulesData"
    />
    <!-- 新增升级修改复用弹窗 -->
    <upgrade-edit
      v-if="isUpGradeShow"
      :visible.sync="isUpGradeShow"
      :UsersGroup="users"
      :upgradeform="upgradeform"
      :SourceOpt="SourceOpt"
      :sourceMap="sourceMap"
      :groups="groups"
      :title="formTitle"
      :rules="rules"
      :isWatch="isWatch"
      @success="getData"
    />
  </div>
</template>

<script>
import table from '@/mixins/table'
import noticDialog from '@/mixins/notic-dialog'
import DiySwitch from '@/components/common/diy-switch.vue'
import { getSubscriptions, deleteSubscriptions, apiUpdateState } from '@/apis/rule'
import { mapGetters } from 'vuex'
import TableActions from '@/components/common/table-actions.vue'
import RuleEdit from './components/rule-edit.vue'
import UpgradeEdit from './components/upgrade-edit.vue'
import Refresh from '@/components/common/refresh.vue'
export default {
  components: {
    RuleEdit,
    UpgradeEdit,
    TableActions,
    DiySwitch,
    Refresh
  },
  mixins: [table, noticDialog],
  name: 'NoticeRule',
  computed: {
    ...mapGetters(['user', 'levelOpt'])
  },
  data() {
    return {
      searchText: '',
      //订阅规则对话框显示
      isShowSub: false,
      //新增升级规则对话框显示
      isUpGradeShow: false,
      //切换升级规则对话框只读或可编辑：（true--只读）
      isWatch: false,
      loading: false,
      actions: [
        { name: '详情', id: '0' },
        { name: '编辑', id: '1', permission: 'Maintenance-update' },
        { name: '删除', id: '2', permission: 'Maintenance-remove' }
      ],
      formTitle: '新增',
      //升级对话框数据
      upgradeform: {},
      error: [true, false],
      selectedData: [],
      isPreview: false
    }
  },
  created() {
    this.getData()
    this.getUsers()
    this.getGroup()
    this.getSource()
    this.getRules()
  },
  methods: {
    //切换升级规则状态
    async statusChange(state, { id }) {
      const { success, desc } = await apiUpdateState(id, { state: Boolean(state) })
      if (success) {
        this.$Message.success('状态修改成功')
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //查看已有升级规则对话框
    showUpDetailDialog(id, name) {
      let row = { id: id }
      this.getFormById(row)
      this.formTitle = name
      this.isUpGradeShow = true
      this.isWatch = true
    },
    //新增升级规则对话框
    addUpgradeDialog(id) {
      this.resetForm(id)
      this.isUpGradeShow = true
      this.isWatch = false
    },
    //新增订阅规则刷新
    getRulesData() {
      this.getRules()
      this.getData()
    },
    async getData() {
      const { searchText: name } = this
      let params = {
        isMy: false, // 只查询我创建的
        ...this.search,
        name,
        summary: name
      }
      this.loading = true
      const { success, rows, desc, total } = await getSubscriptions(params)
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
    // 处理表格规则描述的显示
    changeSummary(row, column) {
      let arr = row.summary.split(' ')
      let key = -3
      const data = arr.map((item, index) => {
        if (item === '事件级别') {
          key = index
          return item
        }
        if (index === key + 2) {
          if (item.indexOf(',') != -1) {
            const iArr = item.split(',').map(m => {
              return this.levelOpt[m] || m
            })
            return iArr
          } else {
            return this.levelOpt[item] || item
          }
        } else {
          return item
        }
      })
      return data.join(' ')
    },
    async showAdd(title = '新增订阅策略', row) {
      this.formTitle = title
      this.resetRuleForm()
      if (row) {
        this.error = [false, false]
        this.getRuleFormById(row.id)
        this.isShowSub = true
      } else {
        this.isWatch = false
        this.error = [true, false]
        this.isShowSub = true
      }
    },
    closeAdd() {
      this.isShowSub = false
    },
    // 初始化ruleForm表
    resetRuleForm() {
      this.ruleform = {
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
        ownerIds: [this.user.id],
        contents: [
          {
            field: 'NAME',
            condition: 'in',
            value: ''
          }
        ],
        noticeTemplateId: '-1',
        ruleRepeatDto: {
          repeatState: false, //是否开启重复发送，关闭，开启
          monitorType: 'Delay_Mode', // Delay_Mode 首次通知后延迟, Interval_Mode 每间隔
          minuteNumber: 5, //分钟
          type: 'Increase' // Increase 增加 Closure 关闭
        }
      }
    },
    actionClick(id, { row }) {
      switch (id) {
        case '0':
          this.isWatch = true
          this.showAdd('订阅策略详细', row)
          break
        case '1':
          this.isWatch = false
          this.showAdd('编辑订阅策略', row)
          break
        default:
          this.deleteRule(row)
          break
      }
    },
    // 删除订阅规则
    deleteRule({ id, upgradeRules }) {
      if (!upgradeRules.length) {
        this.$customMessageBox(this, '提示', '确定删除这条策略吗？', 'warning')
          .then(async () => {
            const { success, desc } = await deleteSubscriptions(id)
            if (success) {
              this.getData()
              this.$Message.success('删除成功')
            } else {
              desc && this.$Message.error(desc)
            }
          })
          .catch(() => {})
      } else {
        this.$customMessageBox(
          this,
          '删除信息',
          `确定删除这条策略吗？该订阅策略关联了以下升级规则：<br/>${upgradeRules.map(item => item.name)}`,
          'warning',
          {
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          },
          true
        )
          .then(async () => {
            const { success, desc } = await deleteSubscriptions(id)
            if (success) {
              this.getData()
              this.$Message.success('删除成功')
            } else {
              desc && this.$Message.error(desc)
            }
          })
          .catch(() => {})
      }
    },
    handleSelection(data) {
      this.selectedData = data
    },
    toTrue(index) {
      this.error[index] = true
    },
    toFalse(index) {
      this.error[index] = false
    },
    // 刷新功能
    resetData() {
      this.searchText = ''
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.rule {
  display: flex;
  flex-direction: column;
  &-title {
    padding-top: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
    &-input {
      width: 240px;
      margin: 0 16px;
    }
    &-button {
      margin: 5px 0 5px 16px;
    }
    &::v-deep .el-input-group__append {
      padding: 0 19px;
      background-color: #0076ff;
      color: #fff;
    }
  }
  &-table {
    &-button {
      margin-left: -10px;
    }
  }
  &-page {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e8eaec;
}
.blue {
  background-color: #0076ff !important;
  color: #fff !important;
  border-radius: 0 3px 3px 0;
}
.point {
  cursor: pointer;
}
.table-button-subdetail {
  margin: 0;
  // word-break: break-all;
  // max-width: 150px;
  color: #0076ff;
  cursor: pointer;
}
.table-rules {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
