export const FIELD_DICT = {
  事件级别: '告警',
  事件标题: 'Host.cpu.totalUsed | xxxxxxxxxx',
  事件ID: '1234567890',
  事件内容: '告警 | acs_ecs | i-2zeioly8ub9dm2tbo52x | Host.cpu.totalUsed | $Average>=0.2 | 0.31 | 维鹰阿里云测试',
  事件对象: 'iZub9dm2tbo52xZ | i-2zeioly8ub9dm2tbo52x',
  监控源类型: 'Aliyun',
  有效性: '有效',
  首次告警: '2021-12-20 12:52:09',
  最近告警: '2021-12-20 12:52:09',
  恢复时间: '2021-12-20 12:52:09',
  关闭时间: '2021-12-20 12:52:09',
  入库时间: '2021-12-20 12:52:09',
  监控源: 'test',
  对象类型: 'acs_ecs',
  监控指标: 'Host.cpu.totalUsed',
  主机IP: '10.0.0.1',
  降噪主机IP: '10.0.0.1',
  区域: '华北2(北京)',
  告警策略: '维鹰阿里云测试',
  所属人员: '管理员',
  首要降噪条件: '同监控源+同监控指标+同事件对象',
  租户名称: '维鹰云管理员',
  告警信息: 'CPU负载过高',
  监控项目: '维鹰云事件平台',
  告警次数: '5'
}

/**
 * 根据字典匹配并根据字典替换匹配的的内容
 * @param {string} str 需要处理的字符串
 * @returns string
 */
export function matchAndReplaceStrByDict(str = '', dict = FIELD_DICT) {
  return str.replace(/\{([\w\u4e00-\u9fa5]+)\}/g, (match, field) => {
    const label = field.toUpperCase().trim()
    console.log('label', label)
    return dict[label] || str
  })
}
