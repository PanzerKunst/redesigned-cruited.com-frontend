select * from useri
where id < 0;

delete from useri
where id < 0;


select * from useri
order by registered_at desc;

delete from useri
where id > 1932;


select * from documents
where id < 0
order by added_at;

delete from documents
where id < 0;


select * from documents
order by added_at desc
limit 100;

delete from documents
where id > 2788;

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
