#!bin/bash

echo -e "

\e[34m ___			     _				_
\e[31m|__ |				|_| 	   ____| |
\e[33m  | |__  					  |______|
\e[32m  |____|						 \e[39m

https://github.com/LiquidGalaxy/liquid-galaxy

https://github.com/LiquidGalaxyLAB/liquid-galaxy

-------------------------------------------------------------

"

# Snake Installer #

echo "Installing Snake" > $HOME/snake.txt

# Initialize sudo access

sudo -v

# Server

sudo npm install pm2@latest -g 2>>$HOME/snake.txt

pm2 start index.js --name SNAKE_PORT:8114 2>>$HOME/snake.txt

pm2 save 2>>$HOME/snake.txt

echo "Installation complete" >>$HOME/snake.txt