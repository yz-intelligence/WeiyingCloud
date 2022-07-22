import { apiGetAccessToolsList } from '@/apis/access'
import { Message } from 'element-ui'
const dictionModel = {
  levelOpt: {
    0: '恢复',
    1: '信息',
    2: '告警',
    3: '故障',
    4: '事故',
    '-1': '未分类'
  },
  statusOpt: {
    0: '待发送',
    1: '发送中',
    2: '失败',
    3: '成功'
  },
  sourceStatus: {
    0: '即将进行',
    1: '正在进行',
    2: '已暂停',
    3: '已结束'
  },
  sendType: {
    EMAIL: '邮件',
    SMS: '短信',
    QIYE_WEIXIN: '企业微信',
    QIYE_WEIXIN_GROUP: '企业微信群',
    PAGER_DUTY: 'PagerDuty'
  },
  validityOpt: {
    0: '有效',
    1: '无效'
  },
  statusOptions: {
    0: '未响应',
    1: '处理中',
    88: '已恢复',
    99: '已关闭',
    100: '维护期'
  },
  conditionOpt: {
    '=': '等于',
    in: '包含'
  },
  fieldOpt: {
    NAME: '事件标题',
    LEVEL: '事件级别',
    EVENT_OBJ: '事件对象',
    SUMMARY: '事件内容',
    MONITOR_CODE: '监控源'
  },
  periodType: {
    0: '非周期',
    1: '按天',
    2: '按周',
    3: '按月'
  },
  weekType: {
    1: '周一',
    2: '周二',
    3: '周三',
    4: '周四',
    5: '周五',
    6: '周六',
    7: '周日'
  },
  closeTime: {
    1: '1小时',
    3: '3小时',
    6: '6小时',
    12: '12小时',
    24: '24小时',
    48: '48小时',
    72: '72小时',
    '-1': '永不关闭'
  }
}
const dictionary = {
  namespaced: true,
  state: {
    // 事件级别
    levelOpt: {},
    // 通知状态
    statusOpt: {},
    // 维护期状态
    sourceStatus: {},
    // 发送方式
    sendType: {},
    // 有效性判断
    validityOpt: {},
    // 事件状态
    statusOptions: {},
    // 监控源
    source: [],
    // 规则内容关系
    conditionOpt: {},
    // 规则内容
    fieldOpt: {},
    // 周期
    periodType: {},
    // 周期（按周）
    weekType: {},
    // 事件自动关闭时长
    closeTime: {},
    // 降噪合并条件选择
    conditionRelation: {}
  },
  mutations: {
    SET_LEVEL: (state, data) => {
      state.levelOpt = data
    },
    SET_STATUS: (state, data) => {
      state.statusOpt = data
    },
    SET_SOURCESTATUS: (state, data) => {
      state.sourceStatus = data
    },
    SET_SEND: (state, data) => {
      state.sendType = data
    },
    SET_VALIDITY: (state, data) => {
      state.validityOpt = data
    },
    SET_STATUSOPTIONS: (state, data) => {
      state.statusOptions = data
    },
    SET_SOURCE: (state, data) => {
      state.source = data
    },
    SET_CONDITION: (state, data) => {
      state.conditionOpt = data
    },
    SET_FIELDOPT: (state, data) => {
      state.fieldOpt = data
    },
    SET_PERIODTYPE: (state, data) => {
      state.periodType = data
    },
    SET_WEEKTYPE: (state, data) => {
      state.weekType = data
    },
    SET_CLOSETIME: (state, data) => {
      state.closeTime = data
    },
    SET_CONDITIONRELATION: (state, data) => {
      state.conditionRelation = data
    }
  },
  actions: {
    // 无接口情况
    getDictionary: ({ commit }) => {
      commit('SET_LEVEL', dictionModel.levelOpt)
      commit('SET_STATUS', dictionModel.statusOpt)
      commit('SET_SOURCESTATUS', dictionModel.sourceStatus)
      commit('SET_SEND', dictionModel.sendType)
      commit('SET_VALIDITY', dictionModel.validityOpt)
      commit('SET_STATUSOPTIONS', dictionModel.statusOptions)
      commit('SET_CONDITION', dictionModel.conditionOpt)
      commit('SET_FIELDOPT', dictionModel.fieldOpt)
      commit('SET_PERIODTYPE', dictionModel.periodType)
      commit('SET_WEEKTYPE', dictionModel.weekType)
      commit('SET_CLOSETIME', dictionModel.closeTime)
      return true
    },
    getMonitorSource: async ({ commit, state }) => {
      if (state.source.length > 0) return state.source
      const { success, desc, data } = await apiGetAccessToolsList()
      if (success) {
        commit('SET_SOURCE', data)
      } else {
        desc && Message.error(desc)
      }
      return data || []
    }
  }
}
export default dictionary
