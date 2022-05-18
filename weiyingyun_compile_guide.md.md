# 维鹰云智能事件平台编译说明

## 前端代码编译

### 系统要求

- Node.js 版本`v12.18.x`及以上
- npm 版本`v6.14.x`及以上

### 安装说明

- 1、打包vue工程
进入到前端目录下
```
# 安装yarn
npm install -g yarn

# 安装依赖
yarn install
```

```
# 启动本地开发环境
yarn dev
```

```
# 构建uat测试环境
yarn build:staging

# 构建生产环境
yarn build
```

## 后端服务编译(java)

### 系统要求

- JDK 1.8
- Apache-maven-3.6.x

### 配置修改

修改broker服务的中间件信息

```
app-eb/app-broker/src/main/resources_test/applicationContext.xml
```

```xml
<!--Core相关信息-->
<property name="server" value="#{systemEnvironment['CORE_SERVER']?:'127.0.0.1'}"/>
<property name="port" value="#{systemEnvironment['CORE_SERVER_PORT']?:'9001'}"/>
<!--Kafka地址-->
<entry key="bootstrap.servers" value="#{systemEnvironment['KAFKA_URL']?:'127.0.0.1:9092'}" />
```

修改core服务的中间件信息

```
app-eb/app-core/src/main/resources_test/applicationContext.xml
```

```xml
    <bean class="com.thoughtup.util.SysConfig">
        <property name="attributes">
            <map>
                <entry key="app.version" value="1.2.3"/>
                <entry key="app.env" value="pro"/>
                <!--算法接口-->
                <entry key="ai.url" value="#{systemEnvironment['AI_URL']?:'127.0.0.1:5000'}/ai"/>
                <!--Es连接信息-->
                <entry key="es.url" value="#{systemEnvironment['ES_URL']?:'127.0.0.1'}"/>
                <entry key="es.port" value="#{systemEnvironment['ES_PORT']?:'9275'}"/>
                <entry key="es.username" value="#{systemEnvironment['ES_USERNAME']?:'admin'}"/>
                <entry key="es.password" value="#{systemEnvironment['ES_PASSWORD']?:'admin'}"/>
                <!--智能降噪开关-->
                <entry key="noise.reduction" value="#{systemEnvironment['NOISE_REDUCTION']?:'true'}"/>
                <!--智能降噪地址-->
                <entry key="noise.reduction.url" value="#{systemEnvironment['NOISE_REDUCTION_URL']?:'127.0.0.1:5001'}"/>
            </map>
        </property>
    </bean>
```

```xml
        <!--MySql连接信息-->
<property name="url" value="jdbc:mysql://#{systemEnvironment['MYSQL_URL']?:'127.0.0.1'}/#{systemEnvironment['DB_NAME']?:'event'}?useUnicode=true&amp;characterEncoding=UTF-8&amp;useSSL=false&amp;allowMultiQueries=true"/>
<property name="username" value="#{systemEnvironment['MYSQL_USER']?:'root'}"/>
<property name="password" value="#{systemEnvironment['MYSQL_PWD']?:''}"/>
```

```xml
    <!--Redis连接信息-->
    <bean id="jedisConnectionFactory" class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory" >
        <property name="hostName" value="#{systemEnvironment['REDIS_HOST']?:'127.0.0.1'}"/>
        <property name="port" value="#{systemEnvironment['REDIS_PORT']?:'9279'}"/>
        <property name="password" value="#{systemEnvironment['REDIS_PASSWORD']?:'admin'}"/>
        <property name="poolConfig" ref="poolConfig"/>
        <property name="usePool" value="true"/>
    </bean>
     <!-- Kafka地址-->
    <entry key="bootstrap.servers" value="#{systemEnvironment['KAFKA_URL']?:'127.0.0.1:9092'}" />
```

修改portal服务的中间件信息

```
app-eb/app-portal/src/main/resources_test/applicationContext.xml
```

```xml
<!-- 服务地址-->
<entry key="domains" value="#{systemEnvironment['EB_URL']?:'http://127.0.0.1:8080/eventbank'}"/>
<entry key="tencentcloud.SECRET_ID_OAUTH" value=""/>
<entry key="tencentcloud.SECRET_KEY_OAUTH" value=""/>
<entry key="tencentcloud.ENCRY_KEY" value=""/>
<!-- 企业微信机器人通知携带h5-url-->
<constructor-arg name="url" value="#{systemEnvironment['WECHAT_GROUP_CALLBACK_URL']?:'https://aiops.yz-intelligence.com/win-h5/warnDetail?id='}"/>
<!-- 企业微信通知卡片信息-->
<constructor-arg name="agentId" value="#{systemEnvironment['WX_AGENTID']?:''}"/>
<constructor-arg name="url" value="#{systemEnvironment['WECHAT_CALLBACK_URL']?:'http://aiops.yz-intelligence.com:8080/win-h5/warnDetail?id='}"/>
<!-- 企业微信相关信息-->
<constructor-arg name="corpid" value="#{systemEnvironment['WX_CORPID']?:''}"/>
<constructor-arg name="providerSecret" value="#{systemEnvironment['WX_SECRET']?:''}"/>
<!-- redis相关信息-->
<bean id="jedisConnectionFactory" class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory" >
        <property name="hostName" value="#{systemEnvironment['REDIS_HOST']?:'127.0.0.1'}"/>
        <property name="port" value="#{systemEnvironment['REDIS_PORT']?:'6318'}"/>
        <property name="password" value="#{systemEnvironment['REDIS_PASSWORD']?:''}"/>
        <property name="poolConfig" ref="poolConfig"/>
        <property name="usePool" value="true"/>
 </bean>
```

```
app-eb/app-portal/src/main/resources_test/core-api-config.xml
```

```xml
<!-- core服务相关信息-->
<property name="server" value="#{systemEnvironment['CORE_SERVER']?:'127.0.0.1'}"/>
<property name="port" value="#{systemEnvironment['CORE_SERVER_PORT']?:'9001'}"/>
```

```
app-eb/app-portal/src/main/resources_test/jdbc-mysql-config.xml
```

```xml
<!-- MySql相关信息-->
<property name="url" value="jdbc:mysql://#{systemEnvironment['MYSQL_URL']?:'127.0.0.1'}/#{systemEnvironment['DB_NAME']?:'event'}?useUnicode=true&amp;characterEncoding=UTF-8&amp;useSSL=false&amp;allowMultiQueries=true"/>
<property name="username" value="#{systemEnvironment['MYSQL_USER']?:'root'}"/>
<property name="password" value="#{systemEnvironment['MYSQL_PWD']?:''}"/>
```

### 编译

#### portal编译

```shell
cd /win-back
mvn clean package -DskipTests -P portal -P test
```

#### core编译

```shell
cd /win-back
mvn clean package -DskipTests -P core -P test
```

#### broker编译

```shell
cd /win-back
mvn clean package -DskipTests -P broker -P test 
```

构建出来的产物都放在win-back/release目录下，主要包含以下产物: 

| 名称                     | 描述                           |
| ------------------------ | ------------------------------ |
| eventbank.war            | portal-web服务war包            |
| app-broker-{version}.jar | broker-jar包，接收告警事件服务 |
| app-core-{version}.jar   | core-jar包，处理告警事件服务   |

