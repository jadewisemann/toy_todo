# Backend API Contract

## 개요

Todo 앱에 세션 기반 인증을 추가하기 위한 프론트엔드-백엔드 API 계약 문서이다.

- 인증 방식은 쿠키 기반 세션 인증을 사용한다.
- 로그인 성공 시 백엔드는 `HttpOnly` 세션 쿠키를 설정한다.
- 프론트엔드는 세션 키를 직접 저장하지 않는다.
- Todo API 엔드포인트는 기존 형태를 유지한다.
- Todo 데이터는 현재 로그인한 사용자 기준으로 조회, 생성, 수정, 삭제한다.

## 공통 규칙

### Base URL

```text
추후 환경별로 결정
```

예시:

```text
http://localhost:3000
```

### Content-Type

요청/응답 본문은 JSON을 사용한다.

```http
Content-Type: application/json
```

### API와 네이밍 케이스

- API 경로는 소문자와 `/`를 사용한다.
  - 예: `/auth/signin`, `/todos/:id`
- 요청/응답 JSON 필드는 `camelCase`를 사용한다.
  - 예: `createdAt`, `updatedAt`
- TypeScript 인터페이스 이름은 `PascalCase`를 사용한다.
  - 예: `SigninRequest`, `Todo`
- URL 파라미터 이름은 리소스 식별 의미가 드러나도록 짧게 작성한다.
  - 예: `/todos/:id`
- 상태 코드와 에러 메시지는 HTTP 의미에 맞게 유지하고, 상세한 사용자 안내 문구는 프론트엔드에서 처리한다.

### 세션 쿠키

로그인 성공 시 백엔드는 세션 쿠키를 내려준다.

```http
Set-Cookie: sessionId=<session-id>; HttpOnly; Path=/; SameSite=Lax
```

운영 환경에서 HTTPS를 사용하는 경우 `Secure` 옵션을 추가한다.

```http
Set-Cookie: sessionId=<session-id>; HttpOnly; Secure; Path=/; SameSite=Lax
```

프론트엔드는 API 요청 시 쿠키가 포함되도록 요청한다.

```ts
fetch(url, {
  credentials: 'include',
})
```

### 공통 에러 응답

```ts
interface ErrorResponse {
  message: string
}
```

예시:

```json
{
  "message": "Unauthorized"
}
```

### 주요 상태 코드

| Status | 의미 |
| --- | --- |
| `200` | 요청 성공 |
| `201` | 리소스 생성 성공 |
| `204` | 응답 본문 없는 성공 |
| `400` | 잘못된 요청 |
| `401` | 인증되지 않은 요청 |
| `403` | 권한 없는 요청 |
| `404` | 리소스를 찾을 수 없음 |
| `409` | 중복 또는 충돌 |
| `500` | 서버 오류 |

## 데이터 인터페이스

### User

```ts
interface User {
  id: string
  name: string
}
```

주의:

- `password`는 응답에 포함하지 않는다.
- `id`는 사용자가 로그인에 사용하는 아이디이다.

### Todo

```ts
interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt: string
}
```

주의:

- Todo 응답에 `userId`를 반드시 포함할 필요는 없다.
- 백엔드는 내부적으로 Todo와 사용자 소유 관계를 관리해야 한다.
- 날짜 문자열은 ISO 8601 형식을 사용한다.

예시:

```json
{
  "id": "todo_1",
  "title": "라우터 추가하기",
  "completed": false,
  "createdAt": "2026-05-13T07:00:00.000Z",
  "updatedAt": "2026-05-13T07:00:00.000Z"
}
```

## Auth API

### 회원가입

```http
POST /auth/signup
```

요청:

```ts
interface SignUpRequest {
  id: string
  password: string
  name: string
}
```

```json
{
  "id": "user01",
  "password": "password123",
  "name": "홍길동"
}
```

응답:

```ts
interface SignUpResponse {
  user: User
}
```

```json
{
  "user": {
    "id": "user01",
    "name": "홍길동"
  }
}
```

상태 코드:

| Status | 의미 |
| --- | --- |
| `201` | 회원가입 성공 |
| `400` | 필수 값 누락 또는 형식 오류 |
| `409` | 이미 존재하는 아이디 |

회원가입 성공 시 자동 로그인 여부는 백엔드와 협의가 필요하다.
초기 구현에서는 회원가입 성공 후 프론트엔드가 로그인 페이지로 이동하는 흐름을 기본값으로 둔다.

### 로그인

```http
POST /auth/signin
```

요청:

```ts
interface SignInRequest {
  id: string
  password: string
}
```

```json
{
  "id": "user01",
  "password": "password123"
}
```

응답:

```ts
interface SignInResponse {
  user: User
}
```

```json
{
  "user": {
    "id": "user01",
    "name": "홍길동"
  }
}
```

상태 코드:

| Status | 의미 |
| --- | --- |
| `200` | 로그인 성공 |
| `400` | 필수 값 누락 또는 형식 오류 |
| `401` | 아이디 또는 비밀번호 불일치 |

