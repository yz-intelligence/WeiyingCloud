<!-- eslint-disable -->
<template>
  <div class="container">
    <div
    v-if="form.emailType === 0"
      class="main"
      style="
        display: flex;
        flex-direction: column;
        max-width: 937px;
        width: 100%;
        margin: 0 auto;
        word-wrap: break-word;
        white-space: normal;
        border: 1px solid rgba(139, 138, 138, 0.5);
        border-radius: 8px;
      "
    >
      <div
        class="header"
        style="
          display: flex;
          width: 100%;
          border-bottom: 1px solid rgba(139, 138, 138, 0.5);
        "
      >
        <img
          style="display: block; margin: 15px 30px; width: 127px; height: 49px"
          src="data:image/png;base64,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"
          alt="维鹰云"
        />
      </div>
      <div
        class="content"
        style="display: flex; flex-direction: column; padding: 20px 40px"
      >
        <!-- 标题 -->
        <div
          class="title"
          style="display: flex; width: 100%; margin-bottom: 20px"
        >
          <!-- 标题图标 -->
          <img
            style="
              height: 36px;
              width: auto;
              min-width: 60px;
              flex-shrink: 0;
              margin-right: 16px;
            "
            referrerpolicy="no-referrer"
            src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iOTZweCIgaGVpZ2h0PSIzNnB4IiB2aWV3Qm94PSIwIDAgOTYgMzYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5ZGK6K2mPC90aXRsZT4KICAgIDxnIGlkPSJwY+erryIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IueUu+advyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc4LjAwMDAwMCwgLTIwMC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IuWRiuitpiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzguMDAwMDAwLCAyMDAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiBmaWxsPSIjRUZFMDQxIiBvcGFjaXR5PSIwLjEiIHg9IjAiIHk9IjAiIHdpZHRoPSI5NiIgaGVpZ2h0PSIzNiIgcng9IjQiPjwvcmVjdD4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtNDkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDguMDAwMDAwLCA0LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUtQ29weS03IiBmaWxsPSIjNDQ0NDQ0IiBvcGFjaXR5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjwvcmVjdD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNC4yNDc2NzI5NSwxNi43MzczNTI5IEw0LjI2NzQyMjc3LDE2LjgzNzk4MzMgQzUuMTMzODA2NDksMjAuODYzMDk2OSA4Ljc1OTM4NTQ4LDIzLjgxNjE3NjUgMTMuMDAwODE5MSwyMy44MTYxNzY1IEwxMy4wMDA4MTkxLDIzLjgxNjE3NjUgTDEzLjM4NDY0NzgsMjMuODA4MDkzNiBMMTMuNzY0NzI1NSwyMy43ODQwNTQ0IEMxNy42NzE1ODIxLDIzLjQ1NDI4OTcgMjAuOTIwMzM5OSwyMC42MTkxNTA2IDIxLjczNDIxNTUsMTYuODM3OTgzMyBMMjEuNzM0MjE1NSwxNi44Mzc5ODMzIEwyMS43NTIzMjcxLDE2LjczNzM1MjkgTDI0LDE2LjczNzM1MjkgTDIzLjkzMjM0NDIsMTcuMTMwMDM5MSBDMjIuOTIxNjg2NiwyMi4yMjQzNTcxIDE4LjM3MjQxOTcsMjYgMTMuMDAwODE5MSwyNiBMMTMuMDAwODE5MSwyNiBMMTIuNjA5MjgyMiwyNS45OTMyOTc0IEwxMi4yMDEwOTA1LDI1Ljk3MTk1NDkgQzcuMDU0MDIzMTIsMjUuNjA5ODM0MSAyLjgxNjY3Nzg5LDIxLjc3OTkxMjkgMi4wMDE2OTgwNSwxNi43NTQ5NjY0IEwyLjAwMTY5ODA1LDE2Ljc1NDk2NjQgTDIsMTYuNzM3MzUyOSBMNC4yNDc2NzI5NSwxNi43MzczNTI5IFogTTEzLjAwMDgxOTEsNCBMMTMuMzkyMzU2MSw0LjAwNjcwMjU2IEwxMy44MDA1NDc3LDQuMDI4MDQ1MDUgQzE4Ljk0NzYxNTEsNC4zOTAxNjU4NyAyMy4xODQ5NjA0LDguMjIwMDg3MDcgMjQsMTMuMjQ1MDMzNiBMMjQsMTMuMjQ1MDMzNiBMMjQsMTMuMjYxMDI5NCBMMjEuNzUyMzI3MSwxMy4yNjEwMjk0IEwyMS43MjM5NDIxLDEzLjExNTMzMTMgQzIxLjI5NzcwNzgsMTEuMTkwMTY5NSAyMC4yMjUwNjAzLDkuNDY1NTA0MDEgMTguNjkwMDAzNyw4LjIwOTUyMjQzIEwxOC42OTAwMDM3LDguMjA5NTIyNDMgTDE4LjM5MTIyMTEsNy45NjUwNTg4OCBMMTUuMjAwMTk3NCwxMy40MjIzNDg5IEwxNS4yMDAzNjE0LDEzLjc0NjE2ODcgTDE1LjMyMDc0NDUsMTMuOTc4Nzg2NCBDMTUuNDY0NDE3NywxNC4yOTY0MTU4IDE1LjU0MDA5OTgsMTQuNjQyNTEyMyAxNS41NDAwOTk4LDE1IEMxNS41NDAwOTk4LDE2LjM4NDc3MjggMTQuNDAzMjI1MSwxNy41MDczNTI5IDEzLjAwMDgxOTEsMTcuNTA3MzUyOSBDMTEuNTk4NDEzMSwxNy41MDczNTI5IDEwLjQ2MTUzODUsMTYuMzg0NzcyOCAxMC40NjE1Mzg1LDE1IEMxMC40NjE1Mzg1LDEzLjYxNTIyMjIgMTEuNTk4NDE4MSwxMi40OTI2NDczIDEzLjAwMDg1NCwxMi40OTI2NDkgTDEzLjAwMDg1NCwxMi40OTI2NDkgTDEzLjI4NDYwMDgsMTIuMzMwODk0NyBMMTYuNDc3NjMzMiw2Ljg3MDQwODEyIEwxNi4xMTQ3NzAyLDYuNzM2NzA4NDIgTDE1LjY4NzU1NDcsNi41OTE0MzM4IEMxNC44MjU5NDg2LDYuMzIyNTExODggMTMuOTIyNTg4NSw2LjE4MzgyMzUzIDEzLjAwMDgxOTEsNi4xODM4MjM1MyBMMTMuMDAwODE5MSw2LjE4MzgyMzUzIEwxMi42MTY5OTA1LDYuMTkxOTA2MzkgTDEyLjIzNjkxMjgsNi4yMTU5NDU2MSBDOC4zMzAwNTYxNSw2LjU0NTcxMDI1IDUuMDgxMjk4MzgsOS4zODA4NDkzOSA0LjI2NzQyMjc3LDEzLjE2MjAxNjcgTDQuMjY3NDIyNzcsMTMuMTYyMDE2NyBMNC4yNDc2NzI5NSwxMy4yNjEwMjk0IEwyLDEzLjI2MTAyOTQgTDIuMDY5Mjk0MDEsMTIuODY5OTYwOSBDMy4wNzk5NTE2NCw3Ljc3NTY0Mjk0IDcuNjI5MjE4NTksNCAxMy4wMDA4MTkxLDQgTDEzLjAwMDgxOTEsNCBaIiBpZD0i5b2i54q257uT5ZCIIiBmaWxsPSIjRUZFMDQxIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8dGV4dCBmb250LWZhbWlseT0iUGluZ0ZhbmdTQy1SZWd1bGFyLCBQaW5nRmFuZyBTQyIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgZmlsbD0iI0VGRTA0MSI+CiAgICAgICAgICAgICAgICAgICAgPHRzcGFuIHg9IjM4IiB5PSIyNSI+5ZGK6K2mPC90c3Bhbj4KICAgICAgICAgICAgICAgIDwvdGV4dD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
          />
          <span
            style="
              font-size: 24px;
              word-break: break-all;
              line-height:1.5;
              color: #444f5a;
              font-weight: 600;
            "
            >{{ isRepeat ? data.repeatTitle : data.title }}</span
          >
        </div>
        <!-- 描述 -->
        <div
          class="desc"
          style="
            margin-bottom: 12px;
            font-size: 16px;
            color: rgba(68, 79, 90, 0.7);
            word-break: break-all;
          "
        >
        您好，收到告警级别事件，事件详情如下
        </div>
        <!-- 第三层 -->
        <div
          class="content-wrap"
          style="
            display: flex;
            flex-direction: column;
            padding: 16px;
            line-height: 1.8;
            background-color: RGBA(242, 248, 255, 1);
            white-space:pre-wrap;
            border-radius: 8px;
          "
        >{{ isRepeat ? data.repeatContent : data.content }}</div>
        <template v-if="isRepeat">
          <div style="margin-top:20px">
            <span 
              style="
                font-size: 16px;
                color: #000;
                letter-spacing: 0;
              "
            >降噪条件比例</span>
            <div 
              style="
                margin-top:12px;
                font-size: 16px;
                color: #444F5A;
                opacity: 0.7;
                letter-spacing: 0;
                white-space:pre-wrap;
                line-height: 24px;
              "
            >{{ condition }}</div>
          </div>
           <div style="margin-top:20px">
            <span 
              style="
                font-size: 16px;
                color: #000;
                letter-spacing: 0;
              "
            >事件列表</span>
            <div 
              style="
                margin-top:12px;
                font-size: 16px;
                color: #444F5A;
                letter-spacing: 0;
                opacity: 0.7;
                white-space:pre-wrap;
                line-height: 24px;
              "
            >{{ list }}</div>
            <a
            class="word24"
            style="
              display:block;
              color: rgba(0, 118, 255, 1);
              padding: 0 6px;
              font-size:16px;
              text-decoration: none;
            "
            target="_blank"
            href="/eventbank/event/realtime"
            >查看更多</a
          >
          </div>
        </template>
        <div
          class="word22"
          style="color: rgba(68, 79, 90, 0.7); margin: 20px 0; font-size: 16px"
        >进入维鹰云分析<a
            class="word24"
            style="
              color: rgba(0, 118, 255, 1);
              padding: 0 6px;
              font-weight: 600;
              text-decoration: none;
            "
            target="_blank"
            href="/eventbank/event/realtime"
            >处理事件</a
          >
        </div>
        <div
          class="txt17"
          style="
            color: rgba(68, 79, 90, 0.7);
            margin-bottom: 20px;
            font-size: 16px;
          "
        >
        此致！
        </div>
        <div
          class="word23"
          style="
            color: rgba(68, 79, 90, 1);
            padding-bottom: 20px;
            font-size: 16px;
            font-weight: 600;
          "
        >
        维鹰云团队
        </div>
      </div>
      <div
        class="footer"
        style="
          box-sizing: border-box;
          text-align: center;
          font-size: 14px;
          padding: 20px;
          width: 100%;
          color: rgba(68, 79, 90, 0.7);
          border-top: 1px solid rgba(139, 138, 138, 0.5);
        "
      >
      本邮件由系统自动发送，请勿回复，如有任何疑问或建议，欢迎拨打客服电话18664353161
      </div>
    </div>
    <!-- 纯文本 -->
    <div style="word-break: break-word; white-space: pre-line;" v-else>
      {{isRepeat ? data.repeatContent : data.content }}
      
      {{ isRepeat ? '降噪条件比例' : '' }}
      <template v-if="isRepeat">
        <br/>
        <br/>
        <b>降噪条件比例</b>
        <br />
        {{ condition }}
        <br />
        <br />
        <b>事件列表</b>
        <br />
        {{ list }}
      </template>
    </div>
  </div>
