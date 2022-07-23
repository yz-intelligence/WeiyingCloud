![维鹰云](https://github.com/yz-intelligence/WeiyingCloud/blob/main/weiyingcloud_wiki/images/logo.png)

## 产品介绍

访问 维鹰云产品官网（https://aiops.yz-intelligence.com/portal/） 了解产品完整信息。

智能事件平台是一款依托人工智能和大数据技术，将各种云平台或监控工具产生的运维告警信息统一进行接收、降噪、分析、转派、处理的事件全生命周期管理产品，让运维团队彻底告别告警风暴。



## 产品背景

在支撑腾讯互动娱乐国际事业部（IEGG）项目运维过程中，维鹰云运维团队发现项目存在以下几个痛点问题：涉及的云资源和监控平台数量众多，缺少统一管理平台；告警信息未能有效降噪分类；告警风暴淹没高危告警信息等。经过实践验证，在IEGG项目中，告警降噪率最高达到`95%以上`，实现告警的统一管理及分析。在实际解决这些问题过程中，维鹰云与IEGG团队共建了一套成熟的事件管理体系。维鹰云智能事件平台就是将该套方法论和最佳实践提炼出来，整合成一套开箱即用的IT运维告警事件统一管理解决方案。



## 产品理念

用AI赋能传统运维，以场景为导向，解决企业运维过程中出现的告警风暴、告警无法统一管理、告警分析及故障处理效率低等问题，为业务保驾护航，让运维简单高效。智能事件平台对异常检测产生的告警事件信息进行统一降噪与管理。
![产品架构](https://github.com/yz-intelligence/WeiyingCloud/blob/main/weiyingcloud_wiki/images/structure.png)

## 产品特点

针对事件全生命周期进行设计，包括：事件接入->事件降噪->事件订阅->事件通知->事件分析/分类->事件处理->处理分析。

- 多监控源接入：支持国内Zabbix、Prometheus、腾讯云、阿里云、华为云、金山云、百度智能云、蓝鲸智云、微软云、亚马逊云、谷歌云等常见云平台/监控工具接入。
- 事件降噪：支持规则+算法的双重降噪，其中算法降噪包含的智能降噪和降噪阈值推荐暂不开源。
- 事件订阅：支持按需灵活地进行事件订阅设置，支持邮件、短信、企业微信、Webhook等多种通知方式； 
- 事件处理：支持对告警事件进行操作和处理，包括响应、备注、转派、合并、查看、关闭等； 
- 事件升级：提供事件升级规则自定义配置，包括通知方式和通知人升级；
- 事件分析：支持事件规则+算法分类，事件统计分析；其中算法智能分类暂不开源。
- 移动事件管理：支持企业微信、企业微信群、钉钉等移动应用接入，并且可以在移动端接收、查看、处理事件，支持移动事件报表。

## 系统架构

![系统架构图](https://github.com/yz-intelligence/WeiyingCloud/blob/main/weiyingcloud_wiki/images/structure2.png)

1.  `nginx `：智能事件平台交互入口；接收客户端访问请求，如果请求静态资源，返回静态资源文件。如请求动态服务，转发到event-portal。如为事件接入，转发到event-broker。
2.  `event-broker `：主要解析和转换事件告警。
3.  `event-portal `：主要提供动态服务API（如告警、事件、和通知记录等功能管理和操作）。
4.  `event-core `：主要处理事件压缩以及事件逻辑等核心功能。
5.  `AI `：智能事件平台算法模型，主要实现智能分类、智能降噪、抖动分析等AI场景。
6.  `ES `：Elasticsearch全文检索服务，为事件分析提供支撑。
7.  `mysql `：为智能事件平台提供事件、租户及配置等数据存储。
8.  `redis `：提供临时数据和缓存数据存储。
9.  `kafka `：提供消息存储和中转。

## 支持平台

- 支持全平台部署

## 支持语言

- 前端：JavaScript、TypeScript
- 后端：Java

## 在线体验

点击注册体验所有免费功能：https://aiops.yz-intelligence.com/eventbank/register

## 开始使用

维鹰云3.0版本部署物料包：
下载链接：https://wycloud-event-pkg-1259201092.cos.ap-guangzhou.myqcloud.com/3.0/weiyingCloud-oneinstall.tar.gz

部署服务器要求：
单机， 最低8c16g， 服务器需可访问外网, 详细操作查看README.md(执行start.sh 按引导安装即可)

1、如何编译：[《维鹰云智能事件平台编译指南》](https://github.com/yz-intelligence/WeiyingCloud/blob/main/weiyingyun_compile_guide.md "《维鹰云智能事件平台编译指南》")

2、如何部署：[《维鹰云智能事件平台部署指南》](https://github.com/yz-intelligence/WeiyingCloud/blob/main/weiyingyun_installation_standalone_mode_on_premises.md "《维鹰云智能事件部署指南》")

3、如何使用：[《维鹰云智能事件平台帮助文档》](https://docs.qq.com/doc/DTU1RSVZwbmF6eXlj "《维鹰云智能事件平台帮助文档》")


## License

基于AGPL3.0，详见[lincese](https://github.com/yz-intelligence/WeiyingCloud/blob/main/LICENSE "lincese").

## 贡献指南

我们希望对此项目有兴趣的专业人士踊跃参与，提出您宝贵的建议，共同维护项目，期待你的加入。

如果您在使用过程中发现问题，请通过[GitHub Issues](https://github.com/yz-intelligence/WeiyingCloud/issues)来提交并描述相关的问题，您可以在这里查看问题的解答情况，或其他人提交的问题详情（提交前请阅读[ISSUES指南](https://github.com/yz-intelligence/WeiyingCloud/blob/main/ISSUES.md)）。

如果您是第一次贡献代码，请阅读[CONTRIBUTING](https://github.com/yz-intelligence/WeiyingCloud/blob/main/Contributing.md "CONTRIBUTING")了解我们的提交流程。


## 联系方式

在使用过程中有任何问题，欢迎加入维鹰运维人客栈微信群沟通。

![qrcode](https://github.com/yz-intelligence/WeiyingCloud/blob/main/weiyingcloud_wiki/images/qrcode.png)
