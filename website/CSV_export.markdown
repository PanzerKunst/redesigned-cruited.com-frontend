# Orders

1. Execute the following query in MySQL Workbench:

        select id, type, position, employer, replace(customer_comment, '\r\n', '\\n') as customer_comment, job_ad_url, edition_id, file, file_cv, file_li, last_rate, added_by, status, added_at, code, paid_on, custom_comment, custom_comment_cv, custom_comment_li, assign_to from documents
        where id > 0
          and shw = 1
        order by added_at desc
        limit 10000;

2. Export the result set to `orders.csv`.
3. Open the file in a text editor, and replace new lines by `\n`
