select * from useri
where id < 0;

delete from useri
where id < 0;


select * from useri
order by id desc;

delete from useri
where id > 1932;


select * from documents
where id < 0
order by added_at;

delete from documents
where id < 0;


select * from documents
order by id desc
limit 30;

delete from documents
where id > 2788;

select * from term_accceptation
order by userid desc;

select * from codes
where valid_date > now();

delete from useri;

delete from documents;