#!/bin/bash

version=`date  +%Y%m%d_%H%M%S`

#read -p "请输入版本号: " version
#if [ ! -n "$version" ] ;then
#        echo "请输入编译的image 版本号,example:20170712_01"
#        exit;
#fi

#定义SVN地址
SVN_BEGIN_PATH=svn://svn.enjoysala.top/zhRegistry/
WEB_NAME=static
svnpath=""
#传入SVN地址
#read -p "请输入SVN分支路径：" svnpath
#if [ -z "$svnpath" ] ;then
#        echo "svn路径为空!"
#        exit
#else
#        echo $SVN_BEGIN_PATH$svnpath"/"$WEB_NAME
#        read -p "请确认svn路径是否正确：(y/n)" flag
#
#        if [ "$flag" != 'y' ] ;then
#                exit
#        fi
#fi

#先删除源代码
#rm -rf $WEB_NAME

#拉取SVN代码
#svn checkout $SVN_BEGIN_PATH$svnpath"/"$WEB_NAME

cd $WEB_NAME/
svn update
cd ..

#拷贝nodejs环境依赖
#cp -R node_modules $WEB_NAME

REGISTRY_PATH=172.17.228.26:5000

docker build -t $REGISTRY_PATH/$WEB_NAME:$version .
docker push $REGISTRY_PATH/$WEB_NAME:$version
docker rmi $REGISTRY_PATH/$WEB_NAME:$version

./publish.sh $version production
