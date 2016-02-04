# Initial setup

Install the Blue web app in `~/cruitedV2/website_BLUE`, and the Green web app in `~/cruitedV2/website_GREEN`

`$ sudo vi /etc/nginx/sites-available/cruited-app`

To point to the Blue app, make sure that the `proxy_pass` declaration is:
`proxy_pass http://localhost:9007;`

(The port for the Blue app is 9007, and that of the Green app is 9008. 9005 & 9006 are the ports of the DWS app)


# Switching from Blue to Green

`$ sudo vi /etc/nginx/sites-available/cruited-app`

Update the `proxy_pass` declaration to:
`proxy_pass http://localhost:9008;`

Reload Nginx config: `$ sudo service nginx reload`
