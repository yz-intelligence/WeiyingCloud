<template>
  <div>
    <div v-if="type !== 'zabbix'" class="detail-webhhok">
      <el-input v-model="webHook" placeholder="" readonly size="small">
        <span slot="prepend">WebHook</span>
      </el-input>
      <el-Button type="primary" @click="copy()" size="small">复制</el-Button>
    </div>

    <!------------------------------- Zabbix配置信息 ------------------------------------------------------------------>
    <div class="detail-main" v-if="type === 'zabbix'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">一、切换到zabbix脚本目录 ：<br /></p>
      <pre id="code">
      cd /usr/local/zabbix-server/share/zabbix/alertscripts
      </pre>
      如果不存在，则进入这个目录<br />
      <pre id="code">
      cd /usr/lib/zabbix/alertscripts
      </pre>
      二、获取weiyingCloud 配置包：<br />
      <pre id="code">
      wget {{lohref}}/repo/install/zabbix/zabbix_auto.tar.gz<br>
      </pre>
      三、解压、安装。<br />
      <pre id="code">
      tar -xzf zabbix_auto.tar.gz <br>
      cd weiyingCloud/bin <br>
      bash install.sh <strong style="color:red">{{this.$store.getters.user.companyId}} {{uuid}}</strong> <br></pre>
      注：<br />
      1、在安装过程中根据安装提示，输入企业自身的zabbix管理地址（示例：http://zabbix.server.com/zabbix）、管理员用户名、密码。<br />
      2、当提示"安装成功"时表示安装成功！<br />
      3、如zabbix服务采用容器部署，请确认容器内已安装curl命令。<br />
      <br />
      验证告警集成<br />
      产生新的zabbix告警(problem)，动作状态为“已送达”表示集成成功。<br />
      针对zabbix3.X版本 请保证运行zabbix服务的权限和weiyingCloud 探针目录的权限保持一致。<br />
      如果zabbix服务运行的权限为zabbix用户，weiyingCloud
      探针目录权限为root，就会出现zabbix产生告警调用weiyingCloud时无法正常写日志的情况。<br />
    </div>

    <!----------------------------------------阿里云配置信息 ------------------------------------------------------------------>
    <div class="detail-main" v-if="type === 'alicloud'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">
        1、填写应用名称，点击保存生成appKey<br />
        2、将回调连接填写到阿里云控制台=>
        <a
          href="https://cloudmonitor.console.aliyun.com/?spm=5176.12818093.ProductAndService--ali--widget-home-product-recent.dfa0.5adc16d0r5I1NG#/alarmservice/product=&searchValue=&searchType=&searchProduct="
          target="_blank"
        >
          云监控 </a
        >=>主机监控=>
        <a
          href="https://cloudmonitor.console.aliyun.com/?spm=5176.12818093.ProductAndService--ali--widget-home-product-recent.dfa0.5adc16d0r5I1NG#/alarmservice/product=&searchValue=&searchType=&searchProduct="
          target="_blank"
        >
          报警规则
        </a>
        =>修改页面，在报警回调中填入:<br />
        <strong style="color: red; word-break: break-all">{{ this.webHook }}</strong> <br />
        点击确认即可。<br />
        <img class="detail-img-main-small" src="@/assets/images/access/alicloud-1.png" />
      </p>
    </div>

    <!--------------------------------------- 腾讯云配置信息 ------------------------------------------------------------------->
    <div class="detail-main" v-if="type === 'tencentcloud'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">
        1、进入
        <a href="https://console.cloud.tencent.com/monitor/overview" target="_blank"> 云监控控制台 </a>
        ==>
        <a href="https://console.cloud.tencent.com/monitor/alarm2/notice" target="_blank"> 通知模板。 </a>
        <br />
        2、单击【新建】，进入新建通知模板界面，在[通知操作]的接口回调中填写告警回调URL。<br />
        3、进入 告警策略列表，单击需要绑定告警回调的策略名称，进入管理告警策略页，并在告警策略页单击通知模板。<br />
        4、当 HTTP 返回 200为验证成功。当回调 URL 验证成功后，云监控会将告警消息通过 HTTP 的 POST 请求推送您系统的 URL
        地址，您可以参考 告警回调参数说明，对推送的告警信息做进一步的处理。<br />
        5、在下面的界面的接口回调中输入webhook地址。<br />
        <strong style="color: red; word-break: break-all">{{ this.webHook }}</strong
        ><br />
        <img class="detail-img-main-small" src="@/assets/images/access/tencentcloud-1.png" />
      </p>
    </div>

    <!----------------------------------- Prometheus配置信息 ------------------------------------------------------------------>
    <div class="detail-main" v-if="type === 'prometheus'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">
        1、修改alertmanager模块的配置文件，通过webhook方式通知维鹰云，编辑告警的配置文件，新增webhook_configs及以下内容。<br />
      </p>
      <pre id="code">
      - name: 'team-X-pager'<br>
      webhook_configs:<br>
      - url: '<strong style="color:red">{{this.webHook}}</strong>'<br>
      send_resolved: true <br>
      </pre>
      2、重新启动alertmanager模块，并加载该配置文件。<br />
    </div>

    <!--------------------------------------- 蓝鲸云配置信息 ------------------------------------------------------------------->
    <div class="detail-main" v-if="type === 'blueking'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">
        1、点击复制按钮，复制上面的webhook。 <br />
        2、将webhook链接填写到 监控平台 ==> 告警组 ==> 回调地址，然后在告警策略中选择该告警组。
        <br />
        <img class="detail-img-main" src="@/assets/images/access/blueking-1.png" />
      </p>
    </div>

    <!--------------------------------------- 华为云配置信息 ------------------------------------------------------------------->
    <div class="detail-main" v-if="type === 'huaweicloud'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">
        1、进入华为云官网，搜索产品“<a href="https://console.huaweicloud.com/ces" target="_blank"> 云监控 </a
        >”，点击进入->点击立即使用-> 点击告警规则 -> 创建告警规则在-> 创建告警规则界面，点击发送通知，点击创建主题。
        <br />
        <img class="detail-img-main" src="@/assets/images/access/huaweicloud-1.png" />
        <img class="detail-img-main-small" src="@/assets/images/access/huaweicloud-2.png" />
        <br />
        2、主题创建成功后->点击添加订阅->选择协议http，在终端中添加相应webhook地址->URL格式：
        <br />
        <strong style="color: red">{{ this.webHook }}</strong>
        <br />
        3、在列表中点击订阅->请求订阅，维鹰云将自动确认，刷新订阅列表此时订阅列表将变为已确认，此时发生告警就可以推送到添加的webhook。
        <br />
        <img class="detail-img-main" src="@/assets/images/access/huaweicloud-3.png" />
        <br />
      </p>
    </div>

    <!--------------------------------------- 微软云配置信息 ------------------------------------------------------------------->
    <div class="detail-main" v-if="type === 'azure'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">
        1、点击复制按钮，复制上面的 webhook
        <br />
        2、将 webhook 链接填写到微软云所有服务 -> 警报 -> 管理操作 ->
        <a
          href="https://portal.azure.com/?quickstart=true - blade/Microsoft_Azure_Monitoring/NotificationGroupsBlade/queryInputs/{"
          target="_blank"
        >
          操作组
        </a>
        -> 操作类型中的URL。然后在微软云所有服务 -> 警报 ->
        <a
          href="https://portal.azure.com/?quickstart=true - blade/Microsoft_Azure_Monitoring/AlertsManagementSummaryBlade"
          target="_blank"
        >
          创建/管理警报规则
        </a>
        -> 操作，选择该操作组。
        <br />
        <img class="detail-img-main" src="@/assets/images/access/azure-1.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/azure-2.png" />
        <br />
      </p>
    </div>

    <!--------------------------------------- 亚马逊云配置信息 ------------------------------------------------------------------->
    <div class="detail-main" v-if="type === 'aws'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">
        1、点击复制按钮，复制上面的webhook。
        <br />
        2、打开亚马逊云
        <a href="https://us-east-2.console.aws.amazon.com/cloudwatch/home?region=us-east-2#home:" target="_blank">
          AWS管理控制台 </a
        >，进入
        <a href="https://us-east-2.console.aws.amazon.com/sns/v3/home?region=us-east-2#/topics" target="_blank">
          Simple Notification Service </a
        >->主题->新建主题
        <br />
        （1）创建告警主题
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-1.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-2.png" />
        <br />
        （2）根据需要选择类型，填写名称，下拉点击创建主题
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-3.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-4.png" />
        <br />
        （3）为主题创建订阅（增加告警规则），选择HTTPS，在终端节点填入复制的webhook链接，然后点击创建订阅
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-5.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-6.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-7.png" />
        <br />
        （4）回到主题页面，稍等一会订阅状态变成已确认，第一部分工作完成
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-8.png" />
        <br />
        3、第二部分，为实例增加
        <a
          href="https://us-east-2.console.aws.amazon.com/sns/v3/home?region=us-east-2#/create-subscription"
          target="_blank"
        >
          告警规则
        </a>
        <br />
        （1）打开AWS管理控制台，点击 EC2，右击对应实例，点击管理CloudWatch警报
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-9.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-10.png" />
        <br />
        （2）选择创建警报或者编辑警报，在警报通知选择前面创建的主题，根据需求配置告警规则，点击创建
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-11.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-12.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-13.png" />
        <br />
        （3）回到实例列表，稍后警报状态将会更新
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-14.png" />
        <br />
        （4）点击警报状态可以查看刚刚创建的警报
        <br />
        <img class="detail-img-main" src="@/assets/images/access/aws-15.png" />
        <br />
        （5）至此，维鹰云成功接入亚马逊云监控
        <br />
      </p>
    </div>

    <!--------------------------------------- 谷歌云配置信息 ------------------------------------------------------------------->
    <div class="detail-main" v-if="type === 'google'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">
        1、点击复制按钮，复制上面的webhook。
        <br />
        2、将webhook链接填写到
        <a href="https://console.cloud.google.com/home/dashboard" target="_blank"> 谷歌云控制台 </a
        >->监控->提醒->编辑通知渠道（EDIT NOTIFICATION CHANNELS）->Webhooks ADD NEW中的EndPoint URL。然后回到提醒->
        <a href="https://console.cloud.google.com/monitoring/alerting/policies/create" target="_blank">
          创建提醒政策（CREATE POLICY）</a
        >， 或在已创建的提醒政策上，选择上述的通知渠道。
        <br />
        <br />
        （1）进入谷歌监控平台
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-1.png" />
        <br />
        （2）点击提醒
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-2.png" />
        <br />
        （3）点击EDIT NOTIFICATION CHANNELS （增加通知渠道）
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-3.png" />
        <br />
        （4）选择Webhooks 点击 ADD NEW输入从维鹰云智能事件平台复制来的Webhook链接
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-4.png" />
        <br />
        （5）点击 TEST CONNECTION，然后点击 SAVE保存即可。
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-5.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-6.png" />
        <br />
        （6）回到提醒，点击 CREATE POLICY创建告警政策（规则）
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-7.png" />
        <br />
        （7）点击 ADD CONDITION设置告警阈值
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-8.png" />
        <br />
        （8）设置告警阈值，然后点击 ADD按钮
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-9.png" />
        <br />
        （9）点击下一步，选择前面创建的通知渠道，点击NEXT输入提醒名称，点击SAVE完成接入。
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-10.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-11.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/google-12.png" />
        <br />
      </p>
    </div>

    <!--------------------------------------- 百度云配置信息 ------------------------------------------------------------------->
    <div class="detail-main" v-if="type === 'baiducloud'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">
        1、点击复制按钮，复制上面的webhook。
        <br />
        2、（1）打开百度智能云的
        <a href="https://console.bce.baidu.com/bcm/#/bcm/overview" target="_blank"> 云监控BCM </a>
        ，进入报警管理->报警策略，然后点击
        <a href="https://console.bce.baidu.com/bcm/#/bcm/alarm/create/index~from=overall" target="_blank"> 添加策略 </a>
        <br />
        <img class="detail-img-main" src="@/assets/images/access/baiducloud-1.png" />
        <br />
        （2）填写完策略信息后，在策略的最下面勾选开启报警回调，选择 HTTPS ，然后填入前面复制的链接，同时把链接开头的
        https:// 删除，点击完成，即可接入。
        <br />
        <img class="detail-img-main" src="@/assets/images/access/baiducloud-2.png" />
        <br />
        <img class="detail-img-main" src="@/assets/images/access/baiducloud-3.png" />
        <br />
        <br />
      </p>
    </div>

    <!--------------------------------------- 金山云配置信息 ------------------------------------------------------------------->
    <div class="detail-main" v-if="type === 'ksyun'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">
        1、点击复制按钮，复制上面的webhook。
        <br />
        2、（1）打开金山云的
        <a href="https://console.ksyun.com/#/home/Operation" target="_blank"> 云监控 </a>
        ，进入告警服务->告警策略，然后点击
        <a href="https://monitor.console.ksyun.com/#!/monitor/alarmServer/rule/create/0" target="_blank">
          新建告警策略
        </a>
        <br />
        <img class="detail-img-main" src="@/assets/images/access/ksyun-1.png" />
        <br />
        （2）根据实际情况配置告警规则
        <br />
        <img class="detail-img-main" src="@/assets/images/access/ksyun-2.png" />
        <br />
        （3）根据实际情况选择实例
        <br />
        <img class="detail-img-main" src="@/assets/images/access/ksyun-3.png" />
        <br />
        （4）把复制的链接填写到 告警回调 ，点击确定，完成接入。
        <br />
        <img class="detail-img-main" src="@/assets/images/access/ksyun-4.png" />
        <br />
        <br />
      </p>
    </div>

    <!--------------------------------------- grafana配置信息 ------------------------------------------------------------------->
    <div class="detail-main" v-if="type === 'grafana'">
      <div>
        <p class="text-title">配置步骤</p>
      </div>
      <p class="text-content">
        1、点击复制按钮，复制上面的webhook。
        <br />
        2、（1）打开Grafana，进入Notification Channel
        <br />
        <img class="detail-img-main" src="@/assets/images/access/grafana-1.png" />
        <br />
        （2）点击 New channel
        <br />
        <img class="detail-img-main" src="@/assets/images/access/grafana-2.png" />
        <br />
        （3）填写Name，并在 Type选择webhook
        <br />
        <img class="detail-img-main" src="@/assets/images/access/grafana-3.png" />
        <br />
        （4）推荐勾选上 Send on all alerts
        <br />
        <img class="detail-img-main" src="@/assets/images/access/grafana-4.png" />
        <br />
        （5）将复制的webhook链接填写到 Url 中
        <br />
        <img class="detail-img-main" src="@/assets/images/access/grafana-5.png" />
        <br />
        （6）Send Test，然后Save
        <br />
        <img class="detail-img-main" src="@/assets/images/access/grafana-6.png" />
        <br />
        （7）在各个指标的 Notifications可以看到新添加的channel，如果没有，可点“+”手动添加。
        <br />
        <img class="detail-img-main" src="@/assets/images/access/grafana-7.png" />
        <br />
        特别提醒：
        <br />
        如无法正常接收事件，请前往Grafana检查对应监控指标界面是否出现以下错误提示，并按提示配置Grafana。
        <br />
        <img class="detail-img-main" src="@/assets/images/access/grafana-8.png" />
        <br />
        <br />
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AccessDetailMain',
  props: {
    webHook: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    lohref: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uuid: this.webHook.split('/').pop()
    }
  },
  methods: {
    copy() {
      let input = document.createElement('input') // js创建一个input输入框
      input.value = this.webHook // 将需要复制的文本赋值到创建的input输入框中，this.ruleForm.url这个是我要复制的内容
      document.body.appendChild(input) // 将输入框暂时创建到实例里面
      input.select() // 选中输入框中的内容
      document.execCommand('Copy') // 执行复制操作
      document.body.removeChild(input)
      this.$Message.success('复制成功')
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-webhhok {
  display: flex;
  padding: 10px;
  .el-input {
    margin-right: 10px;
  }
}
.detail-main {
  padding: 10px;
  a {
    text-decoration: none;
    color: #0076ff;
  }
}
.text-title {
  font-size: 14px;
  font-weight: bolder;
  padding-bottom: 10px;
}
.text-content {
  font-size: 14px;
  font-weight: 400;
}
.detail-img-main {
  padding: 10px 0;
  width: 90%;
  &-small {
    width: 60%;
  }
}

code,
pre {
  padding: 16px;
  margin: 0;
  font-size: 90%;
  color: #bd4147;
  background-color: #f8f9fa;
  border-radius: 0.25rem;
  word-break: break-all;
  white-space: normal;
}
</style>
