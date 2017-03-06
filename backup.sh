#!/bin/sh

DB_USER='cruited'
DB_PASSWORD='AcB65oRo!F'
NOW=`/bin/date +\%Y\%m\%d_\%H\%M`

mysqldump -u $DB_USER -p$DB_PASSWORD cruited | gzip > /var/backups/Cruited/cruited_$NOW.sql.gz

rm /var/backups/Cruited/doc-thumbnails_*.tar.gz
tar cfz /var/backups/Cruited/doc-thumbnails_$NOW.tar.gz -C /home/play/Cruited_V2/doc-thumbnails .

rm /var/backups/Cruited/documents_*.tar.gz
tar cfz /var/backups/Cruited/documents_$NOW.tar.gz -C /home/play/Cruited_V2/documents .
