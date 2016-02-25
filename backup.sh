#!/bin/sh

DB_USER='cruited'
DB_PASSWORD='AcB65oRo!F'
NOW=`/bin/date +\%Y\%m\%d_\%H\%M`

mysqldump -u $DB_USER -p$DB_PASSWORD cruited | gzip > /var/backups/Cruited/cruited_$NOW.sql.gz
mysqldump -u $DB_USER -p$DB_PASSWORD wp_cruited | gzip > /var/backups/Cruited/wp_cruited_$NOW.sql.gz

rm /var/backups/Cruited/doc-thumbnails_*.gz
gzip -rc1 /home/play/Cruited_V2/doc-thumbnails > /var/backups/Cruited/doc-thumbnails_$NOW.gz

rm /var/backups/Cruited/documents_*.gz
gzip -rc1 /home/play/Cruited_V2/documents > /var/backups/Cruited/documents_$NOW.gz
