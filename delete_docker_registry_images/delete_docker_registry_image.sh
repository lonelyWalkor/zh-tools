#!/bin/bash
if [ ! -n "$1" ] ;then
        echo "请传入删除的版本号! example:zh-static or zh-static:20170711_01"
        exit
fi
export REGISTRY_DATA_DIR=/opt/registry/docker/registry/v2
delete_docker_registry_image --image $1 --dry-run
delete_docker_registry_image --image $1
