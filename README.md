# K-Story Song 홈페이지

## 새 항목 추가 (코드 수정 없이 데이터만)
- 영상 목록: data/raw/youtube_playlists.json (YouTube에서 수집한 원본). 새 영상이 올라가면 다시 수집 후 data/*.json 갱신.
- 회차: data/hangeul.json, factory.json, dasibom.json 의 episodes[] 에 항목 추가.
  - youtube.lecture / youtube.song 에 영상 ID, lesson.en/vn 에 복습 HTML 경로, audiobook 에 오디오북 영상 ID.
- 복습 HTML: lessons/<시리즈>/epNN_EN.html (audio 폴더와 같이).
- 자료실: data/library.json 의 items[] 에 {title:{ko,en,vn}, desc:{..}, file:"files/xxx.pdf"} 추가, 파일은 files/ 에.
- 새 시리즈: data/series.json 의 series[] 에 추가 (file 이 null 이면 "준비 중").

## 배포 (GitHub Pages)
1. GitHub에서 저장소 <아이디>.github.io 생성(Public)
2. 이 폴더 내용 업로드(git push 또는 웹에서 업로드)
3. Settings > Pages > Branch main / root

## 로그인/댓글/게시판 (Firebase, 무료)
assets/config.js 의 KSS_FIREBASE 에 Firebase 웹 앱 설정을 넣으면 활성화됩니다. Authentication > Google 사용, 승인된 도메인에 github.io 추가, Firestore 규칙은 로그인한 사용자만 쓰기.
