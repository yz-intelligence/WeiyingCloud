<template>
  <el-dialog
    title="事件合并"
    destroy-on-close
    width="80%"
    :close-on-click-modal="!isGuiding"
    :close-on-press-escape="!isGuiding"
    :visible.sync="editVisible"
    @close="close"
  >
    <el-card>
      <el-form ref="form" :model="form" size="small" :form="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="合并到" class="">
              <el-switch v-model="mergerAsNew" @change="changeMergerType" size="large"> </el-switch>
              {{ mergerAsNew ? '新' : '已有' }}事件
            </el-form-item>
            <el-form-item label="事件状态" prop="status">
              <el-select class="comp-form-input" v-model="form.status">
                <el-option
                  :key="key"
                  v-for="(value, key) of searchOptions.status.options"
                  :value="+key"
                  :label="value"
                  >{{ value }}</el-option
                >
              </el-select>
            </el-form-item>
            <el-form-item label="事件级别" prop="level">
              <el-select class="comp-form-input" v-model="form.level">
                <el-option
                  :key="key"
                  v-for="(value, key) of searchOptions.level.options"
                  :value="+key"
                  :label="value"
                  >{{ value }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-row>
              <el-col :span="12">
                <el-form-item v-if="mergerAsNew" label="事件标题" prop="name">
                  <el-input class="comp-form-input" v-model="form.name" :maxlength="100" />
                </el-form-item>
                <el-form-item v-else label="事件标题" prop="id">
                  <el-select
                    filterable
                    class="comp-form-input"
                    v-model="form.id"
                    remote
                    :remote-method="searchMergerList"
                    :loading="titleLoading"
                    @change="handleChangeMerger"
                    placeholder="可模糊查询"
                  >
                    <el-option :key="m.id" :label="m.name" v-for="m in mergers" :value="m.id">{{ m.name }}</el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="事件对象" prop="eventObj">
                  <el-autocomplete class="comp-form-input" v-model="form.eventObj" :fetch-suggestions="filterMethod" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="事件描述" prop="summary">
              <el-input
                v-model="form.summary"
                :maxlength="1000"
                type="textarea"
                show-word-limit
                :autosize="{ minRows: 4, maxRows: 5 }"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="form-table">
      <el-table ref="table" :height="250" size="small" border :data="tableData">
        <template v-for="item of columns">
          <!-- 状态 -->
          <el-table-column
            v-if="item.key === 'status'"
            :key="item.key"
            :prop="item.key"
            :label="item.title"
            align="center"
            :min-width="item.minWidth"
          >
            <template slot-scope="scope">
              <div :class="`chip chip--xs chip--outline ${searchOptions.status.class[scope.row.status]}`">
                <span class="chip__content">{{
                  scope.row.maintenanceId ? '维护期' : searchOptions.status.options[scope.row.status]
                }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- 其他 -->
          <el-table-column
            v-else
            :key="item.key"
            :prop="item.key"
            :label="item.title"
            :align="item.align"
            :sortable="item.sortable"
            :min-width="item.minWidth"
            :formatter="item.formatter"
            :resizable="item.resizable"
            show-overflow-tooltip
          />
        </template>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button ref="submit" id="guideEventMergeBtn" size="small" type="primary" :loading="loading" @click="onSubmit"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
// 人工报障
import { apiGetMergersBy, apiDoMerger, apiGetEvents, apiGetHistoryEvent } from '@/apis/event'
export default {
  name: 'EventMerge',
  props: {
    from: {
      type: String,
      default: 'list' // list 实时事件， history 事件档案
    },
    eventIds: {
      type: String,
      required: true
    },
    extra: {
      type: Object,
      default: () => {}
    },
    searchOptions: {
      type: Object,
      required: true
    },
    visible: Boolean,
    isGuiding: Boolean
  },
  data() {
    this.columns = [
      {
        title: '合并事件标题',
        key: 'mergerTitle',
        width: 130
      },
      {
        title: '事件标题',
        key: 'name',
        width: 100
      },
      {
        title: '状态',
        align: 'center',
        key: 'status',
        sortable: 'custom',
        minWidth: 110
      },
      {
        title: '事件内容',
        key: 'summary',
        minWidth: 120,
        resizable: true
      },
      {
        title: '事件对象',
        key: 'eventObj',
        sortable: 'custom',
        minWidth: 120
      },
      {
        title: '次数',
        key: 'counts',
        align: 'right',
        minWidth: 70
      },
      {
        title: '最近告警',
        key: 'lastTime',
        sortable: 'custom',
        minWidth: 144
      }
    ]
    return {
      loading: false,
      editVisible: this.visible,
      mergerAsNew: true, // 合并到新
      checkAll: true,
      mergers: [], // 合并模糊
      titleLoading: false, // 事件标题模糊搜索
      tableData: [],
      eventObjs: [],
      form: {
        id: '',
        name: '',
        status: 1,
        level: 2,
        summary: '',
        eventObj: ''
      },
      rules: {
        name: [{ required: true, message: '事件标题不能为空', trigger: 'blur' }],
        id: [{ required: true, message: '事件标题不能为空', trigger: 'change' }],
        summary: [{ required: true, message: '事件描述不能为空', trigger: 'blur' }],
        eventObj: [{ required: true, message: '事件对象不能为空', trigger: 'change' }]
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.editVisible = val
        this.init(val)
      },
      immediate: true
    }
  },
  methods: {
    // TODO:逻辑待优化
    async init(val) {
      this.mergerAsNew = true
      this.tableData = []
      this.eventObjs = []
      if (val) {
        this.checkAll = true
        this.loading = true
        const { success, desc, data } = await apiGetMergersBy(this.eventIds)
        this.loading = false
        if (success) {
          for (let item of data) {
            if (item.mergerEvents && item.mergerEvents.length) {
              item.mergerEvents[0].mergerTitle = item.name
              item.mergerEvents[0]._mergerTotal = item.mergerEvents.length
              item.mergerEvents[item.mergerEvents.length - 1]._isLastMerger = true
              for (let m of item.mergerEvents) {
                this.tableData.push(m)
                !this.eventObjs.includes(m.eventObj) && this.eventObjs.push(m.eventObj) // 去重，读取所有的事件对象
              }
            } else {
              item.mergerTitle = item.name
              item._isLastMerger = true
              item._mergerTotal = 1
              this.tableData.push(item)
              !this.eventObjs.includes(item.eventObj) && this.eventObjs.push(item.eventObj) // 去重，读取所有的事件对象
            }
          }
        } else {
          desc && this.$Message.error(desc)
        }
      } else {
        this.$refs.form && this.$refs.form.resetFields()
      }
    },
    close() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const params = {
            ...this.form,
            ids: this.tableData.map(item => item.id).join(',')
          }
          const { success, desc, data } = await apiDoMerger(params)
          this.loading = false
          if (success) {
            this.form = {
              id: '',
              name: '',
              status: 1,
              level: 2,
              summary: '',
              eventObj: ''
            }
            this.$Message.success('合并成功')
            this.$emit('success', data.ID)
            this.close()
          } else {
            desc && this.$Message.error(desc)
          }
        }
      })
    },
    changeMergerType(val) {
      this.form.id = ''
    },
    filterMethod(queryString, cb) {
      var eventObjs = this.eventObjs.map(value => {
        return {
          value
        }
      })
      var results = queryString ? eventObjs.filter(this.createFilter(queryString)) : eventObjs
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return data => {
        return data.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      }
    },
    // 模糊搜索用于合并得数据
    async searchMergerList(name) {
      // 去掉两侧空格
      if (name.trim()) {
        let getMergersApi = apiGetHistoryEvent
        const { from, extra } = this
        let param = {
          page: 1,
          limit: 10,
          name
        }
        // 实时事件页面下，参数不同
        if (from === 'list') {
          getMergersApi = apiGetEvents
          const { val, condition } = extra
          param = {
            ...param,
            ...condition[val],
            status: -99
          }
        }
        const { success, desc, rows } = await getMergersApi(param)
        if (success) {
          let data = []
          if (rows.length > 0) {
            // 搜索显示数据不能与选中得重复
            data = rows.filter(item => !this.tableData.map(item => item.id).includes(item.id))
            // 事件档案页面时，过滤掉已关闭事件
            if (this.from === 'history') {
              data = data.filter(item => item.status !== 99)
            }
          }
          this.mergers = data
        } else {
          this.mergers = []
          desc && this.$Message.error(desc)
        }
      } else {
        this.mergers = []
      }
    },
    handleChangeMerger(value) {
      if (value) {
        let event = this.mergers.find(item => item.id === value)
        for (let key of Object.keys(this.form)) {
          this.form[key] = event[key]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-form-input {
  width: 100%;
}
</style>
