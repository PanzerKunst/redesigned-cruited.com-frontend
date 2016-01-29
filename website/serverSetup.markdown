# Hostname config

Check the server's IP address via `ifconfig`.

`$ sudo vi /etc/hosts`

Add line with the IP address and hostname: `46.4.78.11 app.cruited.com`


# Web server

    $ sudo cp /etc/nginx/sites-available/cruited-api /etc/nginx/sites-available/cruited-app
    $ sudo vi /etc/nginx/sites-available/cruited-app

Update last section into:

    # Cruited App pages
    server {
            listen 80;
            server_name app.cruited.com;

            location / {
                    proxy_pass http://localhost:9006;
                    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
                    proxy_redirect off;
                    proxy_buffering off;
                    proxy_set_header Host $host;
                    proxy_set_header X-Real-IP $remote_addr;
                    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            }
    }

Finish Nginx config:

	$ sudo ln -s /etc/nginx/sites-available/cruited-app /etc/nginx/sites-enabled/cruited-app
	$ sudo service nginx reload


# Copying source files

Copy the following source files to `~/Cruited_V2/website`:

- app
- conf
- project (cleaned of the `target` directories)
- public
- activator
- activator-launch-X.Y.Z.jar
- build.sbt

Make the `activator` script executable:

    $ cd ~/Cruited_V2/website
    $ dos2unix activator
    $ chmod u+x activator


# Configuration changes

    $ vi ~/Cruited_V2/website/conf/logback.xml

Edit the path in the `application.home` declaration, and uncomment that line.

    $ cd ~/Cruited_V2/website/conf
    $ mv -f application-prod.conf application.conf


# JVM params

`$ vi ~/.profile` and add the following line (if doesn't exist yet):

    export SBT_OPTS="-Xms512M -Xmx2G -XX:+UseConcMarkSweepGC -XX:+CMSParallelRemarkEnabled"

    
# Start web server

    $ screen -dR
    Ctrl + a, c
    $ cd ~/Cruited_V2/website
    $ ./activator
    $ stage
    $ exit
    $ ./target/universal/stage/bin/website -Dhttp.port=9006

# Run DB update script