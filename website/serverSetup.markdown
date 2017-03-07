# Installing SBT

Follow the steps on the [SBT website](http://www.scala-sbt.org/0.13/docs/Installing-sbt-on-Linux.html).


# JVM params

`$ vi ~/.profile` and add the following line (if doesn't exist yet):

    export SBT_OPTS="-Xms512M -Xmx2G -XX:+UseConcMarkSweepGC -XX:+CMSParallelRemarkEnabled"

Log out and in again so that the updated `.profile` is taken into account.


# Copying source files

Copy the following source files to `~/Cruited_V2/rater-ui`:

- app
- conf
- project (cleaned of the `target` directories)
- public
- build.sbt


# Configuration changes

    $ vi conf/logback.xml

Edit the path in the `application.home` declaration, and uncomment the line.

    $ mv -f conf/application-prod.conf conf/application.conf

    
# Hostname config

Check the server's IP address via `ifconfig`.

`$ sudo vi /etc/hosts`

Add line with the IP address and hostname: `5.9.7.5 rater.cruited.com`


# Web server

    $ sudo cp /etc/nginx/sites-available/cruited-app /etc/nginx/sites-available/cruited-rater
    $ sudo vi /etc/nginx/sites-available/cruited-rater

Update last section into:

    # Cruited Rater pages
    server {
            listen 443;
            server_name rater.cruited.com;
            client_max_body_size 10M;
    
            ssl on;
            ssl_certificate /etc/letsencrypt/live/api.cruited.com/fullchain.pem;
            ssl_certificate_key /etc/letsencrypt/live/api.cruited.com/privkey.pem;
    
            location / {
                    proxy_pass http://localhost:9009; # BLUE
                    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
                    proxy_redirect off;
                    proxy_buffering off;
                    proxy_set_header Host $host;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            }
    }
    
    server {
            listen 80;
            server_name rater.cruited.com;
            return 301 https://$host$request_uri;
    }

Finish Nginx config:

	$ sudo ln -s /etc/nginx/sites-available/cruited-rater /etc/nginx/sites-enabled/cruited-rater
	$ sudo service nginx reload


# Start web server

    $ screen -dR
    Ctrl + a, c
    $ cd ~/Cruited_V2/rater-ui
    $ sbt
    $ stage
    $ exit
    $ ./target/universal/stage/bin/rater-ui -Dhttp.port=9009

HTTP ports:

- DWS: 9005 (blue) & 9006 (green)
- App: 9007 & 9008
- Rater UI: 9009 & 9010 


# Run DB update script