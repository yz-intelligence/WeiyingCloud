<template>
  <div class="detail-aside">
    <!-- Zabbix侧边文案 -->
    <div v-if="accessType === 'zabbix'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        Zabbix 提供了一个网络和应用监控的开源解决方案，它支持数百万的监控指标。安装 Zabbix 应用可以将 Zabbix
        中的告警接入到维鹰云中来，自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。
      </p>
    </div>

    <div v-if="accessType === 'alicloud'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        阿里云是阿里巴巴旗下的云计算服务平台， 主要为中国客户提供云计算基础设施解决方案。
        维鹰云基于阿里云监控告警回调机制， 自动接入来自阿里云的告警信息，
        自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。
      </p>
    </div>

    <div v-if="accessType === 'tencentcloud'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        腾讯云是腾讯倾力打造的云计算品牌， 以卓越科技能力助力各行各业数字化转型，
        为全球客户提供领先的云计算、大数据、人工智能服务以及定制化行业解决方案。
        维鹰云基于腾讯云云监控告警回调机制，自动接入来自腾讯云的告警信息，
        自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。
      </p>
    </div>

    <div v-if="accessType === 'prometheus'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        Prometheus是一个开源的系统监控和报警的工具包，最初由SoundCloud发布。 安装 Prometheus 应用可以将 Prometheus
        中的告警接入到维鹰云中来， 自动帮您压缩冗余告警，避免告警风暴， 让您更快定位和解决问题。
      </p>
    </div>

    <div v-if="accessType === 'huaweicloud'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        华为云是华为的云服务品牌，致力于为全球客户提供领先的公有云服务。维鹰云基于华为云监控告警回调机制，
        自动接入来自华为云的告警信息， 自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。
      </p>
    </div>

    <div v-if="accessType === 'blueking'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        腾讯蓝鲸智云，简称蓝鲸，是腾讯互动娱乐事业群（Interactive Entertainment Group，简称
        IEG）自研自用的一套用于构建企业研发运营一体化体系的 PaaS 开发框架，提供了 aPaaS（DevOps
        流水线、运行环境托管、前后台框架）和 iPaaS（持续集成、CMDB、作业平台、容器管理、计算平台、AI
        等原子平台）等模块，帮助企业技术人员快速构建基础运营 PaaS。维鹰云基于蓝鲸智云监控告警回调机制，
        自动接入来自蓝鲸智云的告警信息， 自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。
      </p>
    </div>

    <div v-if="accessType === 'azure'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        微软云（Microsoft
        Azure）的主要目标是为开发者提供一个平台，帮助开发可运行在云服务器、数据中心、Web和PC上的应用程序。维鹰云基于微软云监控告警回调机制，
        自动接入来自微软云的告警信息， 自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题
      </p>
    </div>

    <div v-if="accessType === 'aws'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        亚马逊云服务（Amazon Web Services）是全球最全面、应用最广泛的云平台，从全球数据中心提供超过 200
        项功能齐全的服务。维鹰云基于亚马逊云监控告警回调机制， 自动接入来自亚马逊云的告警信息，
        自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。
      </p>
    </div>

    <div v-if="accessType === 'google'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        Google云端平台（Google Cloud
        Platform）是一系列由Google提供的云计算服务，在运行Google搜索和YouTube的服务器上提供基础设施服务、平台服务及无服务器计算环境。维鹰云基于谷歌云监控告警回调机制，
        自动接入来自谷歌云的告警信息， 自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。
      </p>
    </div>

    <div v-if="accessType === 'baiducloud'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        百度智能云端平台是一系列由百度公司提供的云计算服务，百度智能云以“云智一体”为核心赋能千行百业,致力于为企业和开发者提供全球领先的人工智能、大数据和云计算服务以及易用的开发工具,加速产业智能化升级。维鹰云基于百度智能云监控告警回调机制，
        自动接入来自百度智能云的告警信息， 自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。
      </p>
    </div>

    <div v-if="accessType === 'ksyun'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        金山云——金山集团旗下云计算企业，中国TOP3云计算公司。提供云计算、大数据、人工智能、边缘计算等服务。维鹰云基于金山云监控告警回调机制，
        自动接入来自金山云的告警信息， 自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。
      </p>
    </div>

    <div v-if="accessType === 'grafana'">
      <div class="img-logo"><img :src="Data[this.accessType].icon" /></div>
      <p class="text-content">
        Grafana是一个开源的，拥有丰富dashboard和图表编辑的指标分析平台。维鹰云基于Grafana监控告警回调机制，
        自动接入来自Grafana的告警信息， 自动帮您压缩冗余告警，避免告警风暴，让您更快定位和解决问题。
      </p>
    </div>

    <!-- 监控等级对应表格 -->
    <div class="match-table">
      <p class="text-title">{{ Data[this.accessType].title }}监控</p>
      <el-table :data="Data[this.accessType].Mdata">
        <el-table-column prop="TLevel" :label="Data[this.accessType].title + '等级'" align="center"> </el-table-column>
        <el-table-column prop="icon" label=" " align="center">
          <template
            ><div><i class="el-icon-back"></i><i class="el-icon-right"></i></div
          ></template>
        </el-table-column>
        <el-table-column prop="WLevel" label="维鹰云级别" align="center"></el-table-column>
      </el-table>
    </div>
    <!-- 监控事件对应表格 -->
    <div v-if="Data[this.accessType].hasEdata" class="match-table">
      <p class="text-title">{{ Data[this.accessType].title }}事件</p>
      <el-table :data="Data[this.accessType].Edata">
        <el-table-column prop="TLevel" :label="Data[this.accessType].title + '等级'" align="center"> </el-table-column>
        <el-table-column prop="icon" label=" " align="center">
          <template
            ><div><i class="el-icon-back"></i><i class="el-icon-right"></i></div
          ></template>
        </el-table-column>
        <el-table-column prop="WLevel" label="维鹰云级别" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AccessDetailAside',
  props: {
    accessType: { type: String, default: '' }
  },
  created() {
    // console.log(this.Data[this.accessType])
  },
  data() {
    return {
      Data: {
        //zabbix侧栏信息
        zabbix: {
          icon: require('@/assets/images/access/zabbix.png'),
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
          icon: require('@/assets/images/access/alicloud.png'),
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
          icon: require('@/assets/images/access/tencentcloud.png'),
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
          icon: require('@/assets/images/access/prometheus.png'),
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
          icon: require('@/assets/images/access/huaweicloud.png'),
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
          icon: require('@/assets/images/access/blueking.png'),
          title: '蓝鲸智云',
          Mdata: [
            {
              TLevel: '致命',
              WLevel: '事故'
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
          icon: require('@/assets/images/access/azure.png'),
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
          icon: require('@/assets/images/access/aws.png'),
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
          icon: require('@/assets/images/access/google.png'),
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
          icon: require('@/assets/images/access/baiducloud.png'),
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
          icon: require('@/assets/images/access/ksyun.png'),
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
          icon: require('@/assets/images/access/grafana.png'),
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
    }
  }
}
</script>
<style lang="scss" scoped>
.text-title {
  font-size: 14px;
  font-weight: bolder;
}
.text-content {
  font-size: 14px;
  font-weight: 400;
}
.img-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  img {
    height: 50px;
  }
}
.match-table {
  padding-top: 10px;
  p {
    padding-top: 20px;
    padding-bottom: 10px;
  }
}
</style>
