# EngStep 교재 업데이트
- 최초 1회: `publish_current_books.sql`을 Supabase SQL Editor에서 실행합니다.
- 기존 교재 수정: book_id 유지 + version 증가 + pack 갱신.
- 새 교재: VOC-B02 / GRAM-B02 같은 새 ID로 books에 추가하고 is_published=true.
- 로그인 시 자동 수신, 또는 교재 관리 → 교재 업데이트 확인.
- 기존 문제 순서를 바꾸면 현재 순번 기반 question_id와 과거 기록이 어긋날 수 있으므로 피합니다.
