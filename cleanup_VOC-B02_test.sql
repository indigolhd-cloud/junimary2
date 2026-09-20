-- EngStep v6: 임시 클라우드 테스트 교재 제거
-- 실제 Book 2로 사용하기 전 테스트용 VOC-B02만 삭제합니다.
delete from public.books
where book_id = 'VOC-B02'
  and title = 'Vocabulary Book 2 (Cloud Test)';

select book_id, version, title, is_published
from public.books
order by book_id;
