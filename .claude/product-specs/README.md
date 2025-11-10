# 8G 기능 명세서 인덱스

이 디렉토리는 8G 플랫폼의 모든 기능에 대한 상세 명세를 포함합니다.

**문서 버전**: 1.0
**최종 수정일**: 2025-11-11
**문서화 원칙**: [DOCUMENTATION_PRINCIPLES.md](../DOCUMENTATION_PRINCIPLES.md) 준수

---

## 📚 문서 구조

각 기능은 독립된 문서로 관리되며, 아래 인덱스를 통해 빠르게 접근할 수 있습니다.
모든 문서는 **200줄 이하**로 작성되며, 한글로 작성됩니다.

---

## 🎯 핵심 기능 (P0)

### [F-001: 비주얼 워크플로우 빌더](./F-001-워크플로우-빌더.md)
**우선순위**: P0 | **상태**: ✅ 구현완료

드래그앤드롭 인터페이스를 통한 워크플로우 설계

**핵심 기능**:
- React Flow 기반 그래프 에디터
- 노드 드래그앤드롭 생성
- 엣지 연결 및 조건 설정
- 자동 레이아웃 (Dagre 알고리즘)

**관련 파일**:
- `app/client/admin/workflowBuilder/WorkflowBuilderPage.tsx`
- `app/client/admin/workflowBuilder/utils/autoLayout.ts`

---

### [F-002: 블록 시스템](./F-002-블록-시스템.md)
**우선순위**: P0 | **상태**: ✅ 구현완료

20개 이상의 블록 타입을 지원하는 확장 가능한 시스템

**블록 카테고리**:
- 데이터 추출 (get-text, attribute-value, get-element-data)
- 상호작용 (event-click, keypress, scroll)
- 제어 흐름 (wait, element-exists)
- 통합 (fetch-api, ai-parse-data, transform-data)

**핵심 메커니즘**:
- Zod 스키마 기반 UI 자동 생성
- `GenericBlockNode` 단일 컴포넌트로 모든 블록 렌더링
- 런타임 유효성 검증

**관련 파일**:
- `app/client/admin/workflowBuilder/nodes/GenericBlockNode.tsx`
- `app/lib/schema-parser.ts`
- `scordi-extension` (외부 SDK)

---

### [F-003: 조건부 분기](./F-003-조건부-분기.md)
**우선순위**: P0 | **상태**: ✅ 구현완료

복잡한 조건 로직을 통한 워크플로우 분기 처리

**지원 조건 타입**:
- 비교 연산자: equals, regex, contains, exists
- 논리 연산자: AND, OR
- 표현식: JSONPath, JSONata

**UI 컴포넌트**:
- `EdgeConfigDialog`: 조건 빌더 인터페이스
- `SingleEquals`, `Multiple`: 조건 입력 컴포넌트
- Strategy 패턴 기반 조건 처리

**관련 파일**:
- `app/client/admin/workflowBuilder/edges/EdgeConfigDialog/`
- `app/client/admin/workflowBuilder/utils/conditionUtils.ts`

---

### [F-004: 변수 치환 시스템](./F-004-변수-치환.md)
**우선순위**: P0 | **상태**: ✅ 구현완료

동적 변수를 사용한 워크플로우 파라미터화

**변수 타입**:
- Static: 워크플로우 저장 시 정의
- Dynamic: 이전 스텝 결과 참조
- Context: 루프 내 자동 변수

**문법**:
```typescript
${vars.variableName}
$.steps.stepId.result.data
$.forEach.item
$.loop.index
```

**관련 파일**:
- `app/client/admin/workflowBuilder/VariablesDialog.tsx`
- `app/models/workflow/WorkflowRunner.ts`

---

### [F-005: 루프 설정](./F-005-루프-설정.md)
**우선순위**: P0 | **상태**: ✅ 구현완료

반복 작업을 위한 루프 설정

**루프 타입**:
- `forEach`: 배열 순회 (`$.steps.list.result.data`)
- `count`: 고정 횟수 반복 (숫자 또는 변수)

**컨텍스트 변수**:
- `$.forEach.item`: 현재 아이템
- `$.forEach.index`: 현재 인덱스
- `$.loop.index`: 반복 횟수

