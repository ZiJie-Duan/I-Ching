# 使用官方 Nginx 镜像
FROM nginx:alpine

# 将 web 目录中的文件复制到容器中的 Nginx 静态文件目录
COPY ./app /usr/share/nginx/html

# 暴露端口 80
EXPOSE 80

# 使用 Nginx 默认的启动命令
CMD ["nginx", "-g", "daemon off;"]
