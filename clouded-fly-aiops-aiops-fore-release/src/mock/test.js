import Mock from 'mockjs'
export default ({ mock }) => {
  if (!mock) return
  // 用户登录
  Mock.mock('/test/login', 'post', {
    data: new Date().getTime() + ''
  })
  // 测试原始事件，正则才能匹配动态链接，例如 /api/events/sourceData/adad12312321321321
  Mock.mock(/\/events\/sourceData/, 'get', () => {
    return {
      success: true,
      data: {
        level: {
          0: '恢复',
          1: '信息',
          2: '告警',
          3: '故障',
          4: '事故',
          '-1': '未分类'
        },
        status: {
          0: '待发送',
          1: '发送中',
          2: '失败',
          3: '成功'
        }
      },
      desc: ''
    }
  })
  //获取表格数据
  Mock.mock('/test/getTable', 'get', () => {
    let list = []
    for (let i = 0; i < 5; i++) {
      list.push(
        Mock.mock({
          id: '@increment',
          name: Mock.mock('@cname'),
          username: Mock.mock('@last'),
          type: [0, 2],
          checkbox: [0, 1],
          'number|0-100': 0,
          datetime: 1532932422071,
          'sex|0-1': 0,
          moreselect: [0, 1],
          grade: 0,
          address: Mock.mock('@cparagraph(1, 3)'),
          check: [1, 3, 4]
        })
      )
    }
    return {
      data: {
        total: 11,
        pageSize: 10,
        tableData: list
      }
    }
  })

  Mock.mock('/api/test/dic', 'get', () => {
    return {
      success: true,
      data: {
        level: {
          0: '恢复',
          1: '信息',
          2: '告警',
          3: '故障',
          4: '事故',
          '-1': '未分类'
        },
        status: {
          0: '待发送',
          1: '发送中',
          2: '失败',
          3: '成功'
        }
      },
      desc: ''
    }
  })
  // Mock.mock('/receive/confs/monitor-source', 'get', () => {
  //   let list = []
  //   for (let i = 0; i < 5; i++) {
  //     list.push(
  //       Mock.mock({
  //         conf: '{"webHook":"http://localhost:8090/broker/zabbix/Root/781E59E1964046E9A5E71111D56CDAFB"}',
  //         counts: 0,
  //         createTime: '2021-08-18 17:47:34',
  //         id: '@increment',
  //         modifyTime: '2021-08-18 17:47:34',
  //         name: Mock.mock('@cname'),
  //         owner: 'admin',
  //         type: ['huaweicloud', 'alicloud', 'zabbix'],
  //         moreselect: [0, 1],
  //         grade: 0,
  //         address: Mock.mock('@cparagraph(1, 3)'),
  //         check: [1, 3, 4]
  //       })
  //     )
  //   }
  //   return {
  //     success: true,
  //     data: {
  //       total: 11,
  //       pageSize: 10,
  //       rows: list
  //     },
  //     desc: ''
  //   }
  // })
}
