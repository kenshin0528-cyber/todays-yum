# 오늘 뭐 먹지? V1.1

5~11세 어린이가 스마트폰에서 메뉴를 재미있게 고르고, 음식 도감을 모으고, 보호자와 안전하게 요리할 수 있는 정적 웹앱입니다.

## 주요 기능

- 카테고리와 좋아요를 함께 적용하는 메뉴 룰렛
- 기존 24개 메뉴의 로컬 SVG 일러스트, 레시피, 영양정보
- 투명 PNG 일러스트로 표시되는 토끼 모찌·고양이 나비·곰 쿠키 요리 친구
- 발견 메뉴 도감, 음식 스티커, 5/10/24개 마일스톤
- 한 단계씩 진행하는 꼬마 요리사 모드와 안전·알레르기 안내
- 사용자 메뉴 추가·수정·삭제와 localStorage 복구
- 이전 `yum-favorites` 데이터 자동 마이그레이션
- 핑크·민트·라벤더 테마와 저장되는 소리 설정
- 모찌·나비·쿠키별 3종 이상의 합성 효과음과 이벤트 성공음
- 84 BPM, 약 45.7초 오리지널 Web Audio BGM ‘작은 딸기 카페의 오후’
- 효과음/BGM 개별 ON·OFF와 음량, 자동재생·백그라운드 정책 대응
- iPhone·Android 홈 화면용 PNG 아이콘과 설치 이름을 포함한 Web App Manifest

## 실행

Node.js 18 이상에서 외부 패키지 설치 없이 실행할 수 있습니다.

```powershell
npm run serve
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다. `file://`로 직접 열면 ES Modules 보안 정책 때문에 동작하지 않을 수 있습니다.

## 테스트

```powershell
npm test
node --check src/app.js
```

음식 SVG를 다시 생성하려면 `npm run generate:art`를 실행합니다.

## 데이터와 개인정보

모든 사용자 데이터는 브라우저의 `localStorage`에만 저장됩니다. 로그인, 광고, 분석 SDK, 외부 API, 개인정보 수집은 없습니다. 저장 데이터 스키마 키는 `todays-yum:v3`이며 V2 설정을 자동 마이그레이션합니다.

## 구조

- `src/data/menus.js`: 기존 24개 메뉴 데이터
- `src/recommendation.js`: 후보 필터와 편향 없는 추첨
- `src/storage.js`: 저장·마이그레이션·검증
- `src/audio.js`: 싱글턴 Web Audio 엔진, 캐릭터 효과음, 오리지널 BGM 악보
- `src/collection.js`: 도감·스티커 진행도
- `src/app.js`: 화면 상태와 상호작용
- `src/styles.css`: 모바일 우선 UI
- `assets/food/`: 로컬 SVG 일러스트
- `tests/`: Node 내장 테스트
- `GATES.md`: 구현·검증 Gate 기록
- `AUDIO.md`: 오디오 설계와 테스트 결과

## 배포

- GitHub: https://github.com/kenshin0528-cyber/todays-yum
- Production: https://todays-yum.vercel.app
- Vercel 프로젝트: `the-grace/todays-yum`

`feature/v1.1` 브랜치의 Preview를 검증한 뒤 `main` 브랜치에 반영하면 Vercel Production이 자동 배포됩니다.

## 조리 및 영양 안내

레시피는 간단한 가정식 예시이며 어린이는 보호자와 함께 조리해야 합니다. 칼, 불, 뜨거운 물, 오븐·전자레인지 사용 시 보호자 도움이 필요합니다. 영양 수치는 재료와 조리법에 따라 달라지는 참고용 추정값입니다.
