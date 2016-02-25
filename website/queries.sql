select * from useri
where id < 0;

delete from useri
where id < 0;


select * from useri
order by registered_at desc;


select * from documents
where id < 0
order by added_at;

delete from documents
where id < 0;


select * from documents
order by added_at desc
limit 100;

select * from term_accceptation
order by userid desc;

select * from codes
where shw = 1;

delete from useri
where email = 'cbramdit@gmail.com';

delete from documents
where added_by in (
	select id from useri
	where email = 'cbramdit@gmail.com'
);

select *
from documents
where code = ''
and added_at > '2016-02-07'
and added_at < '2016-02-15'
and status != -1
order by id desc;
