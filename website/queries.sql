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
order by added_at desc;

delete from documents
where id < 0;


select * from documents
order by id desc;

delete from documents
where id > 2788;

select * from term_accceptation
order by userid desc;

select * from codes
where valid_date > now();

select file, file_cv, file_li, added_at, added_by, d.type as doc_types, position, employer/*, job_ad_url*/, score1_cv, score1, score1_li,
          e.id as edition_id, edition,
          c.id as coupon_id,
          rc.id as red_comment_id, rc.comment as red_comment_text, rc.ordd, rc.points,
          cat.id as red_comment_cat_id, cat.type as red_comment_doc_type,
          tc.id as top_comment_id, tc.comment as top_comment_text,
          cat2.id as top_comment_cat_id, cat2.type as top_comment_doc_type
        from documents d
          inner join product_edition e on e.id = d.edition_id
          left join codes c on c.name = d.code
          left join documents_comments rc on rc.id_doc = d.id
          left join default_categories cat on cat.id = rc.category
          left join single_document_top_comment tc on tc.doc_id = d.id
          left join default_categories cat2 on cat2.id = tc.cate_id
        where d.id = 2768
          and d.status = 2
        order by red_comment_doc_type, red_comment_cat_id, ordd, top_comment_doc_type, top_comment_cat_id, top_comment_id;
