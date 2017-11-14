#!/bin/bash
cd /home

node show_images.js 1 > ./tag_list.txt

num=0
cat ./tag_list.txt | while read line
do
    echo $num" : "$line
    ((num++))
done

read -p "请选择上面的编号输入：" number
p=0
export tagname=""
#cat ./tag_list.txt | while read line1
while read line1
do
    if [ $p == $number ];then
       echo "镜像名称为："$line1
       tagname=$line1
       #echo ${line1}
       #echo $tagname
    fi
    ((p++))
done<./tag_list.txt

read -p "请确认镜像名称是否正确：(y/n)" flag
if [ "$flag" != 'y' ] ;then
    exit
fi

./delete_docker_registry_image.sh $tagname
