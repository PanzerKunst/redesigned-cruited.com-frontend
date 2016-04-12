# Python upgrade

[Make the system ready to install Python >= 2.7.9](https://launchpad.net/~fkrull/+archive/ubuntu/deadsnakes-python2.7). This is required for Letsencrypt

    $ sudo add-apt-repository ppa:fkrull/deadsnakes-python2.7


# Letsencrypt installation

Clone `https://github.com/letsencrypt/letsencrypt` and copy the `letsencrypt` directory to `~`

    $ cd ~/letsencrypt
    $ chmod u+x letsencrypt-auto
    $ chmod u+x bootstrap/*.sh

Free port 80 temporarily: `$ sudo service nginx stop`

    $ ./letsencrypt-auto certonly -t --standalone

Enter email `services@cruited.com` and domains `api.cruited.com app.cruited.com`

Restart Nginx: `$ sudo service nginx start`


# Install certificate on Nginx

    $ sudo vi /etc/nginx/sites-available/cruited-api

Change `listen 80` to `listen 443`

Under the `server_name` line, add:

    ssl on;
    ssl_certificate /etc/letsencrypt/live/api.cruited.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.cruited.com/privkey.pem;

Save, then restart Nginx: `$ sudo service nginx reload`


# Redirect port 80 to 443

Add the following section right under the main one:

    server {
        listen 80;
        server_name api.cruited.com;
        return 301 https://$host$request_uri;
    }

Save, then restart Nginx: `$ sudo service nginx reload`


# Renewing certificates

Certificates which will expire in 30 days or less can be renewed.

1. Navigate to the LetsEncrypt root: `$ cd ~/letsencrypt` 
2. Free port 80 temporarily: `$ sudo service nginx stop`
3. Execute the renew command: `$ ./letsencrypt-auto renew`
4. Restart Nginx: `$ sudo service nginx start`
