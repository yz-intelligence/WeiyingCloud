![维鹰云](https://github.com/yz-intelligence/WeiyingCloud/blob/main/weiyingcloud_wiki/images/logo.png)

# 维鹰云智能事件平台

>访问 维鹰云产品官网（https://aiops.yz-intelligence.com/portal/） 了解产品完整信息。
>
>维鹰智能事件平台是一款依托人工智能和大数据技术，将各种云平台或监控工具产生的运维告警信息统一进行接收、降噪、分析、转派、处理的事件全生命周期管理产品，让运维团队彻底告别告警风暴。
>
>

## 前序准备

**环境要求：**

- Node.js 版本`v12.18.x`及以上
- npm 版本`v6.14.x`及以上

**技术栈**

- vue: `2.6.x`
- vuex: `3.4.x`
- vue-router: `3.2.x`
- vue-cli: `5.0.x`
- axios: `0.21.x`
- element-ui: `2.15.x`
- echarts: `5.1.x`

## 目录结构

```

├── public                          # 静态资源 (会被直接复制)
│   ├── favicon.ico                 # favicon图标
│   ├── index.html                  # html模板
│   └── static
├── src                             # 源代码
│   ├── App.vue                     # 入口页面
│   ├── apis                        # 所有请求
│   ├── assets                      # 图片/字体/全局样式
│   ├── components                  # 全局组件
│   ├── directive                   # 全局指令
│   ├── filters                     # 全局过滤函数
│   ├── main.js                     # 入口文件
│   ├── mixins                      # 混入（生命周期，方法等）   
│   ├── mock						# 模拟请求
│   ├── permission.js               # 权限管理  
│   ├── plugins                     # 插件
│   ├── router                      # 路由
│   ├── store                       # 全局 vuex store
│   ├── utils                       # 全局方法
│   └── views                       # 所有页面
│       ├── analysis                # 事件分析
│       ├── auth                    # 登录/注册
│       ├── event                   # 事件处理
│       ├── home					# 首页
│       ├── monitor                 # 监控源管理
│       ├── notice          	    # 事件订阅
│       ├── system					# 系统管理
│       └── user					# 用户管理
├── tests                           # 测试
├── vue.config.js                   # vue-cli 配置
├── CHANGELOG.md					# 更新日志
├── Dockerfile                      # docker镜像生成配置
├── babel.config.js                 # babel-loader 配置
├── changelog.config.js             # changelog配置
├── commitlint.config.js            # git提交信息配置
├── jest.config.js                  # jest 单元测试配置
├── jsconfig.json                   # javascript 配置
└── package.json                    # package.json 依赖
```



###  业务路由&功能

```nginx
 # 公共
/home                 首页
/user/mine            个人中心
/login                登录
/register             注册
/password-reset       密码重置

 # 监控源管理 
/monitor/access       监控源接入
/monitor/maintenance  维护期设置

 # 事件订阅
/notice/rules         事件订阅策略
/notice/history       事件通知记录
/notice/upgrade       事件升级规则
/notice/template      消息模板

 # 事件处理
/event/realtime      实时事件
/event/record        事件档案
/event/denoise       降噪规则

 # 事件分析
/analysis/classification-manage    分类管理
/analysis/classification-rules     分类规则
/analysis/threshold-recommend      阈值推荐
/analysis/classification-ai        智能事件分类
/analysis/overview   			   事件分析
/analysis/response                 处理分析

 # 系统管理
/system/user-list     用户列表
/system/user-manage   用户及用户组管理
/system/user-invite   邀请用户
/system/role          角色管理
/system/config        系统配置

/user/mine            个人中心
```

## 开发

```bash
# 安装依赖
yarn install

# 启动本地开发环境
yarn dev

# 代码格式检查
yarn lint

```

## 打包发布

```bash
# 构建uat测试环境
yarn build:staging

# 构建生产环境
yarn build
```

## 其他

```bash
# 格式化提交commit
yarn commit

# 打tag并生成changelog,x.x.x是版本号，比如1.2.3
yarn release -- --release-as x.x.x
```

可查看[commitizen](https://github.com/commitizen/cz-cli)规范提交`commit msg`

