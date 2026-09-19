EngStep v2 - 교재 확장형 구조

1. index.html을 실행하면 기존 단어/문법 교재가 표시됩니다.
2. 새 교재를 임시/개인 추가: 앱의 [교재 관리] > [교재 파일 선택]에서 JSON을 가져옵니다.
3. 정식 배포 교재 추가: content/book-template.json 형식으로 새 JS 콘텐츠 팩을 만들고 index.html에 script 태그 한 줄을 추가합니다.
4. 각 교재는 고유 ID(VOC-B01, GRAM-B01 등)를 사용합니다. 문제 ID는 교재ID:DAY/UNIT:문항번호로 생성되어 기존 오답/학습기록과 충돌하지 않습니다.
5. 향후 Supabase에서는 같은 교재/단원/문제 구조를 테이블로 옮기면 앱 업데이트 없이 서버에서 교재를 추가할 수 있습니다.

현재 포함 교재
- VOC-B01 Vocabulary Book 1 (DAY 01~32)
- GRAM-B01 Grammar Book 1 (UNIT 01~20)
