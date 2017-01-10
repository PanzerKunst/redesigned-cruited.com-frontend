select * from useri
where id < 0;

delete from useri
where id < 0;


select * from useri
order by registered_at desc;


select * from documents
where id < 0
order by added_at desc;

delete from documents
where id < 0;


select * from documents
order by added_at desc
limit 100;

select * from term_accceptation
order by userid desc;

select * from codes
where shw = 1
order by valid_date desc;

delete from useri
where email = 'christophe@8b.nu';

delete from documents
where added_by in (
	select id from useri
	where email = 'christophe@8b.nu'
);

select *
from documents
where code = ''
and added_at > '2016-02-07'
and added_at < '2016-02-15'
and status != -1
order by id desc;

select * from supported_language;

/* Variations */
  select v.id, variation,
    dc.id as id_default, category as category_id, trim(name_good) as name_good, trim(name_bad) as name_bad, dc.type as doc_type, score, grouped,
    e.id as edition_id, e.edition as edition_code
  from default_variations v
    inner join defaults dc on dc.id = v.id_default
    inner join default_categories c on c.id = dc.category
    inner join product_edition_variation variation_type on variation_type.variation_id = v.id
    left join product_edition e on e.id = variation_type.edition_id
  where v.shw = 1
    and dc.shw = 1
    and c.shw = 1
  order by id_default, tag_type;
