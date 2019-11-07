#!/bin/bash

echo "Installing Galaxy Snake" >$HOME/snake.txt

# Initialize sudo access

sudo -v

# Open port 8114

LINE=`cat /etc/iptables.conf | grep "tcp" | grep " 81" | awk -F " -j" '{print $1}'`

RESULT=$LINE",8114"

DATA=`cat /etc/iptables.conf | grep "tcp" | grep " 81" | grep "8114"`

if [ "$DATA" == "" ]; then
    sed -i "s/$LINE/$RESULT/g" /etc/iptables.conf 2>>$HOME/snake.txt
else
    echo "Port already open"
fi

# Install dependencies

npm install

# Server

pm2 start index.js --name SNAKE_PORT:8114 2>>$HOME/snake.txt

pm2 save 2>>$HOME/snake.txt

echo "Installation complete" >>$HOME/snake.txt