**관련 파일**:
- `app/client/admin/workflowBuilder/nodes/fieldBlock/RepeatFieldBlock.tsx`
- `app/models/workflow/types.ts`

---

### [F-006: JSONata 표현식 테스팅](./F-006-JSONata-테스팅.md)
**우선순위**: P0 | **상태**: ✅ 구현완료

실시간 JSONata 표현식 테스트 및 데이터 변환

**기능**:
- 실시간 표현식 평가
- 이전 스텝 결과 자동 로드
- 에러 메시지 표시
- 결과 미리보기

**일반 패턴**:
```javascript
// 필터링
items[price > 100]

// 변환
items.{ "name": name, "total": price * 2 }

// 중복 제거
$distinct(array)

// 집계
$sum(items.price)
```

**관련 파일**:
- `app/client/admin/workflowBuilder/nodes/fieldBlock/ExpressionFieldBlock.tsx`

---

### [F-007: 워크플로우 실행](./F-007-워크플로우-실행.md)
**우선순위**: P0 | **상태**: ✅ 구현완료

브라우저 확장을 통한 워크플로우 실행

**실행 흐름**:
1. Workflow JSON 빌드
2. 변수 주입
3. Extension SDK 호출
4. 브라우저 탭에서 실행
5. 결과 수집 및 표시

**SDK 메서드**:
- `EightGClient.collectWorkflow()`: 일반 워크플로우 실행
- `EightGClient.getWorkspaces()`: 워크스페이스 목록
- `EightGClient.getWorkspaceDetail()`: 워크스페이스 상세

**관련 파일**:
- `app/models/workflow/WorkflowRunner.ts`
- `scordi-extension` (외부 SDK)

---

### [F-008: 결과 시각화](./F-008-결과-시각화.md)
**우선순위**: P0 | **상태**: ✅ 구현완료

워크플로우 실행 결과 시각화 및 분석

**기능**:
- 스텝별 결과 표시
- JSON 포맷팅
- 에러 하이라이팅
- 결과 복사/내보내기

**관련 파일**:
- `app/client/admin/workflowBuilder/ResultPanel.tsx`

---

## 📦 중요 기능 (P1)

### [F-009: Import/Export](./F-009-Import-Export.md)
**우선순위**: P1 | **상태**: ✅ 구현완료

워크플로우 가져오기/내보내기 기능

**포맷**:
```json
{
  "version": "1.0",
  "metadata": {
    "description": "워크플로우 설명",
    "exportedAt": "2025-11-11T00:00:00Z"
  },
  "workflow": { ... }
}
```

**관련 파일**:
- `app/client/admin/workflowBuilder/utils/exportImport.ts`

---

### [F-010: 자동 레이아웃](./F-010-자동-레이아웃.md)
**우선순위**: P1 | **상태**: ✅ 구현완료

Dagre 알고리즘을 사용한 자동 노드 배치

**레이아웃 방향**:
- TB (Top to Bottom): 기본값
- LR (Left to Right): 대안

**설정**:
- 노드 간격: 100px
- 레벨 간격: 150px

**관련 파일**:
- `app/client/admin/workflowBuilder/utils/autoLayout.ts`

---

## 🔮 계획 중인 기능 (P2)

### [F-011: 워크플로우 버전 관리](./F-011-버전-관리.md)
**우선순위**: P2 | **상태**: 🔄 계획 중

워크플로우 버전 관리 시스템

**기능 (예정)**:
- 버전 히스토리 추적
- 이전 버전으로 롤백
- 버전 비교 (diff)
- 변경 이력 로그

---

### [F-012: 실시간 협업](./F-012-실시간-협업.md)
**우선순위**: P2 | **상태**: 🔄 계획 중

실시간 멀티유저 협업 기능

**기능 (예정)**:
- WebSocket 기반 동기화
- 사용자 커서 표시
- 변경 사항 실시간 반영
- 충돌 해결 메커니즘

---

### [F-013: 자동화 테스트](./F-013-자동화-테스트.md)
**우선순위**: P2 | **상태**: ⚠️ 미구현

자동화된 테스트 프레임워크

**테스트 레벨 (예정)**:
- Unit Testing: Jest + React Testing Library
- Integration Testing: 워크플로우 저장/실행 플로우
- E2E Testing: Playwright/Cypress

