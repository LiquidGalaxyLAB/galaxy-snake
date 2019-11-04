#!bin/bash

echo -e "

\e[34m ___\e[39m                 _\e[31m            _
\e[34m|__ |\e[39m               |_|\e[31m      ____| |
\e[34m  | |__\e[39m                \e[31m     |______|
\e[34m  |____|                      \e[39m

https://github.com/LiquidGalaxy/liquid-galaxy

https://github.com/LiquidGalaxyLAB/liquid-galaxy

-------------------------------------------------------------

"

# Snake Installer #

echo "Installing Snake" > $HOME/snake.txt

# Open port

LINHA=cat /etc/iptables.conf | grep "tcp" | grep "81" | awk -F " -j" '{print $1}'
RESULT=$LINHA”,“8114
sed -i “s/$LINHA/$RESULT/g” /etc/iptables.conf


# Server
pm2 start index.js --name SNAKE_PORT:8114 2>>$HOME/snake.txt

pm2 save 2>>$HOME/snake.txt

echo "Installation complete" >>$HOME/snake.txt