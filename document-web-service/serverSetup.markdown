# Hostname config

Check the server's IP address via `ifconfig`.

`$ sudo vi /etc/hosts`

Add line with the IP address and hostname: `188.40.99.15 api.cruited.com`


# Web server

`$ sudo cp /etc/nginx/sites-available/careerstudio /etc/nginx/sites-available/cruited-api`

`$ sudo vi /etc/nginx/sites-available/cruited-api`

    # Cruited API
    server {
            listen 80;
            server_name api.cruited.com;

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

`$ sudo ln -s /etc/nginx/sites-available/cruited-api /etc/nginx/sites-enabled/cruited-api`

`$ sudo service nginx restart`

Copy the following source files to `~/redesigned-cruited.com-frontend/document-web-service`:

* app
* conf
* project (cleaned from the `target` directories)
* public
* activator
* activator-launch-X.Y.Z.jar
* build.sbt

Make the `activator` script executable:

    $ cd ~/redesigned-cruited.com-frontend/document-web-service
    $ dos2unix activator
    $ chmod u+x activator


# JVM params

`$ vi ~/.profile` and add the following line:

    export SBT_OPTS="-Xms512M -Xmx2G -XX:+UseConcMarkSweepGC -XX:+CMSParallelRemarkEnabled"


# Start web server

    $ screen -dR
    Ctrl + a, c
    $ cd ~/redesigned-cruited.com-frontend/document-web-service
    $ ./activator
    $ start -Dhttp.port=9005

(`run` for auto reload, `start` for better perf)
