#!/bin/bash

cd /home

if [ ! -n "$1" ] ;then
    node show_images.js
    exit
fi

node show_images.js $1 > ./tag_list.txt