로그인 성공 시 백엔드는 `Set-Cookie`로 세션 쿠키를 설정한다.

### 로그아웃

```http
POST /auth/signout
```

요청 본문 없음.

응답 본문 없음.

상태 코드:

| Status | 의미 |
| --- | --- |
| `204` | 로그아웃 성공 |
| `401` | 인증되지 않은 요청 |

로그아웃 성공 시 백엔드는 세션을 제거하고 쿠키를 만료시킨다.

예시:

```http
Set-Cookie: sessionId=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax
```

### 현재 사용자 조회

```http
GET /auth/me
```

요청 본문 없음.

응답:

```ts
interface MeResponse {
  user: User
}
```

```json
{
  "user": {
    "id": "user01",
    "name": "홍길동"
  }
}
```

상태 코드:

| Status | 의미 |
| --- | --- |
| `200` | 세션 사용자 조회 성공 |
| `401` | 유효한 세션 없음 |

프론트엔드는 앱 시작 시 이 API로 로그인 상태를 확인한다.

## Todo API

모든 Todo API는 인증이 필요하다.

백엔드는 요청 쿠키의 세션을 확인하고, 현재 로그인한 사용자의 Todo만 처리한다.
프론트엔드는 Todo 요청에 사용자 아이디를 직접 전달하지 않는다.

### Todo 목록 조회

```http
GET /todos
```

요청 본문 없음.

응답:

```ts
interface GetTodosResponse {
  todos: Todo[]
}
```

```json
{
  "todos": [
    {
      "id": "todo_1",
      "title": "라우터 추가하기",
      "completed": false,
      "createdAt": "2026-05-13T07:00:00.000Z",
      "updatedAt": "2026-05-13T07:00:00.000Z"
    }
  ]
}
```

상태 코드:

| Status | 의미 |
| --- | --- |
| `200` | 조회 성공 |
| `401` | 인증되지 않은 요청 |

### Todo 생성

```http
POST /todos
```

요청:

```ts
interface CreateTodoRequest {
  title: string
}
```

```json
{
  "title": "로그인 페이지 만들기"
}
```

응답:

```ts
interface CreateTodoResponse {
  todo: Todo
}
```

```json
{
  "todo": {
    "id": "todo_2",
    "title": "로그인 페이지 만들기",
    "completed": false,
    "createdAt": "2026-05-13T07:10:00.000Z",
    "updatedAt": "2026-05-13T07:10:00.000Z"
  }
}
```

상태 코드:

| Status | 의미 |
| --- | --- |
| `201` | 생성 성공 |
| `400` | 필수 값 누락 또는 형식 오류 |
| `401` | 인증되지 않은 요청 |

### Todo 수정

```http
PATCH /todos/:id
```

요청:

```ts
interface UpdateTodoRequest {
  title?: string
  completed?: boolean
}
```

```json
{
  "completed": true
}
```

응답:

```ts
interface UpdateTodoResponse {
  todo: Todo
}
```

```json
{
  "todo": {
    "id": "todo_2",
    "title": "로그인 페이지 만들기",
    "completed": true,
    "createdAt": "2026-05-13T07:10:00.000Z",
    "updatedAt": "2026-05-13T07:20:00.000Z"
  }
}
```

상태 코드:

| Status | 의미 |
| --- | --- |
| `200` | 수정 성공 |
| `400` | 수정할 필드 없음 또는 형식 오류 |
| `401` | 인증되지 않은 요청 |
| `404` | 현재 사용자의 Todo에서 찾을 수 없음 |

다른 사용자의 Todo 접근은 정보 노출을 줄이기 위해 `404` 응답을 권장한다.

### Todo 삭제

```http
DELETE /todos/:id
```

요청 본문 없음.

응답 본문 없음.

상태 코드:

| Status | 의미 |
| --- | --- |
| `204` | 삭제 성공 |
| `401` | 인증되지 않은 요청 |
| `404` | 현재 사용자의 Todo에서 찾을 수 없음 |

## 프론트엔드 기대 흐름

### 앱 시작

1. `GET /auth/me` 요청
2. `200`이면 로그인 상태로 처리
3. `401`이면 비로그인 상태로 처리

### 로그인

1. `POST /auth/signin`
2. 성공 시 백엔드가 세션 쿠키 설정
3. 프론트엔드는 Todo 페이지로 이동
4. 이후 Todo API 요청은 쿠키 기반으로 인증됨

### 로그아웃

1. `POST /auth/signout`
2. 성공 시 백엔드가 세션 제거 및 쿠키 만료
3. 프론트엔드는 로그인 페이지로 이동

## 협의 필요 항목

- 회원가입 성공 시 자동 로그인 여부
- 세션 쿠키 이름
  - 문서 예시는 `sessionId`
- 세션 만료 시간
- CORS 사용 여부
- 개발 환경에서 프론트엔드와 백엔드 도메인/포트가 다른 경우 쿠키 정책
- Todo 기존 필드와 실제 서버 데이터 모델의 차이
