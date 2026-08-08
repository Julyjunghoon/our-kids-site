# 아이랑 뭐하지 🏡

박선율(6살), 박시율(4살)과 함께한 놀이·공부·음식·육아정보를 기록하는 우리 가족 홈페이지입니다.

## 폴더 구조

```
index.html          홈페이지 본체
css/style.css        디자인
js/app.js            화면에 게시글을 그려주는 스크립트
data/kids.js         아이들 프로필 정보
data/posts.js        게시글 데이터 (여기에 글이 쌓입니다)
data/wishlist.js     가보고 싶은 곳 목록
images/posts/        게시글에 쓸 사진
images/profile/       아이들 프로필 사진 (선택)
```

## 사진으로 게시글 만들기

1. `images/posts/` 폴더에 사진 파일을 넣습니다.
2. Claude에게 "이 사진으로 게시글 만들어줘"라고 요청합니다. (사진을 채팅에 직접 올려도 됩니다)
3. Claude가 사진을 보고 어떤 카테고리(놀이/공부/음식/육아정보)인지 판단해서 제목과 본문을 써주고, `data/posts.js` 맨 앞에 새 게시글을 추가합니다.
4. `index.html`을 새로고침하면 새 글이 바로 보입니다.

카테고리는 놀이, 공부, 음식, 육아정보 4가지입니다.

## 장소(지도 링크) 추가하기

게시글에 다녀온 장소가 있으면 `data/posts.js`의 해당 게시글에 `location` 필드를 추가하세요.

```js
location: {
  name: "아리랑도원",
  address: "경기 용인시 처인구 남사읍 통삼로 495",
},
```

이 필드가 있으면 게시글 카드에 장소 이름과 함께 "네이버지도" / "구글지도" 버튼이 자동으로 생기고, 클릭하면 새 탭에서 해당 주소로 지도가 열립니다. 장소가 없는 글은 이 필드를 생략하면 됩니다 (`location` 없이 그대로 두기).

## 가보고 싶은 곳 관리하기

아직 다녀오지 않았지만 아이들과 가보고 싶은 장소는 `data/wishlist.js`에 카테고리별로 적어두세요.

```js
{ category: "수영", name: "강화 옥토끼우주센터" },
```

홈페이지의 "가보고 싶은 곳" 섹션에 카테고리별로 묶여서 보여지고, 장소마다 "네이버지도" / "구글지도" 버튼이 자동으로 생겨서 바로 검색해볼 수 있습니다. category는 자유롭게 새로 만들어도 되고(예: "맛집"), 다녀온 곳은 이 목록에서 지우고 `data/posts.js`에 방문 후기를 남기면 됩니다.

## 로컬에서 미리보기

`index.html`을 더블클릭해서 바로 열어도 되지만, 브라우저(특히 Chrome)에 따라 로컬 파일 접근 제한으로 이미지가 안 보일 수 있습니다. 그럴 땐 아래처럼 간단한 로컬 서버를 켜서 확인하세요.

```
cd 01_아이랑뭐하지
python -m http.server 8000
```

이후 브라우저에서 `http://localhost:8000` 접속.

## 온라인에 배포하기 (GitHub Pages, 무료)

git 명령어 없이 웹사이트에서 클릭만으로 배포할 수 있습니다.

1. https://github.com 에서 무료 계정을 만듭니다 (이미 있다면 로그인).
2. 오른쪽 위 `+` → `New repository` 클릭 → 이름 입력(예: `our-kids-site`) → `Public` 선택 → `Create repository`.
3. 생성된 저장소 페이지에서 `Add file` → `Upload files` 클릭.
4. 이 폴더 안의 `index.html`, `css`, `js`, `data`, `images` 를 전부 끌어다 놓고 `Commit changes`.
5. 저장소 상단 `Settings` → 왼쪽 메뉴 `Pages` 클릭.
6. `Build and deployment` → `Source`를 `Deploy from a branch`로, `Branch`는 `main` / `/ (root)`로 설정 후 `Save`.
7. 1~2분 후 같은 페이지에 `https://아이디.github.io/저장소이름/` 형태의 주소가 생깁니다. 이 링크로 어디서든 접속 가능합니다.

### 새 글을 올렸을 때 배포 사이트 업데이트

`data/posts.js`와 새 사진 파일을 같은 방법(`Add file → Upload files`)으로 다시 올리면 자동으로 사이트에 반영됩니다.

## 커스터마이징

- 아이 이름, 나이, 아바타 색은 `data/kids.js`에서 수정
- 사이트 제목/부제목도 `data/kids.js`의 `SITE_INFO`에서 수정
- 색상 톤은 `css/style.css` 상단 `:root` 변수(`--pink`, `--mint`, `--yellow` 등)에서 조정
