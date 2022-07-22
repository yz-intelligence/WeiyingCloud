<template>
  <div class="page-container">
    <c-breadcrumb />
    <div class="page">
      <div class="page-content">
        <div class="upgrade" v-loading="loading">
          <!-- 顶部搜索部分 -->
          <div class="upgrade-title">
            <el-tooltip effect="dark" placement="top" trigger="hover">
              <i class="point upgrade-title-tips el-icon-tip"></i>
              <div slot="content">
                <div>
                  <div>通过配置事件升级规则，可以针对特定事件升级通知人员，避免错过重要事件</div>
                </div>
              </div>
            </el-tooltip>
            <span class="upgrade-title-tooltips">事件升级规则</span>
            <el-input
              size="small"
              class="upgrade-title-input"
              id="upgrade_input_search"
              v-model.trim="searchText"
              :maxlength="100"
              placeholder="请输入关键字"
              @keyup.enter.native="doSearch()"
            >
              <el-button
                id="upgrade_button_search"
                slot="append"
                size="small"
                icon="el-icon-search"
                @click="doSearch()"
              ></el-button>
            </el-input>
            <refresh :loading="loading" @refresh="resetData()" />
            <el-button
              v-if="$hasPermission('EventUpgrade-create')"
              id="upgrade_button_add"
              class="upgrade-title-button"
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
          <div class="upgrade-content">
            <el-table
              id="upgrade_table_upgrade"
              ref="table"
              :height="tableHeight"
              :data="table.rows"
              class="upgrade-content-table"
              :row-style="{ height: '56px' }"
            >
              <el-table-column prop="name" label="规则名称"> </el-table-column>
              <el-table-column prop="subscriptionRules" label="适用范围">
                <template slot-scope="scope">
                  <div
                    v-if="scope.row.scopeType === 'ASSOCIATE' && scope.row.subscriptionRules.length !== 0"
                    class="table-rules"
                  >
                    <div
                      v-for="(item, index) in scope.row.subscriptionRules"
                      :key="item.id"
                      class="table-button-subdetail"
                    >
                      <div v-if="item.ruleId === '-1'">
                        <span class="table-button-subdetail--all">{{ item.name }}</span>
                      </div>
                      <div v-else>
                        <span
                          v-if="index !== scope.row.subscriptionRules.length - 1"
                          @click="showSubDetailDialog(item.id, item.name)"
                          >{{ item.name }}、</span
                        >
                        <span v-else @click="showSubDetailDialog(item.id, item.name)">{{ item.name }}</span>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="scope.row.scopeType === 'DIY'">自定义事件范围</div>
                  <div v-else>--</div>
                </template>
              </el-table-column>
              <el-table-column prop="modelType" label="升级模式" :formatter="modelTypeMatch"> </el-table-column>
              <el-table-column prop="status" label="状态">
                <template slot-scope="scope">
                  <diy-switch
                    :disabled="!$hasPermission('EventUpgrade-status')"
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
          <div class="upgrade-page">
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
    <!-- 新增修改复用弹窗 -->
    <upgrade-edit
      v-if="isShow"
      :visible.sync="isShow"
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
    <!-- 新增修改复用弹窗 -->
    <rule-edit
      v-if="isSubShow"
      :UsersGroup="users"
      :form="ruleform"
      :sourceMap="sourceMap"
      :groups="groups"
      :SourceOpt="SourceOpt"
      :visible.sync="isSubShow"
      :title="subDetailTitle"
      :isWatch="true"
      @success="getData"
    />
  </div>
