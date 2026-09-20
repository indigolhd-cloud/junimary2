# EngStep v3 Cloud Ready

## 목표
웹(PC/iPad 포함)과 향후 iPhone 앱이 같은 Supabase 계정과 학습 기록을 공유하도록 만든 버전입니다.

## 현재 동작
- Supabase 설정 전: 기존처럼 로컬 모드로 완전히 동작
- Supabase 설정 후: 이메일 로그인, 풀이 기록 업로드/다운로드, 공개 교재 pack 자동 수신
- 오프라인: localStorage에 먼저 저장하고 온라인이 되면 동기화
- 새 교재: `books` 테이블에 pack JSON을 게시하면 웹/앱에서 같은 콘텐츠를 받을 수 있음

## 연결 방법
1. Supabase 프로젝트 생성
2. `supabase_schema.sql`을 SQL Editor에서 실행
3. `config.js`에 Project URL과 anon/publishable key 입력
4. 웹 서버(GitHub Pages 등)에 폴더 전체 배포
5. 같은 코드베이스를 Capacitor iOS 앱에서 사용하면 같은 계정/DB를 공유 가능

## 중요
`config.js`가 비어 있는 현재 배포본은 실제 클라우드에 연결되지 않습니다.
Service Role Key는 절대로 웹/앱에 넣지 않습니다.

## 새 교재 게시
교재 pack은 기존 `book-template.json` 형식을 사용합니다.
관리자 환경에서 `books`에 `book_id`, `version`, `title`, `content_type`, `pack`, `is_published=true`로 등록합니다.
앱 업데이트 없이 다음 동기화 때 새 교재가 나타나도록 설계되어 있습니다.


## 이 빌드의 연결 상태
- Supabase Project URL: 설정 완료
- Supabase publishable key: 설정 완료
- 클라이언트는 이제 클라우드 모드로 초기화될 수 있습니다.
- 단, `supabase_schema.sql`을 해당 프로젝트의 SQL Editor에서 아직 실행하지 않았다면
  `books` / `attempts` 테이블이 없으므로 교재/풀이 기록 동기화는 완료되지 않습니다.

## v6
복습 선정 이유, 다음 복습일, 상세 학습통계, 집중복습 완료 상태 표시를 추가했습니다.
