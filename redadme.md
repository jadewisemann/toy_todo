# 태스크 관리 앱 - MVP 실습용 개발 문서

## 1. 프로젝트 개요

### 1.1 목표
가장 단순한 형태의 풀스택 Todo 앱을 만들면서 **Django REST Framework + React** 기본기를 익힌다.

### 1.2 기술 스택
- **Backend**: Django, Django REST Framework
- **Frontend**: React (Vite), Axios
- **Database**: SQLite (기본 내장)
- **인증**: ❌ 없음 (단일 사용자 가정)

### 1.3 학습 포인트
- Django Model → Serializer → ViewSet → URL 흐름 이해
- DRF의 ModelViewSet으로 CRUD 자동 매핑
- React에서 useState + useEffect로 API 호출
- RESTful API 설계 원칙

---

## 2. 기능 요구사항

### 필수 기능 (CRUD만)
- [ ] 태스크 목록 조회
- [ ] 태스크 생성 (제목 입력)
- [ ] 태스크 완료 토글 (체크박스)
- [ ] 태스크 삭제

### 제외된 기능 (단순화)
- ❌ 인증 / 로그인
- ❌ 하위 태스크 (Subtask)
- ❌ 우선순위
- ❌ 마감일
- ❌ 페이지네이션
- ❌ 필터링

---

## 3. ERD

```
┌─────────────────────┐
│       Task          │
├─────────────────────┤
│ id (PK) INT         │
│ title VARCHAR(200)  │
│ is_completed BOOL   │
│ created_at TIMESTAMP│
└─────────────────────┘
```

### 테이블 명세

#### Task
| 필드 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | INT | PK, AUTO | 고유 ID |
| title | VARCHAR(200) | NOT NULL | 할 일 제목 |
| is_completed | BOOLEAN | DEFAULT FALSE | 완료 여부 |
| created_at | TIMESTAMP | AUTO | 생성 시각 |

---

## 4. API 명세

### 공통 규약
- **Base URL**: `http://localhost:8000/api`
- **Content-Type**: `application/json`

### 엔드포인트

#### GET `/api/tasks/`
태스크 전체 목록 조회
```json
// Response 200
[
  {
    "id": 1,
    "title": "DRF 공부하기",
    "is_completed": false,
    "created_at": "2025-01-15T09:00:00Z"
  }
]
```

#### POST `/api/tasks/`
태스크 생성
```json
// Request
{ "title": "React 공부하기" }

// Response 201
{
  "id": 2,
  "title": "React 공부하기",
  "is_completed": false,
  "created_at": "2025-01-15T09:10:00Z"
}
```

#### PATCH `/api/tasks/{id}/`
태스크 수정 (주로 완료 토글)
```json
// Request
{ "is_completed": true }

// Response 200
{
  "id": 1,
  "title": "DRF 공부하기",
  "is_completed": true,
  "created_at": "..."
}
```

#### DELETE `/api/tasks/{id}/`
태스크 삭제
- **Response**: 204 No Content

### HTTP 상태 코드
| 코드 | 의미 |
|------|------|
| 200 | 조회/수정 성공 |
| 201 | 생성 성공 |
| 204 | 삭제 성공 |
| 400 | 유효성 검증 실패 |
| 404 | 리소스 없음 |

---

## 5. Backend 구조 (Django MVC ≈ MTV)

### 5.1 디렉토리 구조
```
backend/
├── config/
│   ├── settings.py
│   ├── urls.py            # 루트 URL
│   └── wsgi.py
├── todos/
│   ├── models.py          # Model (M)
│   ├── serializers.py     # Serializer
│   ├── views.py           # View (V) = Controller
│   └── urls.py            # 앱 URL
├── db.sqlite3
└── manage.py
```

### 5.2 구현 가이드

#### Model (`todos/models.py`)
```python
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
```

#### Serializer (`todos/serializers.py`)
```python
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'is_completed', 'created_at']
        read_only_fields = ['id', 'created_at']
```

#### View (`todos/views.py`)
```python
from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
```
> `ModelViewSet` 하나로 list/create/retrieve/update/partial_update/destroy 자동 매핑

#### URL (`todos/urls.py`)
```python
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = router.urls
```

#### Root URL (`config/urls.py`)
```python
from django.urls import path, include

urlpatterns = [
    path('api/', include('todos.urls')),
]
```