</template>
<script>
import table from '@/mixins/table'
import dialog from '@/mixins/notic-dialog'
import DiySwitch from '@/components/common/diy-switch.vue'
import { apiGetUpgradeById, apiGetUpgrade, apiUpdateState, apiDeleteSubscriptions } from '@/apis/upgrade'
import { mapGetters } from 'vuex'
import TableActions from '@/components/common/table-actions.vue'
import UpgradeEdit from './components/upgrade-edit.vue'
import RuleEdit from './components/rule-edit.vue'
import Refresh from '@/components/common/refresh.vue'
export default {
  name: 'NoticeUpgrade',
  components: {
    UpgradeEdit,
    RuleEdit,
    TableActions,
    DiySwitch,
    Refresh
  },
  mixins: [table, dialog],
  computed: {
    ...mapGetters(['user'])
  },
  data() {
    return {
      searchText: '',
      isShow: false,
      isSubShow: false,
      loading: false,
      actions: [
        { name: '详情', id: '1' },
        { name: '编辑', id: '2', permission: 'EventUpgrade-update' },
        { name: '删除', id: '3', permission: 'EventUpgrade-remove' }
      ],
      formTitle: '新增',
      //订阅规则详情对话框数据
      subDetailTitle: '',
      // 订阅规则内容
      rules: [],
      upgradeform: {},
      // 是否只读
      isWatch: false,
      //升级模式对应表
      modelList: {
        DURATION: '告警持续时长',
        FREQUENCY: '告警发生频率'
      }
    }
  },
  methods: {
    //升级模式对应
    modelTypeMatch(row) {
      return this.modelList[row.modelType]
    },
    async getData() {
      let params = {
        keyWord: this.searchText,
        ...this.search
      }
      this.loading = true
      const { success, rows, desc, total } = await apiGetUpgrade(params)
      this.loading = false
      if (success) {
        this.table = {
          rows,
          total
        }
        // console.log(this.table.rows[4].subscriptionRules)
        // this.table.rows[4].subscriptionRules[0].ruleId = '-1'
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //切换升级规则状态
    async statusChange(state, { id }) {
      const { success, desc } = await apiUpdateState(id, { state: Boolean(state) })
      if (success) {
        this.$Message.success('状态修改成功')
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //删除升级规则
    deleteUpgradeRule({ id, subscriptionRules }) {
      if (!subscriptionRules.length) {
        this.$customMessageBox(this, '提示', '确定删除这条规则吗？', 'warning')
          .then(async () => {
            const { success, desc } = await apiDeleteSubscriptions(id)
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
          `确定删除这条规则吗？该规则关联了以下订阅策略： <br/>${subscriptionRules.map(item => item.name)}`,
          'warning',
          {
            showCancelButton: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          },
          true
        )
          .then(async () => {
            const { success, desc } = await apiDeleteSubscriptions(id)
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
    //点击显示订阅规则对话框
    showSubDetailDialog(id, name) {
      this.getRuleFormById(id)
      this.subDetailTitle = name
      this.isSubShow = true
    },
    actionClick(id, { row }) {
      switch (id) {
        case '1':
          this.isWatch = true
          this.showAdd('详细', row)
          break
        case '2':
          this.isWatch = false
          this.showAdd('编辑升级规则', row)
          break
        default:
          this.deleteUpgradeRule(row)
          break
      }
    },
    async showAdd(title = '新增升级规则', row) {
      this.formTitle = title
      // 修改
      if (row) {
        this.getFormById(row)
      }
      // 新增
      else {
        this.isWatch = false
        this.resetForm()
        this.isShow = true
      }
    },
    // 刷新功能
    resetData() {
      this.searchText = ''
      this.getData()
    }
  },
  created() {
    this.getData()
    this.getSource()
    this.getRules()
    this.getUsers()
    this.getGroup()
  }
}
</script>
<style lang="scss" scoped>
.upgrade {
  display: flex;
  flex-direction: column;
  &-title {
    padding-top: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 14px;
    &-tooltips {
      color: #8c8c8c;
    }
    &-tips {
      margin-right: 8px;
      width: 14px;
      height: 14px;
      color: #999;
    }
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
  &--all {
    color: #666;
    cursor: default;
  }
}
.table-rules {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
