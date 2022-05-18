# 维鹰云智能事件平台安装部署

## 1. 基础环境部署

### 1.1 系统要求

- CentOS：7.X
- JDK：1.8
- Python：2.x
- Tomcat：9.0.x
- MySQL：5.7
- Redis：4.0.6
- Elasticsearch：7.7.0
- Kafka：2.8.1
- Nginx：1.21.0

### 1.2 数据库初始化

使用本平台部署时，数据库需要先初始化，初始化脚本在工程win-back/app-eb/app-portal/src/main/resources/database/目录下，登录到数据库中按顺序执行即可。 


## 2程序部署

### 2.1 后端微服务部署

- 把打包出来的eventbank.war移动到Tomcat的webapps目录下，重启Tomcat加载启动portal服务
- 到 release/app-eb-broker-release/bin/ 目录下执行start.py脚本 python ./start.py
- 到 release/app-eb-core-release/bin/ 目录下执行start.py脚本 python ./start.py

### 2.2 前端部署

首先，将编译生成的所有前端静态文件放置于正确的前端目录下如：/usr/share/nginx/html。
前端部署准备工作至此完成，后续通过配置Nginx作为前端静态服务即可。

### 2.3 Nginx配置与部署
使用Nginx作为前端静态资源服务器并转发后端服务，其配置可参考如下：
```nginx
    worker_processes  auto;
    error_log  /etc/nginx/logs/error.log notice;
    pid        /etc/nginx/logs/nginx.pid;
    events {
      worker_connections  4096;
    }

    http {
      include       /etc/nginx/conf/mime.types;
      default_type  application/octet-stream;
      log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
      access_log  /etc/nginx/logs/access.log  main;
      sendfile        on;
      keepalive_timeout  65;

      server {
        listen       80;
        server_name  aiops.yz-intelligence.com;
        absolute_redirect off;
      
        root   /usr/share/nginx/html;
        access_log  /etc/nginx/logs/host.access.log  main;
        location / {
          
        }

        location /nginx_status {
          stub_status;
          access_log off;
        }
      
        location /eventbank/api/ {
          proxy_buffering off;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          #ip和端口
          proxy_pass http://ip:8080/eventbank/api/;
        }
      
        location /files/ {
          proxy_buffering off;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      	  #ip和端口
          proxy_pass http://ip:8080/files/;
        }
      
        location /broker/ {
          proxy_buffering off;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          #ip和端口
          proxy_pass http://ip:9002/broker/;
        }
      
        location /eventbank {
          try_files $uri $uri/ /eventbank/index.html;
        }    
      
        location /eventbank/win-h5 {
          try_files $uri $uri/ /win-h5/index.html;      
        }
      
        location /win-h5 {
          try_files $uri $uri/ /win-h5/index.html;      
        }
        
        location /repo/install/ {
          root /usr/share/nginx/files/;
        }
      }
    }
    daemon off;
```
配置完成后reload nginx使其生效：
```shell script
nginx -s reload -c /path/to/nginx.conf
```

### 2.4 访问事件平台首页
访问首页，即可开始体验功能。
