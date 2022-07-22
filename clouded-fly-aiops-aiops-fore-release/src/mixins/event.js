import Vue from 'vue'
// 引入拖拽组件，并初始化两个方法
import VddlDraggable from '@/components/common/vddl/vddl-draggable'
import VddlList from '@/components/common/vddl/vddl-list.vue'
Vue.prototype.vddlDropEffectWorkaround = {}
Vue.prototype.vddlDragTypeWorkaround = {}

import EventDetail from '@/views/event/components/event/event-detail'
import EventRemark from '@/views/event/components/event/event-remark'
import EventClose from '@/views/event/components/event/event-close'
import EventMerge from '@/views/event/components/event/event-merge'
import EventExpand from '@/views/event/components/event/event-expand'
import EventTransfer from '@/views/event/components/event/event-transfer'
import { apiResponseEvents } from '@/apis/event'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
export default {
  components: {
    VddlList,
    EventClose,
    EventMerge,
    EventDetail,
    EventRemark,
    EventExpand,
    EventTransfer,
    VddlDraggable
  },
  computed: {
    ...mapGetters(['levelOpt', 'statusOptions', 'user'])
  },
  data() {
    this.columnsMap = {
      eventObj: {
        title: '事件对象',
        key: 'eventObj',
        sortable: 'custom',
        minWidth: 120
      },
      level: {
        title: '级别',
        key: 'level',
        sortable: 'custom',
        minWidth: 100,
        align: 'center',
        slot: true
      },
      name: {
        title: '事件标题',
        key: 'name',
        minWidth: 120,
        resizable: true
      },
      summary: {
        title: '事件内容',
        key: 'summary',
        minWidth: 120,
        resizable: true
      },
      monitorCode: {
        title: '监控源',
        key: 'monitorCode',
        minWidth: 120,
        resizable: true,
        formatter: this.formatMonitorCode
      },
      counts: {
        title: '次数',
        key: 'counts',
        align: 'right',
        minWidth: 70,
        formatter: this.formatCounts
      },
      props: {
        title: '区域',
        key: 'props',
        minWidth: 120,
        formatter: this.formatZone
      },
      firstTime: {
        title: '首次告警',
        key: 'firstTime',
        sortable: 'custom',
        minWidth: 164
      },
      lastTime: {
        title: '最近告警',
        key: 'lastTime',
        sortable: 'custom',
        minWidth: 164
      },
      status: {
        title: '状态',
        key: 'status',
        align: 'center',
        sortable: 'custom',
        minWidth: 110
      },
      duration: {
        title: '持续时长',
        key: 'duration',
        sortable: 'custom',
        minWidth: 130,
        formatter: this.formatDuration
      },

      agent: {
        title: '监控源类型',
        key: 'agent',
        sortable: 'custom',
        minWidth: 120,
        formatter: this.formatAgent
      },
      ipAddress: {
        title: '主机IP',
        key: 'ipAddress',
        sortable: 'custom',
        minWidth: 120,
        formatter: this.formatIpaddress
      }
    }
    return {
      eventLevel: 99,
      // 因为Vue不能检测对象属性的添加或删除，所以必须先增加默认属性
      searchModels: {
        firstTime: null,
        level: '',
        status: ''
      },
      searchOptions: {
        eventObj: {
          type: 'input',
          label: '事件对象'
        },
        name: {
          type: 'input',
          label: '事件标题'
        },
        summary: {
          type: 'input',
          span: 4,
          label: '事件内容'
        },
        level: {
          type: 'select',
          label: '事件级别',
          options: {},
          class: {
            0: 'color-rec',
            1: 'color-info',
            2: 'color-warn',
            3: 'color-error',
            4: 'color-accd',
            '-1': 'color-other'
          },
          color: {
            0: '#48CC7E',
            1: '#0076FF',
            2: '#EFE041',
            3: '#EFB041',
            4: '#FF5F62',
            '-1': '#23C1EB'
          },
          values: [4, 3, 2, 1, 0, -1]
        },
        firstTime: {
          type: 'time',
          span: 4,
          label: '首次告警'
        },
        lastTime: {
          type: 'time',
          span: 4,
          label: '最近告警'
        },
        status: {
          type: 'select',
          label: '事件状态',
          options: {},
          class: {
            0: 'red',
            1: 'light-blue',
            88: 'green'
          }
        },
        agent: {
          type: 'select',
          label: '监控源类型',
          multiple: true,
          collapseTags: true,
          options: {}
        },
        componentType: {
          type: 'input',
          label: '对象类型'
          // label: '监控类别'
        },
        monitorCode: {
          type: 'input',
          label: '监控源名称'
        },
        ipAddress: {
          type: 'input',
          label: '主机IP'
        },
        id: {
          type: 'input',
          label: '事件ID'
        }
      },
      searchParams: {},
      tableData: [],
      tableTotal: 0,
      isShowListSet: false, // 列表设置弹窗
      tableConfig: null, // 列表设置
      tableConfigLoading: false,
      isShowSearch: false, // 搜索表单
      eventTotal: 0, // 事件总数
      levelTotalOptions: {}, // 各级别总数
      //默认列表配置
      defaultConfig: {
        colsChecked: [
          'name',
          'eventObj',
          'summary',
          'props',
          'counts',
          'level',
          'firstTime',
          'lastTime',
          'duration',
          'status',
          'agent',
          'componentType',
          'component',
          'ipAddress',
          'monitorCode'
        ],
        playSound: true,
        playLevel: {
          0: true,
          1: true,
          2: true,
          3: true,
          4: true,
          '-1': true
        },
        autoRefresh: true,
        refreshInterval: 30
      },
      search: {
        page: 1,
        limit: 10,
        sort: '', // 排序字段
        order: '' // 排序方式
      },
      expandRowKeys: [], // 展开行的id
      currentRecord: {},
      isShowDetail: false, //是否显示详情
      isShowRemark: false, //是否显示备注
      isShowMerge: false, //是否显示合并
      isShowTransfer: false, //是否显示转派
      isShowClose: false, //是否显示关闭
      selectedData: [], // 已选择数据
      selectedEventIds: '', // 已选事件id，单行时设置为当前行
      cellClickCacheId: ''
    }
  },
  created() {
    const { key, value, showSearch, level } = this.$route.query
    if (showSearch && key) {
      switch (key) {
        case 'firstTime':
          // 从首页今日事件跳转
          const todayStart = dayjs().set('hour', 0).set('minute', 0).format('YYYY-MM-DD HH:mm')
          const todayEnd = dayjs().set('hour', 23).set('minute', 59).format('YYYY-MM-DD HH:mm')
          this.searchModels.firstTime = [todayStart, todayEnd]
          break
        case 'status':
          this.searchModels.status = value
          break
        default:
      }
      if (level) {
        this.searchModels.level = level
      }
      if (this.fastFilter) {
        this.fastFilter.val = 'all'
      }
      this.isShowSearch = true
    }
    this.searchOptions.level.options = this.levelOpt
    this.searchOptions.status.options = this.statusOptions
    this.initMonitorSource()
    this.getColumnsWidth()
    this.customTableRef = 'tabletop'
  },
  watch: {
    eventLevel(val) {
      let level = val + ''
      // 99是查询所有
      if (val === 99) {
        level = ''
      }
      this.$set(this.searchModels, 'level', level + '')
      this.doSearch()
    }
  },
  methods: {
    async initMonitorSource() {
      const options = await this.$store.dispatch('dictionary/getMonitorSource')
      this.searchOptions.agent.options = options.map(item => {
        const { id: value, title: label } = item
        return { value, label }
      })
    },
    //点击搜索
    doSearch() {
      this.search.page = 1
      let searchModels = this.searchModels
      let searchOptions = this.searchOptions
      let searchParams = (this.searchParams = {})
      let val
      for (let key in searchModels) {
        val = searchModels[key]
        if (val !== undefined && val !== null) {
          if (Array.isArray(val)) {
            // 选择框多选
            // 选择框多选
            if (searchOptions[key]?.multiple) {
              searchParams[key] = val.join()
              continue
            }
            // 时间范围
            if (val.length === 2 && val[0] instanceof Date && val[1] instanceof Date) {
              searchParams[key] =
                dayjs(val[0]).format('YYYY-MM-DD HH:mm') + ' - ' + dayjs(val[1]).format('YYYY-MM-DD HH:mm')
            }
          } else {
            searchParams[key] = val
          }
        }
      }
      this.getData()
    },
    // 表格排序
    sortTable({ order, prop }) {
      if (!order) {
        this.search.sort = ''
        this.search.order = ''
      } else {
        const orderMap = {
          descending: 'desc',
          ascending: 'asc'
        }
        this.search.sort = prop
        this.search.order = orderMap[order]
      }

      this.getData()
    },
    //格式化区域字段
    formatZone({ props }) {
      return props ? JSON.parse(props).ZONE || '--' : '--'
    },
    //格式化监控源字段
    formatMonitorCode({ monitorCode }) {
      return monitorCode ? monitorCode : '--'
    },
    formatCounts({ counts, level }) {
      return level === 0 && counts === 0 ? '--' : counts
    },
    //格式化主机IP字段
    formatIpaddress({ ipAddress }) {
      return ipAddress ? ipAddress : '--'
    },
    //格式化监控源类型字段
    formatAgent({ agent }) {
      return agent ? agent : '--'
    },
    // 格式化持续事件
    formatDuration({ duration }) {
      const formatMap = {
        day: 1000 * 60 * 60 * 24,
        hour: 1000 * 60 * 60,
        min: 1000 * 60,
        sec: 1000
      }
      if (!duration || duration <= formatMap.sec) return '<1秒'
      const day = ~~(duration / formatMap.day)
      const hour = ~~((duration % formatMap.day) / formatMap.hour)
      const minutes = ~~((duration % formatMap.hour) / formatMap.min)
      const sec = ~~((duration % formatMap.min) / formatMap.sec)
      let time = day ? `${day}天` : ''
      if (hour) {
        time += `${hour}小时`
      }
      if (minutes) {
        time += `${minutes}分钟`
      }
      if (sec) {
        time += `${sec}秒`
      }
      return time
    },
    // 响应事件
    async doEventResponse(id) {
      const ids = id || this.selectedData.map(item => item.id).join(',')
      const { success, desc } = await apiResponseEvents(ids)
      if (success) {
        this.$Message.success('响应成功')
        this.getData()
      } else {
        desc && this.$Message.error(desc)
      }
    },
    cellClick(row, column, event) {
      if (event.cellIndex != 0 && column.label !== '操作') {
        const { id } = row
        const { expandRowKeys, cellClickCacheId } = this
        this.expandRowKeys = expandRowKeys.length > 0 ? (cellClickCacheId === id ? [] : [id]) : [id]
        this.cellClickCacheId = this.expandRowKeys.length === 0 ? '' : id
        // if (this.expandRowKeys.length > 0 && this.isGuiding && this.intro) {

        // }
      }
    },
    // TODO:待优化，代码重复，提取到一个方法，通过switch实现
    // 备注事件
    doEventRemark(id) {
      this.selectedEventIds = id || this.selectedData.map(item => item.id).join(',')
      this.isShowRemark = true
    },
    // 关闭事件
    doEventClose(id) {
      this.selectedEventIds = id || this.selectedData.map(item => item.id).join(',')
      this.isShowClose = true
    },
    // 转派事件
    doEventTransfer(id) {
      this.selectedEventIds = id || this.selectedData.map(item => item.id).join(',')
      this.isShowTransfer = true
    },
    // 合并事件
    doEventMerge() {
      this.selectedEventIds = this.selectedData.map(item => item.id).join(',')
      this.isShowMerge = true
    },
    noSelected() {
      this.$Message.warning('请选择至少 1 行数据！')
    },
    // 当选择项发生变化时会触发该事件
    selectionChange(selection) {
      this.selectedData = selection
    },
    // 删除选中字段
    deleteColumnsChecked(tag) {
      this.defaultConfig.colsChecked = this.defaultConfig.colsChecked.filter(item => item !== tag)
    },
    // 表头列宽变化事件
    headChange(newWidth, oldWidth, column, event) {
      const tableWidth = localStorage.getItem(this.user.id)
      const key = column.property
      const newTable = {
        ...JSON.parse(tableWidth),
        [key]: newWidth
      }
      localStorage.setItem(this.user.id, JSON.stringify(newTable))
    },
    // 获取缓存的表头宽度
    getColumnsWidth() {
      const tableWidth = JSON.parse(localStorage.getItem(this.user.id))
      if (tableWidth) {
        Object.entries(tableWidth).forEach(item => {
          const [filed, width] = item
          this.columnsMap[filed] && (this.columnsMap[filed].minWidth = width)
        })
      }
    },
    // 在保存列表设置时需要将缓存的表单宽度清空
    resetCacheColumnsWidth() {
      localStorage[this.user.id] = null
    }
  }
}
