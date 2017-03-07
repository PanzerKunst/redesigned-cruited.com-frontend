# First boot after Ubuntu installation

Login as "root", then:

    $ adduser play
    $ adduser play sudo
    $ exit


Login as "play", then:

    $ sudo apt-get update
    $ sudo apt-get upgrade


# Install packages

Install `add-apt-repository` command: `$ sudo apt-get install software-properties-common`

Add the user repo for OpenJDK 8: `$ sudo add-apt-repository ppa:openjdk-r/ppa`

Install packages: `$ sudo apt-get install smartmontools screen nginx openjdk-8-jdk dos2unix mysql-server mysql-client letsencrypt`

(Smart Tools to have access to the `smartctl` command) 

When prompted for root MySQL password, enter "S#fr8QEr".


# Database initialisation

Harden MySQL installation: `$ sudo mysql_secure_installation`. Do not activate password requirements, otherwise current users with easy passwords can no longer sign in!

If need to disable password requiements, see http://stackoverflow.com/questions/36301100/how-do-i-turn-off-the-mysql-password-validation    

Create a new user named "cruited" and new database named "cruited":

    $ mysql -u root -p
	> CREATE USER 'cruited'@'localhost' IDENTIFIED BY 'AcB65oRo!F';
    > CREATE DATABASE `cruited` CHARACTER SET utf8 COLLATE utf8_swedish_ci;
    > GRANT ALL ON `cruited`.* TO `cruited`@'%' IDENTIFIED BY 'AcB65oRo!F';
    > FLUSH PRIVILEGES;
    > quit

Open access to remote connections:

`$ sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf`

Replace the `bind-address` line to `bind-address = 0.0.0.0`

Restart MySQL server to apply changes to the config file: `$ sudo service mysql restart`.


# Hostname config

Check the server's IP address via `ifconfig`.

`$ sudo vi /etc/hosts`

Add line with the IP address and hostname: `5.9.7.5 api.cruited.com`


# Database import

Do it from the backups, via MySQL Workbench


# Documents import

    $ mkdir -p ~/Cruited_V2/documents
    $ mkdir -p ~/Cruited_V2/doc-thumbnails

- Download locally all documents and thumbnails which have been added to Mebo since the last copy
- Upload to Hetzner all those new docs and thumbnails, then extract them in the matching directory.


# Web application

Refer to `../website/serverSetup.markdown`.
