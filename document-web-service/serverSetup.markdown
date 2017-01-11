# Hostname config

Check the server's IP address via `ifconfig`.

`$ sudo vi /etc/hosts`

Add line with the IP address and hostname: `46.4.78.11 api.cruited.com`


# Install packages

Install `add-apt-repository` command: `$ apt-get install software-properties-common`

Add the user repo for OpenJDK 8: `$ sudo add-apt-repository ppa:openjdk-r/ppa`

Install packages:

	$ sudo apt-get update
	$ sudo apt-get install nginx openjdk-8-jdk dos2unix mysql-server mysql-client


# Database creation

Harden MySQL installation: `$ sudo mysql_secure_installation`

Create a new user named "cruited" and new database named "cruited":

        $ mysql -u root -p
		> CREATE USER 'cruited'@'localhost' IDENTIFIED BY 'AcB65oRo!F';
        > CREATE DATABASE `cruited` CHARACTER SET utf8 COLLATE utf8_swedish_ci;
        > GRANT ALL ON `cruited`.* TO `cruited`@'%' IDENTIFIED BY 'AcB65oRo!F';
        > FLUSH PRIVILEGES;

Update `my.cnf` to allow remote access: `$ sudo vi /etc/mysql/my.cnf` then comment line `bind-address`.

Restart MySQL server to apply changes to the config file: `$ sudo service mysql restart`.


# Database import

Export existing prod database: Open `https://bart.q360.se:2083/cpsess1691196444/frontend/x3/index.html?post_login=20894866655313` and use password "KmIDGkfwx00O", then go to PhpMyAdmin and export

Import DB: Launch MySQL Workbench, connect to the prod DB, open SQL file and execute it.


# Documents import

    $ mkdir -p ~/Cruited_V2/documents
    $ mkdir -p ~/Cruited_V2/doc-thumbnails

- Download locally all documents and thumbnails which have been added to Mebo since the last copy
- Upload to Hetzner all those new docs and thumbnails


# Web application

Refer to `../website/serverSetup.markdown`.
