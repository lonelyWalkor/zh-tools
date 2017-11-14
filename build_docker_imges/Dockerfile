FROM nginx:1.13.6-alpine

COPY script/default.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/index.html
COPY static /usr/share/nginx/html

#CMD ["/bin/sh","/app/start.sh"]
#CMD ["nginx"]
CMD ["nginx", "-g", "daemon off;"]
