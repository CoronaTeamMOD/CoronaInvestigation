FROM nginx:1.14.2-alpine

RUN  mkdir -p /run/nginx && \
     apk add nginx-mod-http-lua
     
WORKDIR /usr/src/app

COPY build /usr/src/app/build
COPY mime.types /usr/src/app

COPY nginx.conf /usr/src/app

EXPOSE 8080

CMD [ "nginx", "-c", "/usr/src/app/nginx.conf", "-g", "daemon off;" ]