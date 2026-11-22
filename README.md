# K-Story Song 홈페이지

## 새 항목 추가 (코드 수정 없이 데이터만)
- 영상 목록: data/raw/youtube_playlists.json (YouTube에서 수집한 원본). 새 영상이 올라가면 다시 수집 후 data/*.json 갱신.
- 회차: data/hangeul.json, factory.json, dasibom.json 의 episodes[] 에 항목 추가.
  - youtube.lecture / youtube.song 에 영상 ID, lesson.en/vn 에 복습 HTML 경로, audiobook 에 오디오북 영상 ID.
- 복습 HTML: lessons/<시리즈>/epNN_EN.html (audio 폴더와 같이).
- 자료실: data/library.json 의 items[] 에 {title:{ko,en,vn}, desc:{..}, file:"files/xxx.pdf"} 추가, 파일은 files/ 에.
- 새 시리즈: data/series.json 의 series[] 에 추가 (file 이 null 이면 "준비 중").

## 배포 (GitHub Pages)
저장소 muungjoo-hash/kstorysong, main / root, 커스텀 도메인 kstorysong.com (CNAME 파일). 파일을 push 하면 자동 반영.

## 게시판/댓글 (Firebase Firestore, 무로그인 공개)
assets/config.js 에 Firebase 웹 앱 설정이 들어 있습니다(프로젝트 kstorysong). 누구나 닉네임으로 글을 쓸 수 있고, 규칙은 글 생성만 허용(길이 제한, 수정/삭제 불가)입니다. 부적절한 글은 Firebase 콘솔 > Firestore > comments 에서 직접 삭제합니다.
