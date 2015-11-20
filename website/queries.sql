select * from useri
where id < 0;

delete from useri
where id < 0;


select * from useri
order by id desc;

delete from useri
where id > 955;


select * from documents
where id < 0;

delete from documents
where id < 0;


select * from documents
order by id desc;

delete from documents
where id > 1577;


select * from codes
where valid_date > now();