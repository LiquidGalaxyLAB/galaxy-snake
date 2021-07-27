#!/bin/bash
# Initialize sudo access

sudo -v

#Create directory if it doesnt exist yet
mkdir -p ./logs

#Create file name with name as date
date=$(date +%m-%d-%y)
filename="$date.txt"

# Add to log with timestamp
time=$(date +%H:%M:%S)
echo "[$time] Installing Galaxy Snake..." >> ./logs/$filename

# Open port 8114

LINE=`cat /etc/iptables.conf | grep "tcp" | grep "8111" | awk -F " -j" '{print $1}'`

RESULT=$LINE",8114"

DATA=`cat /etc/iptables.conf | grep "tcp" | grep "8111" | grep "8114"`

if [ "$DATA" == "" ]; then
    sed -i "s/$LINE/$RESULT/g" /etc/iptables.conf 2>> ./logs/$filename
else
    time=$(date +%H:%M:%S)
    echo "[$time] Port already open." >> ./logs/$filename
fi

# Install dependencies
time=$(date +%H:%M:%S)
echo "[$time] Installing dependencies..."
npm install 2>> ./logs/$filename

# Server

pm2 start index.js --name SNAKE_PORT:8114 2>> ./logs/$filename

pm2 save 2>> ./logs/$filename

time=$(date +%H:%M:%S)
echo "[$time] Installation complete." >> ./logs/$filename