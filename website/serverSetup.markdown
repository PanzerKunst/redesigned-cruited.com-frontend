# Hostname config

Check the server's IP address via `ifconfig`.

`$ sudo vi /etc/hosts`

Add line with the IP address and hostname: `188.40.99.15 app.cruited.com`


# Web server

`$ sudo cp /etc/nginx/sites-available/cruited-api /etc/nginx/sites-available/cruited-frontend`

`$ sudo vi /etc/nginx/sites-available/cruited-frontend`

    # Cruited frontend
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

`$ sudo ln -s /etc/nginx/sites-available/cruited-frontend /etc/nginx/sites-enabled/cruited-frontend`

`$ sudo service nginx restart`

Copy the following source files to `~/redesigned-cruited.com-frontend/website`:

* app
* conf
* project (cleaned from the `target` directories)
* public
* activator
* activator-launch-X.Y.Z.jar
* build.sbt

Make the `activator` script executable:

    $ cd ~/redesigned-cruited.com-frontend/website
    $ dos2unix activator
    $ chmod u+x activator


# JVM params

`$ vi ~/.profile` and add the following line:

    export SBT_OPTS="-Xms512M -Xmx2G -XX:+UseConcMarkSweepGC -XX:+CMSParallelRemarkEnabled"

    
# Start web server

    $ screen -dR
    Ctrl + a, c
    $ cd ~/redesigned-cruited.com-frontend/website
    $ ./activator
    $ stage
    $ exit
    $ ./target/universal/stage/bin/website -Dhttp.port=9006
