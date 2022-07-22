import { apiGetAccessTools } from '@/apis/access'
import { apiGetGroupTree, apiSelectUser } from '@/apis/user'
import { getSubscriptions, getSubscriptionDetail } from '@/apis/rule'
import { apiGetUpgradeById } from '@/apis/upgrade'
export default {
  data() {
    return {
      //订阅规则详情对话框
      ruleform: {
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
      },
      // 用户组
      groups: [],
      // 监控源内容
      SourceOpt: [],
      // 做监控源的Map转换
      sourceMap: new Map(),
      // 用户下拉框内容
      users: []
    }
  },
  methods: {
    //新增升级规则对话框数据初始化
    resetForm(id) {
      this.upgradeform = {
        id: '',
        name: '',
        scopeType: 'ASSOCIATE',
        rules: id ? [id] : [],
        modelType: 'DURATION',
        condition: {
          alertLeve: [],
          alarmStatus: [],
          duration: 30,
          number: 1
        },
        report: {
          objType: 'USER',
          objId: [],
          sendTypes: ['EMAIL']
        },
        upgradeSwitch: 0,
        level: '',
        status: 1
      }
    },
    // 处理表格通知时间的显示
    changeTime(row, column) {
      let data =
        (row.beginTime / 60 > 9 ? Math.floor(beginTime / 60) : '0' + Math.floor(row.beginTime / 60)) +
        ':' +
        (row.beginTime % 60 > 9 ? row.beginTime % 60 : '0' + (row.beginTime % 60)) +
        '-' +
        (row.endTime / 60 > 9 ? Math.floor(row.endTime / 60) : '0' + Math.floor(row.endTime / 60)) +
        ':' +
        (row.endTime % 60 > 9 ? row.endTime % 60 : '0' + (row.endTime % 60))
      return data
    },
    // 搜索监控源内容
    async getSource() {
      const { success, rows, desc } = await apiGetAccessTools()
      if (success) {
        this.SourceOpt = rows
        let m = new Map()
        let n = ''
        rows.forEach((item, index) => {
          n = JSON.parse(item.conf).webHook.split('/').pop()
          this.SourceOpt[index].conf = n
          m.set(n, item.name)
        })
        this.sourceMap = m
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 搜索规则订阅内容
    async getRules(text) {
      let params = {
        isMy: false, // 只查询我创建的
        page: 1,
        limit: 9999
        // ...this.search
      }
      const { success, rows, desc, total } = await getSubscriptions(params)
      if (success) {
        this.rules = rows
      } else {
        desc && this.$Message.error(desc)
      }
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
    // 搜索用户组
    async getGroup() {
      const { success, data, desc } = await apiGetGroupTree(this.user.companyId)
      if (success) {
        this.groups = data
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //搜索
    doSearch() {
      this.search.page = 1
      this.$nextTick(() => {
        this.getData()
      })
    },
    // 通过id获取升级规则详细信息
    async getFormById(row) {
      const { success, data, desc } = await apiGetUpgradeById(row.id)
      if (success) {
        let form = {
          ...data
        }
        form.alertLeve = form.alertLeve.split(',')
        form.sendTypes = form.sendTypes.split(',')
        form.upgradeSwitch = Number(form.upgradeSwitch)
        form.status = Number(form.status)
        if (form.modelType === 'DURATION') {
          form.alarmStatus = form.alarmStatus.split(',')
          form.number = 1
        }
        if (form.objType === 'USER') {
          form.objId = form.objId.split(',')
        }
        if (form.scopeType === 'DIY') {
          form.rules = JSON.parse(form.rules)
        } else {
          form.rules = form.rules.split(',')
        }
        this.upgradeform = {
          ...form,
          level: form.level === -1 ? '' : form.level.toString(),
          condition: {
            alertLeve: form.alertLeve,
            alarmStatus: form.alarmStatus,
            duration: form.duration,
            number: form.number
          },
          report: {
            objType: form.objType,
            objId: form.objId,
            sendTypes: form.sendTypes
          }
        }
        this.isShow = true
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 通过id获取订阅规则详细信息
    async getRuleFormById(id) {
      const { success, data, desc } = await getSubscriptionDetail(id)
      if (success) {
        let rule = JSON.parse(data.rules)
        let ruleform = {
          ...this.ruleform,
          ...data,
          relation: rule.relation,
          contents: rule.contents,
          beTime: this.changeTime(data).split('-')
        }
        if (data.recipients.length) {
          ruleform.ownerType = data.recipients[0][0]
          if (ruleform.ownerType === 'USER') {
            ruleform.ownerIds = data.recipients.map(item => item[1])
            let searchUserIds = ruleform.ownerIds.filter(id => {
              // 如果现有的用户列表里没有则去查询
              return !this.users.find(item => item.ID === id)
            })
            if (searchUserIds.length) {
              this.users = this.users.concat(this.getUsers(searchUserIds.join(',')))
            }
          } else {
            ruleform.ownerIds = data.recipients[0][1]
          }
        }
        if (data.qywxWebhooks) {
          ruleform.qywxWebhooks = data.qywxWebhooks.map(item => {
            return {
              webhook: item
            }
          })
        } else {
          ruleform.qywxWebhooks = [
            {
              webhook: ''
            }
          ]
        }
        this.ruleform = ruleform
        // this.isShow = true
      } else {
        desc && this.$Message.error(desc)
      }
    }
  }
}
