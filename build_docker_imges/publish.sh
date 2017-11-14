#!/bin/bash

WEB_NAME=static
LOGS_PATH=/opt/logs/web/$WEB_NAME
PORT=6000
REGISTRY_PATH=172.17.228.26:5000


if [ ! -n "$1" ] ;then
	echo "请传入发布的版本号! example:20170711_01"
	exit
fi

echo "=====================================================================Start Up.....============================================================================"


docker service ps $WEB_NAME > /dev/null
if [ $? -eq 0 ]
then
    echo "Update this Service "$WEB_NAME":"$1
    docker service update --update-parallelism 10 --image $REGISTRY_PATH/$WEB_NAME:$1 $WEB_NAME > /dev/null
else
    echo "add this Service "$WEB_NAME":"$1
    #docker service create --replicas 1 --network zh_net --name $WEB_NAME --env NODE_ENV=$2 -p $PORT:9000 $REGISTRY_PATH/$WEB_NAME:$1 > /dev/null
    #docker service create --replicas 1 --network zh_net --name $WEB_NAME --constraint 'node.labels.group==web' --mount type=bind,target=/var/log/nginx,source=$LOGS_PATH -p $PORT:80 $REGISTRY_PATH/$WEB_NAME:$1 > /dev/null
    docker service create --replicas 1 --network zh_net --name $WEB_NAME -p $PORT:80 $REGISTRY_PATH/$WEB_NAME:$1
fi

echo "请使用以下命令查看当前服务是否启动成功："
echo "docker service ps $WEB_NAME"
echo "=====================================================================Start End.....============================================================================"

#docker service rm $WEB_NAME
#   docker service create --replicas 1 --network dgg_net --name $WEB_NAME --constraint 'engine.labels.group==web' --mount type=bind,target=/opt/tomcat/logs,source=$LOGS_PATH,target=/opt/logs,source=$LOGS_PATH -p $PORT:8080 $REGISTRY_PATH/$WEB_NAME:$1 /opt/startup.sh $2
