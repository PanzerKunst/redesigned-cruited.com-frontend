# Basic Nginx configuration

`$ sudo cp /etc/nginx/sites-available/camp5 /etc/nginx/sites-available/cruited-frontend`
`$ sudo ln -s /etc/nginx/sites-available/cruited-frontend /etc/nginx/sites-enabled/cruited-frontend`

Modify the Nginx config file to enable PHP:
`$ sudo vi /etc/nginx/sites-available/cruited-frontend`

Modify those lines:

- `root /home/play/camp5;` -> `root /home/play/cruited-frontend/web;`
- `server_name camp5.nu www.camp5.nu;` -> `server_name frontend.cruited.8b.nu;`

`$ sudo service nginx reload`


# Add hostname to /etc/hosts

`$ sudo vi /etc/hosts`
`188.40.99.15 frontend.cruited.8b.nu`


# Raise the upload limit

`$ sudo vi /etc/nginx/nginx.conf`

Add `client_max_body_size 8M;` at the bottom of the Basic Settings section.

`$ sudo service nginx reload`

`$ sudo vi /etc/php5/fpm/php.ini`

Update to `upload_max_filesize = 7M`

`$ sudo service php5-fpm restart`


# File permissions

`$ sudo chown -R www-data /home/play/cruited-frontend`
