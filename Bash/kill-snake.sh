
. ${HOME}/etc/shell.conf

for lg in $LG_FRAMES ; do
	echo
	echo $lg:
	if [ $lg == "lg1" ]; then
		echo "Master"
		pkill -f chromium-browser
		pm2 stop SNAKE_PORT:8114
	else
		echo "Slave"
		ssh -Xnf lg@$lg "pkill -f chromium-browse " || true
    fi
done 