#### Settings 핵심 추가사항
```python
INSTALLED_APPS = [
    ...,
    'rest_framework',
    'corsheaders',
    'todos',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite 기본 포트
]
```

---

## 6. Frontend 구조 (React)

### 6.1 디렉토리 구조
```
frontend/
├── src/
│   ├── api/
│   │   └── todoApi.js       # Axios CRUD 함수
│   ├── components/
│   │   ├── TodoList.jsx     # 목록 렌더링
│   │   ├── TodoItem.jsx     # 개별 항목
│   │   └── TodoForm.jsx     # 입력 폼
│   ├── App.jsx              # 메인 컨테이너
│   └── main.jsx
├── package.json
└── vite.config.js
```

### 6.2 컴포넌트 인터페이스

```javascript
// Task 데이터 형태
{
  id: number,
  title: string,
  is_completed: boolean,
  created_at: string
}
```

#### `TodoForm` (입력 폼)
```javascript
Props:
  - onSubmit: (title: string) => void
```

#### `TodoList` (목록)
```javascript
Props:
  - tasks: Task[]
  - onToggle: (id: number, is_completed: boolean) => void
  - onDelete: (id: number) => void
```

#### `TodoItem` (개별 항목)
```javascript
Props:
  - task: Task
  - onToggle: (id: number, is_completed: boolean) => void
  - onDelete: (id: number) => void
```

### 6.3 API 함수 (`src/api/todoApi.js`)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const fetchTasks = () => api.get('/tasks/').then(res => res.data);
export const createTask = (title) => api.post('/tasks/', { title }).then(res => res.data);
export const updateTask = (id, data) => api.patch(`/tasks/${id}/`, data).then(res => res.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}/`);
```

### 6.4 App 컴포넌트 흐름
```javascript
App.jsx
├─ useState: tasks
├─ useEffect: fetchTasks() → setTasks
├─ handleAdd(title)     → createTask → setTasks
├─ handleToggle(id, c)  → updateTask → setTasks
├─ handleDelete(id)     → deleteTask → setTasks
└─ Render:
    <TodoForm onSubmit={handleAdd} />
    <TodoList
      tasks={tasks}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
```

---

## 7. 데이터 흐름

```
[User] 체크박스 클릭
    ↓
[TodoItem] onToggle(id, true) 호출
    ↓
[App] handleToggle 실행
    ↓
[todoApi] PATCH /api/tasks/{id}/  { is_completed: true }
    ↓
[Django] TaskViewSet.partial_update
    ↓ (Serializer 검증 → ORM Update)
[Response] 200 OK + 변경된 객체
    ↓
[App] setTasks로 상태 갱신
    ↓
[React] 리렌더링 → UI 반영
```

---

## 8. 개발 체크리스트

### Backend
- [ ] Django 프로젝트 생성 (`django-admin startproject config .`)
- [ ] todos 앱 생성 (`python manage.py startapp todos`)
- [ ] `pip install djangorestframework django-cors-headers`
- [ ] `settings.py`에 앱/미들웨어/CORS 등록
- [ ] Task 모델 작성 + `makemigrations` / `migrate`
- [ ] TaskSerializer 작성
- [ ] TaskViewSet 작성
- [ ] DefaultRouter로 URL 등록
- [ ] `python manage.py runserver`로 동작 확인

### Frontend
- [ ] Vite 프로젝트 생성 (`npm create vite@latest`)
- [ ] `npm install axios`
- [ ] todoApi.js 작성
- [ ] TodoForm 컴포넌트
- [ ] TodoItem 컴포넌트
- [ ] TodoList 컴포넌트
- [ ] App.jsx에서 상태 관리 + API 연동
- [ ] `npm run dev`로 동작 확인

---

## 9. 실습 진행 순서 (추천)

1. **Backend 먼저**: 모델 → Serializer → ViewSet → URL
2. **Postman/curl로 API 테스트**: 4가지 엔드포인트 모두 동작 확인
3. **Frontend 셋업**: Vite + Axios
4. **API 함수부터**: `todoApi.js`에 4개 함수 작성
5. **컴포넌트 작성**: TodoForm → TodoItem → TodoList 순
6. **App에서 통합**: useState + useEffect로 연결

---
