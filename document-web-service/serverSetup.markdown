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


# Web server

    $ sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/cruited-api
    $ sudo vi /etc/nginx/sites-available/cruited-api

Comment everything, and add this new section:

    # Cruited API / Document Web Service
    server {
            listen 80;
            server_name api.cruited.com;
            client_max_body_size 10M;

            location / {
                    proxy_pass http://localhost:9005;
                    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
                    proxy_redirect off;
                    proxy_buffering off;
                    proxy_set_header Host $host;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            }
    }

Finish Nginx config:

	$ sudo ln -s /etc/nginx/sites-available/cruited-api /etc/nginx/sites-enabled/cruited-api
	$ sudo service nginx reload


# Copying source files

Copy the following source files to `~/Cruited_V2/document-web-service`:

- app
- conf
- project (cleaned of the `target` directories)
- activator
- activator-launch-X.Y.Z.jar
- build.sbt

Make the `activator` script executable:

    $ cd ~/Cruited_V2/document-web-service
    $ dos2unix activator
    $ chmod u+x activator


# Configuration changes

    $ vi conf/logback.xml

Edit the path in the `application.home` declaration, and uncomment that line.

    $ mv -f conf/application-prod.conf conf/application.conf


# JVM params

`$ vi ~/.profile` and add the following line:

    export SBT_OPTS="-Xms512M -Xmx2G -XX:+UseConcMarkSweepGC -XX:+CMSParallelRemarkEnabled"


# Start web server

    $ screen -dR
    Ctrl + a, c
    $ cd ~/Cruited_V2/document-web-service
    $ ./activator
    $ stage
    $ exit
    $ ./target/universal/stage/bin/document-web-service -Dhttp.port=9005
