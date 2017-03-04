# Preparation

After the `backup.sh` script file has been copied to the server:

    $ sudo chown root:root Cruited_V2/backup.sh
    $ sudo chmod u+x Cruited_V2/backup.sh
    $ sudo mkdir /var/backups/Cruited


# Add to CRON

`$ sudo crontab -e` and add the following line:

`0  4    * * *   /home/play/Cruited_V2/backup.sh 2>&1>> /var/log/CruitedBackup.log`
