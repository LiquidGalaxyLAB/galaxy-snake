# Galaxy Snake

### Summary

- [About](#about)
- [Requirements](#requirements)
  - [Node.js](#nodejs)
  - [PM2](#pm2)
  - [Chromium](#chromium)
- [Installing the game](#installing-the-game)
- [Playing](#playing)
- [LG Retro Gaming](#lg-retro-gaming)
- [License](#license)

<br>

## About

<p align="justify">
Galaxy Snake is a multi-screen retro snake game. Players have to control the snake which grows by feeding on the food and dies if it touches itself. Thanks to Liquid Galaxy, the whole multi-screen setup will serve as a single huge unified board for the snake.
</p>

<br>

## Requirements

### Node.js
Before installing the game, it's necessary to have some other tools installed as well.

First, make sure _Node.js_ version **14+** is installed on the master machine by running:

```bash
$ node -v
```

This command should print something like `v16.17.0`. In case it doesn't, install _Node.js_ by following the mentioned steps:

1. From your home directory, use curl to retrieve the installation script for your preferred version (Replace 16.x if you prefer another version):
```bash
$ cd ~
$ curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
```

2. Inspect the contents of the downloaded script with `nano` (Optional step):
```bash
$ nano nodesource_setup.sh
```

3. When you are satisfied that the script is safe to run, exit your editor, then run the script with `sudo`:
```bash
$ sudo bash nodesource_setup.sh
```

4. You can now install the _Node.js_ package with:
```bash
$ sudo apt-get install nodejs
```

### PM2
With _Node.js_ installed, the next tool that must be installed is _pm2_. Run the command below to install it:

```bash
$ sudo npm i -g pm2
```

### Chromium
Finally, make sure to have Chromium Browser installed on all machines.

> _**Chromium Browser** is usually installed into the Liquid Galaxy systems._

<br>

## Installing the game

There's a few steps to be able to run and play the game.

First, open a new terminal and make sure you're into the **HOME** directory by running the `cd` command.

Then, clone the **Galaxy Snake** repository by running:

```bash
$ git clone https://github.com/LiquidGalaxyLAB/galaxy-snake.git
```

Having the game in the local machine is not enough. Install it by running:

```bash
$ cd galaxy-snake
$ bash install.sh {password}
```

> _The {password} is the password from you system_.

That's it for the installation! The game is running on the _pm2_ using the **8114** port.

> _The **8114** port can't be accessed until you reboot the machine._

All of the installation logs is kept into the `./logs` directory. Make sure to check it out if you experience any problems throughout the installation.

<br>

## Playing

To be able to play or close the game, navigate to the directory by running:
```bash
$ cd ~/galaxy-snake/Bash
```

To play the game, execute the `open-snake.sh` script:
```bash
$ bash ./open-snake.sh
```

To close the game, execute the `kill-snake.sh` script:
```bash
$ bash ./kill-snake.sh
```

With the game running, open the `http://<master-ip>:<game-port>/controller` with a mobile device or web browser to access the joystick controller.
> _For example: http://192.102.45.101:8114/controller_

<br>

## LG Retro Gaming

To have a better experience, use the [LG Retro Gaming](https://github.com/LiquidGalaxyLAB/lg-retro-gaming) application to install and play the game. You must install it by following its documentation and download the app from the [Google Play Store](https://play.google.com/store/apps/details?id=com.leoruas.lg_retro_gaming) to be able to access the joystick controller.

<br>

## License

The Galaxy Snake project is licensed under the [MIT license](https://opensource.org/licenses/MIT).
