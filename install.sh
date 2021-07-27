#!/bin/bash

#Create logs directory if it doesnt exist yet
mkdir -p ./logs

#Create file name with name as date
date=$(date +%m-%d-%y)
filename="$date.txt"

# Add to log with timestamp
time=$(date +%H:%M:%S)
echo "[$time] Installing Galaxy Snake..." | tee -a ./logs/$filename

# Open port 8114

LINE=`cat /etc/iptables.conf | grep "tcp" | grep "8111" | awk -F " -j" '{print $1}'`

RESULT=$LINE",8114"

DATA=`cat /etc/iptables.conf | grep "tcp" | grep "8111" | grep "8114"`

if [ "$DATA" == "" ]; then
    sudo sed -i "s/$LINE/$RESULT/g" /etc/iptables.conf 2>> ./logs/$filename
else
    time=$(date +%H:%M:%S)
    echo "[$time] Port already open." | tee -a ./logs/$filename
fi

# Install dependencies
time=$(date +%H:%M:%S)
echo "[$time] Installing dependencies..." | tee -a ./logs/$filename
npm install 2>> ./logs/$filename

# Stop server if already started
pm2 delete SNAKE_PORT:8114 2> /dev/null

# Start server
pm2 start index.js --name SNAKE_PORT:8114 2>> ./logs/$filename

pm2 save 2>> ./logs/$filename

time=$(date +%H:%M:%S)
echo "[$time] Installation complete." | tee -a ./logs/$filename