---

## 📋 기능 지원 매트릭스

| 기능 | 상태 | 우선순위 | UI | Backend | 테스트 | 문서 |
|-----|------|---------|----|----|----|----|
| 워크플로우 빌더 | ✅ | P0 | ✅ | ✅ | ❌ | ✅ |
| 블록 시스템 | ✅ | P0 | ✅ | ✅ | ❌ | ✅ |
| 조건부 분기 | ✅ | P0 | ✅ | ✅ | ❌ | ✅ |
| 변수 치환 | ✅ | P0 | ✅ | ✅ | ❌ | ✅ |
| 루프 설정 | ✅ | P0 | ✅ | ✅ | ❌ | ✅ |
| JSONata 테스팅 | ✅ | P0 | ✅ | ✅ | ❌ | ✅ |
| 워크플로우 실행 | ✅ | P0 | ✅ | ✅ | ❌ | ✅ |
| 결과 시각화 | ✅ | P0 | ✅ | N/A | ❌ | ✅ |
| Import/Export | ✅ | P1 | ✅ | ✅ | ❌ | ✅ |
| 자동 레이아웃 | ✅ | P1 | ✅ | N/A | ❌ | ✅ |
| 버전 관리 | 🔄 | P2 | ❌ | ❌ | ❌ | 🔄 |
| 실시간 협업 | 🔄 | P2 | ❌ | ❌ | ❌ | 🔄 |
| 자동화 테스트 | ⚠️ | P2 | N/A | N/A | ❌ | 🔄 |

**범례**:
- ✅ 구현완료/사용 가능
- 🔄 진행 중/계획됨
- ⚠️ 미구현
- ❌ 없음
- N/A 해당 없음

---

## 🔍 기능 간 관계도

### 컴포넌트별 기능 매핑

**WorkflowBuilderPage.tsx**
- F-001: 비주얼 워크플로우 빌더
- F-007: 워크플로우 실행
- F-008: 결과 시각화

**GenericBlockNode.tsx**
- F-002: 블록 시스템
- F-006: JSONata 표현식 테스팅

**EdgeConfigDialog/**
- F-003: 조건부 분기

**VariablesDialog.tsx**
- F-004: 변수 치환

**RepeatFieldBlock.tsx**
- F-005: 루프 설정

### 사용 사례별 기능 조합

**워크플로우 생성**
- F-001: 비주얼 워크플로우 빌더
- F-002: 블록 시스템
- F-003: 조건부 분기
- F-010: 자동 레이아웃

**워크플로우 실행**
- F-004: 변수 치환
- F-007: 워크플로우 실행
- F-008: 결과 시각화

**데이터 변환**
- F-002: 블록 시스템 (transform-data 블록)
- F-006: JSONata 표현식 테스팅

**워크플로우 관리**
- F-009: Import/Export 워크플로우
- F-011: 워크플로우 버전 관리 (계획)

---

## 📝 문서화 가이드

### 새 기능 문서 추가하기

1. 파일 생성: `F-XXX-기능명.md`
2. 템플릿 사용:
   ```markdown
   # F-XXX: 기능명

   **기능 ID**: F-XXX
   **우선순위**: P0/P1/P2/P3
   **상태**: ✅/🔄/⚠️
   **담당**: 팀명
   **최종 수정일**: YYYY-MM-DD

   ## 개요
   ## 사용자 스토리
   ## 기술 명세
   ## API 참조
   ## 알려진 이슈
   ## 향후 개선사항
   ```
3. 이 README에 인덱스 추가
4. 상호 참조 테이블 업데이트

### 문서 작성 기준

- **길이 제한**: 200줄 이하
- **언어**: 한글
- **코드 예시**: TypeScript/JSON 예시 포함
- **링크**: 관련 문서 명확히 연결
- **업데이트**: 기능 변경 시 즉시 갱신

---

## 🔗 관련 문서

- [PRD (제품 요구사항 명세)](../PRD.md)
- [기술 아키텍처](../../CLAUDE.md)
- [문서화 원칙](../DOCUMENTATION_PRINCIPLES.md)

---

**최종 수정일**: 2025-11-11
**담당자**: Product Team & Engineering Team
**리뷰 주기**: 월간
