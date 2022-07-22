#基于centos:7
FROM centos:7
MAINTAINER This is Nginx
#下载手工编译nginx软件包
RUN yum update -y && yum install -y gcc gcc-c++ pcre-devel zlib-devel openssl openssl-devel  make
#添加用户
RUN useradd -M -s /sbin/nologin nginx
#将Nginx压缩包添加到容器中
ADD http://nginx.org/download/nginx-1.21.0.tar.gz .
RUN tar zxvf nginx-1.21.0.tar.gz
#设置工作目录
WORKDIR /nginx-1.21.0
#编译安装nginx
RUN ./configure --prefix=/etc/nginx --user=nginx --group=nginx --with-http_stub_status_module --with-http_ssl_module
RUN make && make install
#建立启动软链接
RUN ln -s /etc/nginx/sbin/nginx /usr/local/sbin/

# 事件平台PC
COPY dist/ /usr/share/nginx/html/eventbank/
# # 事件平台H5
COPY h5/ /usr/share/nginx/html/win-h5/

#暴露端口
EXPOSE 8888
#关闭容器守护进程
RUN echo "daemon off;" >> /etc/nginx/conf/nginx.conf
# 启动nginx
CMD /etc/nginx/sbin/nginx
