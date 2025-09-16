# Database (TypeORM) 설정 가이드

이 프로젝트는 TypeORM을 사용하여 데이터베이스와 연결합니다.

## 📁 구조

```
app/api/db/
├── config.ts           # 데이터베이스 연결 설정
├── index.ts            # 메인 export 파일
├── entities/           # 엔티티 파일들
│   └── index.ts
└── scripts/
    └── generate-entities.js  # DB에서 엔티티 자동 생성 스크립트
```

## 🚀 사용법

### 1. 환경 변수 설정

`.env` 파일을 생성하고 데이터베이스 연결 정보를 입력하세요:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
```

### 2. 기존 데이터베이스에서 엔티티 자동 생성

```bash
npm run db:generate-entities
```

이 명령어는:
- 기존 데이터베이스의 테이블 구조를 분석
- TypeORM 엔티티 파일을 자동 생성
- `app/api/db/entities/` 디렉토리에 저장

### 3. 생성된 엔티티 사용

1. `app/api/db/entities/index.ts`에서 생성된 엔티티들을 export
2. 라우트나 API 핸들러에서 사용:

```typescript
import { AppDataSource, initializeDatabase } from '~/api/db';
import { User } from '~/api/db/entities';

// 데이터베이스 연결 초기화
await initializeDatabase();

// 엔티티 사용
const userRepository = AppDataSource.getRepository(User);
const users = await userRepository.find();
```

## ⚙️ 설정 특징

- **synchronize: false** - 기존 DB를 보호하기 위해 스키마 동기화 비활성화
- **logging: development 환경에서만** - 개발 시에만 SQL 로깅
- **MySQL 지원** - mysql2 드라이버 사용

## 🔧 추가 설정

### Migration 사용

필요한 경우 마이그레이션 파일을 `app/api/db/migrations/`에 추가할 수 있습니다.

### 다른 데이터베이스 사용

`app/api/db/config.ts`에서 데이터베이스 타입과 드라이버를 변경할 수 있습니다:

```typescript
// PostgreSQL 예시
type: 'postgres',
// SQLite 예시  
type: 'sqlite',
database: 'database.sqlite',
```