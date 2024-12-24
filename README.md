# 챔피언 db 구성 (윤예원)

### 
# 프로젝트 개요

이 프로젝트는 Riot Games API를 활용하여 리그 오브 레전드 챔피언 데이터를 데이터베이스에 저장하고, 이를 사용자에게 제공하는 웹 애플리케이션입니다. Express를 기반으로 서버를 구성했으며, Prisma를 통해 데이터베이스와 상호작용합니다. 

---

## 주요 사용 기술 및 문법

### Express
- Node.js 기반의 웹 프레임워크로 Router를 활용하여 경로를 정의했습니다.

### Axios
- HTTP 요청 라이브러리로, Riot API 호출에 사용했습니다.

### Prisma
- ORM(Object-Relational Mapping) 도구로, 데이터베이스와 상호작용합니다.

### 비동기 처리
- `async/await`를 사용하여 비동기 작업을 순차적으로 처리했습니다.

### HTTP 메서드
- **GET**: 챔피언 리스트 가져오기.
- **POST**: 챔피언 리스트 업데이트.

---

## 코드 상세 해석

### `championRoutes.get('/champions')`
- 저장된 챔피언 데이터를 데이터베이스에서 읽어와 반환.
- `prisma.champions.findMany`를 사용하여 데이터 조회.
- 데이터가 없으면 404 응답, 성공적으로 조회 시 200 응답.

### `championRoutes.post('/update_champion_list')`
- Riot API에서 최신 데이터를 가져와 기존 데이터 삭제 후 새 데이터를 삽입.
- Riot API URL을 동적으로 생성.
- 기존 데이터 삭제: `prisma.champions.deleteMany`.
- API 응답 데이터를 매핑하여 `prisma.champions.createMany`로 저장.

---

## 설치해야 하는 npm 패키지

### Express
- **설치**: `npm install express`
- **역할**: 라우터 및 서버 구성을 위해 사용.

### Axios
- **설치**: `npm install axios`
- **역할**: HTTP 요청을 보내 Riot API 데이터를 가져옴.

### Prisma
- **설치**: `npm install prisma @prisma/client`
- **역할**: 데이터베이스와 상호작용.
- **설정**:
  1. `prisma init`으로 Prisma 초기화.
  2. `schema.prisma` 파일 설정.
  3. 데이터베이스 마이그레이션: `npx prisma migrate dev`.

### dotenv (선택 사항)
- **설치**: `npm install dotenv`
- **역할**: 환경변수 관리를 위해 사용.

---

## API 명세서

### GET `/champions`
- **설명**: 데이터베이스에 저장된 모든 챔피언의 이름과 이미지를 반환.
- **응답 예시**:
  ```json
  {
    "success": true,
    "message": [
      {
        "name": "Ahri",
        "image": "http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/Ahri.png"
      },
      {
        "name": "Akali",
        "image": "http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/Akali.png"
      }
    ]
  }
  ```

### POST `/update_champion_list`
- **설명**: Riot API에서 챔피언 데이터를 가져와 데이터베이스를 업데이트.
- **요청 형식**:
  - **Content-Type**: `application/json`
  - **Body**:
    ```json
    {
      "version": "13.6.1"
    }
    ```
- **응답 예시**:
  ```json
  {
    "success": true,
    "message": "챔피언 리스트 업데이트 완료!",
    "data": [
      {
        "name": "Ahri",
        "image": "http://ddragon.leagueoflegends.com/cdn/13.6.1/img/champion/Ahri.png"
      }
    ]
  }
  ```

---

## 오류 처리

### 404 - 챔피언 데이터 유무
```json
{ "errorMessage": "저장된 챔피언이 없습니다" }
```

### 400 - 버전 입력 확인
```json
{ "errorMessage": "버전이 필요합니다" }
```

### 404 - Riot API 호출 성공 여부
```json
{ "errorMessage": "Riot API에서 챔피언 데이터를 가져오지 못했습니다" }
