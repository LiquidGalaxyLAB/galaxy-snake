#!/bin/bash

. ${HOME}/etc/shell.conf
trap "" 15
PROGRAM=$LG_RUNNING_PROGRAM

if [ "$PROGRAM" == "lg" ]; then
    for lg in $LG_FRAMES ; do
	echo
	echo $lg:
        if [ $lg == "lg1" ]; then
            echo "Master"
            pkill -f earth
        else
            echo "Slave"
            ssh -Xnf lg@$lg "pkill -f earth" || true
        fi
    done
fi

if [ "$PROGRAM" == "streetview" ]; then
    for lg in $LG_FRAMES ; do
	echo
	echo $lg:
        if [ $lg == "lg1" ]; then
            echo "Master"
            pkill -f chromium-browser
        else
            echo "Slave"
            ssh -Xnf lg@$lg "pkill -f chromium-browser " || true
        fi
    done 
fi

if [ "$PROGRAM" == "pano" ]; then
    for lg in $LG_FRAMES ; do
	echo
	echo $lg:
        if [ $lg == "lg1" ]; then
            echo "Master"
            #kill xiv proccess from master
            pkill -f xiv
        else
            echo "Slave"
            #kill xiv proccess from the slaves via ssh
            ssh $lg "pkill -f xiv " || true
        fi
    done
fi

if [ "$PROGRAM" == "pong" ]; then
	for lg in $LG_FRAMES ; do
	echo
	echo $lg:
        if [ $lg == "lg1" ]; then
            echo "Master"
            pkill -f chromium-browser
            pm2 stop pong
        else
            echo "Slave"
            ssh -Xnf lg@$lg "pkill -f chromium-browser " || true
        fi
    done 
fi

if [ "$PROGRAM" == "snake" ]; then
	for lg in $LG_FRAMES ; do
	echo
	echo $lg:
        if [ $lg == "lg1" ]; then
            echo "Master"
            pkill -f chromium-browser
            pm2 stop snake
        else
            echo "Slave"
            ssh -Xnf lg@$lg "pkill -f chromium-browser " || true
        fi
    done 
fi