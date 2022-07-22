// 监控源数据
export const MONITOR_DATA = {
  //zabbix侧栏信息
  zabbix: {
    icon: require('@/assets/images/access/logos/zabbix.png'),
    title: 'Zabbix',
    Mdata: [
      {
        TLevel: 'Disaster',
        WLevel: '事故'
      },
      {
        TLevel: 'High',
        WLevel: '故障'
      },
      {
        TLevel: 'Average | Warning',
        WLevel: '告警'
      },
      {
        TLevel: 'Information',
        WLevel: '信息'
      },
      {
        TLevel: 'RESOLVED',
        WLevel: '恢复'
      },
      {
        TLevel: 'Not classified',
        WLevel: '未分类'
      }
    ],
    //必需字段，判断是否要第二个表格
    hasEData: false
  },
  alicloud: {
    icon: require('@/assets/images/access/logos/alicloud.png'),
    title: '阿里云',
    Mdata: [
      {
        TLevel: 'Critical',
        WLevel: '事故'
      },
      {
        TLevel: 'warn',
        WLevel: '告警'
      },
      {
        TLevel: 'info',
        WLevel: '信息'
      }
    ],
    hasEdata: true,
    Edata: [
      {
        TLevel: 'Critical',
        WLevel: '事故'
      },
      {
        TLevel: 'warn',
        WLevel: '告警'
      },
      {
        TLevel: 'info',
        WLevel: '信息'
      }
    ]
  },
  tencentcloud: {
    icon: require('@/assets/images/access/logos/tencentcloud.png'),
    title: '腾讯云',
    Mdata: [
      {
        TLevel: '告警',
        WLevel: '告警'
      },
      {
        TLevel: '恢复',
        WLevel: '恢复'
      }
    ],
    hasEdata: true,
    Edata: [
      {
        TLevel: '严重（其他事件）',
        WLevel: '事故'
      },
      {
        TLevel: '告警（事件为“机器重启”，“主备切换”，“只读副本故障切换”）',
        WLevel: '告警'
      }
    ]
  },
  prometheus: {
    icon: require('@/assets/images/access/logos/prometheus.png'),
    title: 'Prometheus',
    Mdata: [
      {
        TLevel: '其他',
        WLevel: '告警'
      },
      {
        TLevel: 'resolved',
        WLevel: '恢复'
      }
    ],
    hasEData: false
  },
  huaweicloud: {
    icon: require('@/assets/images/access/logos/huaweicloud.png'),
    title: '华为云',
    Mdata: [
      {
        TLevel: '紧急',
        WLevel: '事故'
      },
      {
        TLevel: '重要',
        WLevel: '故障'
      },
      {
        TLevel: '次要',
        WLevel: '告警'
      },
      {
        TLevel: '提示',
        WLevel: '信息'
      }
    ],
    hasEData: false
  },
  blueking: {
    icon: require('@/assets/images/access/logos/blueking.png'),
    title: '蓝鲸智云',
    Mdata: [
      {
        TLevel: '致命',
        WLevel: '故障'
      },
      {
        TLevel: '预警',
        WLevel: '告警'
      },
      {
        TLevel: '提醒',
        WLevel: '信息'
      }
    ],
    hasEData: false
  },
  azure: {
    icon: require('@/assets/images/access/logos/azure.png'),
    title: '微软云',
    Mdata: [
      {
        TLevel: '严重',
        WLevel: '事故'
      },
      {
        TLevel: '错误',
        WLevel: '故障'
      },
      {
        TLevel: '警告',
        WLevel: '告警'
      },
      {
        TLevel: '信息性、详细',
        WLevel: '信息'
      }
    ],
    hasEData: false
  },
  aws: {
    icon: require('@/assets/images/access/logos/aws.png'),
    title: '亚马逊云',
    Mdata: [
      {
        TLevel: '无',
        WLevel: '事故'
      },
      {
        TLevel: '无',
        WLevel: '故障'
      },
      {
        TLevel: '警告',
        WLevel: '告警'
      },
      {
        TLevel: '无',
        WLevel: '信息'
      }
    ],
    hasEData: false
  },
  google: {
    icon: require('@/assets/images/access/logos/google.png'),
    title: '谷歌云',
    Mdata: [
      {
        TLevel: '无',
        WLevel: '事故'
      },
      {
        TLevel: '无',
        WLevel: '故障'
      },
      {
        TLevel: '警告',
        WLevel: '告警'
      },
      {
        TLevel: '无',
        WLevel: '信息'
      }
    ],
    hasEData: false
  },
  baiducloud: {
    icon: require('@/assets/images/access/logos/baiducloud.png'),
    title: '百度云',
    Mdata: [
      {
        TLevel: '严重',
        WLevel: '事故'
      },
      {
        TLevel: '重要',
        WLevel: '故障'
      },
      {
        TLevel: '警告',
        WLevel: '告警'
      },
      {
        TLevel: '通知',
        WLevel: '信息'
      }
    ],
    hasEData: false
  },
  ksyun: {
    icon: require('@/assets/images/access/logos/ksyun.png'),
    title: '金山云',
    Mdata: [
      {
        TLevel: '无',
        WLevel: '事故'
      },
      {
        TLevel: '无',
        WLevel: '故障'
      },
      {
        TLevel: '告警',
        WLevel: '告警'
      },
      {
        TLevel: '无',
        WLevel: '信息'
      }
    ],
    hasEData: false
  },
  grafana: {
    icon: require('@/assets/images/access/logos/grafana.png'),
    title: 'grafana',
    Mdata: [
      {
        TLevel: '无',
        WLevel: '事故'
      },
      {
        TLevel: '无',
        WLevel: '故障'
      },
      {
        TLevel: 'alerting',
        WLevel: '告警'
      },
      {
        TLevel: '无',
        WLevel: '信息'
      }
    ],
    hasEData: false
  }
}