</template>

<script>
import { matchAndReplaceStrByDict } from './temp-dictionary'
export default {
  name: 'TempPreviewEmail',
  props: {
    form: {
      type: Object,
      require: true
    },
    isRepeat: Boolean
  },
  computed: {
    data() {
      return this.form2Data(this.form)
    }
  },
  data() {
    return {
      list: `1、故障 | CPU system time | Zabbix server-15654,当前值：1.54 % 
2、故障 | CPU system time | Zabbix server-15654,当前值：1.54 % 
3、故障 | CPU system time | Zabbix server-15654,当前值：1.54 % 
4、故障 | CPU system time | Zabbix server-15654,当前值：1.54 % 
5、故障 | CPU system time | Zabbix server-15654,当前值：1.54 % 
6、故障 | CPU system time | Zabbix server-15654,当前值：1.54 % 
7、故障 | CPU system time | Zabbix server-15654,当前值：1.54 % 
8、故障 | CPU system time | Zabbix server-15654,当前值：1.54 % 
9、故障 | CPU system time | Zabbix server-15654,当前值：1.54 % 
10、故障 | CPU system time | Zabbix server-15654,当前值：1.54 %`,
      condition: `1、50% | 同监控指标（CPU utilization） 
2、20% | 同主机IP（126.12.1.12） 
3、20% | 模型 
4、10% | 其他`
    }
  },
  methods: {
    form2Data(form) {
      const { emailTitle, emailRepeatTitle, emailContent, emailRepeatContent } = form
      const title = matchAndReplaceStrByDict(emailTitle)
      const repeatTitle = matchAndReplaceStrByDict(emailRepeatTitle)
      const content = matchAndReplaceStrByDict(emailContent)
      const repeatContent = matchAndReplaceStrByDict(emailRepeatContent)
      console.log('emailContent', emailContent)
      console.log('content', content)
      return {
        title,
        content,
        repeatContent,
        repeatTitle
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
